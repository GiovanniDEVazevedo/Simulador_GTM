const {test,before,after}=require('node:test'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const publicPath=path.join(__dirname,'../public');let server,browser,origin,canaryRequests=0;
before(async()=>{
 server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname.startsWith('/canary')){canaryRequests++;res.writeHead(200,{'Content-Type':'application/javascript'});res.end('export default 1');return}const file=path.resolve(publicPath,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));if(!file.startsWith(publicPath+path.sep))throw Error('path');const body=await fs.readFile(file),ext=path.extname(file),type={'.html':'text/html','.js':'application/javascript','.css':'text/css','.txt':'text/plain','.md':'text/plain'}[ext]||'application/octet-stream';res.writeHead(200,{'Content-Type':type+'; charset=utf-8'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.TAGLAB_CHROMIUM_EXECUTABLE||undefined,args:process.env.TAGLAB_CHROMIUM_EXECUTABLE?['--no-zygote']:[]});
 console.log('Browser validation:',browser.version());
});
after(async()=>{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve))});
async function open({mode='layer',blocked='',viewport={width:1440,height:1000},corrupt=false}={}){
 const context=await browser.newContext({viewport}),page=await context.newPage(),errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',route=>{const url=route.request().url();if(url.startsWith(origin))return route.continue();external.push(url);return route.fulfill({status:200,contentType:'application/javascript',body:''})});
 await context.addInitScript(({mode,blocked,corrupt})=>{
  localStorage.setItem('taglab_config',corrupt?'{':JSON.stringify({mode,gtm:'GTM-KW59VB3X',ga:'G-K3P3QWNJ38',gateway:'',debug:true}));
  if(blocked==='get')Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}});
  if(blocked==='set')Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
 },{mode,blocked,corrupt});
 await page.goto(origin,{waitUntil:'load'});await page.waitForFunction(()=>window.TagLab&&window.TagLabMissions&&window.TagLabRunner);
 return {page,context,errors,external};
}
const navigate=(page,tab)=>page.evaluate(tab=>window.TagLab.navigate(tab),tab);
const text=(page,selector)=>page.locator(selector).innerText();
test('full application boots with blocked storage and every tab remains usable',async()=>{
 for(const blocked of ['get','set']){const s=await open({blocked});try{
  for(const tab of ['loja','interacoes','upd','offline','exercicios','desafios','missoes','pratica','cenarios','tutoria','consentimento','config','guia']){await navigate(s.page,tab);assert(await s.page.locator('#'+tab).isVisible(),tab)}
  await s.page.locator('#toggle-theme').click();await s.page.locator('#toggle-monitor').click();await s.page.locator('#toggle-navigation').click();assert.match(await text(s.page,'#storage-status'),/sessão/);assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}}
});
test('corrupt saved configuration falls back safely and loaders remain exclusive for the three modes',async()=>{
 for(const mode of ['layer','gtm','ga4']){const s=await open({mode});try{const google=s.external.filter(x=>x.includes('googletagmanager.com'));assert.equal(google.length,mode==='layer'?0:1);if(mode==='gtm')assert(google[0].includes('gtm.js?id=GTM-KW59VB3X'));if(mode==='ga4')assert(google[0].includes('gtag/js?id=G-K3P3QWNJ38'));assert.deepEqual(s.errors,[])}finally{await s.context.close()}}
 const s=await open({corrupt:true});assert.deepEqual(s.errors,[]);assert.match(await text(s.page,'#storage-status'),/inválida/);await s.context.close();
});
test('GTM consent requires the template callback and applies revoke before the following event',async()=>{
 const s=await open({mode:'gtm'});try{
  await navigate(s.page,'consentimento');await s.page.locator('#consent-accept').click();assert.equal(await s.page.evaluate(()=>TagLab.getConsentStatus().ready),false);
  await s.page.evaluate(()=>{window.__applied=[];window.taglabRegisterConsent(value=>window.__applied.push(value))});await s.page.locator('#consent-deny').click();
  const state=await s.page.evaluate(()=>({ready:TagLab.getConsentStatus().ready,last:window.__applied.at(-1),updates:dataLayer.filter(x=>x[0]==='consent'&&x[1]==='update').length,event:TagLab.getEvents().filter(x=>x.payload.event==='consent_update').at(-1).payload}));
  assert(state.ready);assert.equal(state.last.ad_user_data,'denied');assert.equal(state.event.ad_user_data,'denied');assert.equal(state.updates,0);assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
test('purchase can be captured, checked and used in an explained mission without claiming external receipt',async()=>{
 const s=await open();try{
  await s.page.locator('#add-SKU-001').click();await s.page.locator('#checkout').click();await s.page.locator('#shipping-btn').click();await s.page.locator('#payment-btn').click();await s.page.locator('#purchase').click();
  await navigate(s.page,'pratica');await s.page.locator('#contract-capture').click();assert.match(await text(s.page,'#contract-results'),/Contrato local atendido/);
  const payload=JSON.parse(await s.page.locator('#contract-json').inputValue());delete payload.ecommerce.transaction_id;await s.page.locator('#contract-json').fill(JSON.stringify(payload));await s.page.locator('#contract-check').click();assert.match(await text(s.page,'#contract-results'),/ecommerce.transaction_id/);
  await navigate(s.page,'missoes');await s.page.locator('#mission-capture').click();await s.page.locator('#mission-explanation').fill('Conferi o evento purchase no dataLayer e falta comprovar a entrega no GA4 usando o DebugView.');await s.page.locator('#mission-complete').click();assert.match(await text(s.page,'#mission-status'),/Autoavaliação concluída/);
  const result=await s.page.evaluate(()=>TagLabStorage.readJSON('taglab_missions_v1'));assert.equal(result.missions.ecommerce.evidence[0].level,'local_push');assert.equal(result.missions.ecommerce.evidence[0].verifiedByTutor,false);
  await s.page.locator('#mission-study').click();assert(await s.page.locator('#exercicios').isVisible());assert.match(await text(s.page,'#learning-position'),/1/);assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
test('competency filters and a fault correction work and leaving the page restores inactive state',async()=>{
 const s=await open();try{
  await navigate(s.page,'exercicios');await s.page.selectOption('#learning-competency','api');assert.match(await text(s.page,'#learning-bank-result'),/de 96 questões/);
  await navigate(s.page,'pratica');await s.page.selectOption('#fault-select','stale');await s.page.locator('#fault-start').click();await s.page.locator('#fault-json').fill(JSON.stringify({currentRevision:2,eventRevision:2,ad_user_data:'denied',hasUserData:false}));await s.page.locator('#fault-explanation').fill('A variável consultava uma revisão antiga e conservava identidade após a revogação. Corrigi os dois campos.');await s.page.locator('#fault-check').click();assert.match(await text(s.page,'#fault-feedback'),/aceita/);
  await navigate(s.page,'loja');await navigate(s.page,'pratica');assert.equal(await s.page.locator('#fault-editor').isVisible(),false);assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
test('CSV mapping hashes only synthetic identity and invalidates its output after consent revocation',async()=>{
 const s=await open();try{
  await navigate(s.page,'consentimento');await s.page.locator('#consent-accept').click();await navigate(s.page,'pratica');await s.page.locator('#practice-view-csv').click();await s.page.locator('#csv-transform').click();await s.page.waitForFunction(()=>document.querySelector('#csv-output').textContent.includes('"valid": true'));
  const output=JSON.parse(await text(s.page,'#csv-output'));assert.equal(output.events.length,2);assert(!JSON.stringify(output).includes('aluno@example.com'));assert.equal(await s.page.locator('#csv-export').isDisabled(),false);
  await navigate(s.page,'consentimento');await s.page.locator('#consent-deny').click();await navigate(s.page,'pratica');assert.equal(await s.page.locator('#csv-export').isDisabled(),true);await s.page.locator('#csv-transform').click();await s.page.waitForFunction(()=>document.querySelector('#csv-status').textContent.includes('ad_user_data'));assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
test('isolated function runner grades output, interrupts loops and denies DOM storage network and nested workers',async()=>{
 const s=await open();try{
  await navigate(s.page,'pratica');await s.page.locator('#practice-view-code').click();await s.page.locator('#code-input').fill('return input.map(email => email.trim().toLowerCase());');await s.page.locator('#code-run').click();await s.page.waitForFunction(()=>document.querySelector('#code-feedback').textContent.includes('3 / 3'));
  for(const [id,source,total]of [['total','let sum = 0; for (const item of input) sum += item.price * item.quantity; return Math.round(sum * 100) / 100;',4],['response','if(input.status!==200)return "erro"; if(input.validateOnly)return "validado"; if(input.body.fieldWarnings?.length)return "revisar"; return ({PROCESSING:"pendente",SUCCESS:"processado"})[input.body.requestStatus]||"erro";',6]]){await s.page.selectOption('#code-task',id);await s.page.locator('#code-input').fill(source);await s.page.locator('#code-run').click();await s.page.waitForFunction(total=>document.querySelector('#code-feedback').textContent.includes(total+' / '+total),total);}
  const globals=await s.page.evaluate(()=>TagLabRunner.run('return [typeof window, typeof parent, typeof localStorage, typeof fetch, typeof Worker, typeof importScripts];',[[]]));assert.deepEqual(globals,[['undefined','undefined','undefined','undefined','undefined','undefined']]);
  const before=canaryRequests;await s.page.evaluate(url=>TagLabRunner.run('import('+JSON.stringify(url)+'); return 1;',[[]]),origin+'/canary.js');assert.equal(canaryRequests,before);
  const loop=await s.page.evaluate(async()=>{try{await TagLabRunner.run('while (true) {}',[[]]);return 'failed'}catch(e){return e.message}});assert.match(loop,/Tempo limite/);
  const size=await s.page.evaluate(async()=>{try{await TagLabRunner.run('return "x".repeat(40000);',[[]]);return 'failed'}catch(e){return e.message}});assert.match(size,/32 mil/);
  assert.equal(await s.page.locator('iframe[sandbox]').count(),0);assert.equal(await s.page.evaluate(()=>TagLab.getConfig().mode),'layer');
 }finally{await s.context.close()}
});
test('API virtual clock, gateway diagnosis and tutor export retain simulation and self-report labels',async()=>{
 const s=await open();try{
  await navigate(s.page,'cenarios');await s.page.selectOption('#api-scenario','transient');await s.page.locator('#api-start').click();await s.page.locator('#api-step').click();assert.match(await text(s.page,'#api-feedback'),/transitória/);await s.page.locator('#api-wait').click();await s.page.locator('#api-step').click();assert.match(await text(s.page,'#api-feedback'),/Ingestão simulada aceita/);
  await s.page.selectOption('#gateway-answer','routing');await s.page.locator('#gateway-diagnose').click();assert.match(await text(s.page,'#gateway-feedback'),/coerente/);
  await navigate(s.page,'tutoria');await s.page.locator('#tutor-context').fill('Ambiente local, modo somente dataLayer, consentimento negado.');await s.page.locator('#tutor-preview').click();const preview=JSON.parse(await text(s.page,'#tutor-report'));assert.equal(preview.protectedApproval,false);assert.equal(preview.rubric.length,4);
  const downloadPromise=s.page.waitForEvent('download');await s.page.locator('#tutor-export').click();const download=await downloadPromise;const downloaded=JSON.parse(await fs.readFile(await download.path(),'utf8'));assert.equal(downloaded.protectedApproval,false);assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
test('mobile dark layout and menu controls are usable without horizontal overflow',async()=>{
 const s=await open({viewport:{width:390,height:844}});try{
  await s.page.locator('#toggle-navigation').click();assert.equal(await s.page.locator('#toggle-navigation').getAttribute('aria-expanded'),'true');await s.page.locator('nav button[data-tab="missoes"]').click();assert(await s.page.locator('#missoes').isVisible());await s.page.locator('#toggle-navigation').click();await s.page.locator('#toggle-monitor').click();await s.page.locator('#toggle-theme').click();
  for(const tab of ['missoes','pratica','cenarios','tutoria']){await navigate(s.page,tab);const overflow=await s.page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,tab)}
  assert.deepEqual(s.errors,[]);
 }finally{await s.context.close()}
});
