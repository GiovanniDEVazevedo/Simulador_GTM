/* Bounded synthetic CSV exercises. Input stays in memory; no upload. */
(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./upd-core.js'):root.TagLabUPD);if(node)module.exports=api;else root.TagLabCSV=api;})(typeof window==='object'?window:globalThis,function(upd){
  'use strict';
  const fields={transactionId:'Referência da venda',eventTimestamp:'Data com fuso',conversionValue:'Valor',currency:'Moeda',email:'E-mail fictício opcional',gclid:'GCLID fictício opcional'};
  const sample='sale_id;date;value;currency;email;gclid\nTEST-CSV-001;2026-10-19T10:30:00-03:00;99,90;BRL;aluno@example.com;\nTEST-CSV-002;2026-10-19T13:35:00Z;49,90;BRL;;TEST_GCLID_EXEMPLO02';
  function parse(input,delimiter=';'){
    if(typeof input!=='string'||new TextEncoder().encode(input).length>100000)throw Error('Use um CSV de até 100 KB em UTF-8.');
    if(![',',';','\t'].includes(delimiter))throw Error('Separador inválido.');
    const text=input.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'),records=[],errors=[],ignoredEmptyLines=[];
    let row=[],value='',quoted=false,closed=false,line=1,startLine=1;
    function endField(){row.push(value);value='';closed=false}
    function endRow(){endField();if(row.every(x=>!x.trim()))ignoredEmptyLines.push(startLine);else records.push({line:startLine,cells:row});row=[];startLine=line+1}
    for(let i=0;i<text.length;i++){
      const char=text[i];
      if(quoted){if(char==='"'){if(text[i+1]==='"'){value+='"';i++}else{quoted=false;closed=true}}else{value+=char;if(char==='\n')line++}continue}
      if(char===delimiter){endField();continue}
      if(char==='\n'){endRow();line++;continue}
      if(char==='"'){if(value.length||closed)errors.push({line,path:'csv',message:'Aspas em posição inválida.'});else quoted=true;continue}
      if(closed){if(char!==' '&&char!=='\t')errors.push({line,path:'csv',message:'Caractere após o fechamento das aspas.'});continue}
      value+=char;
    }
    if(quoted)errors.push({line:startLine,path:'csv',message:'Campo entre aspas não foi fechado.'});
    if(value||row.length||closed)endRow();
    const header=records.shift(),headers=header?.cells.map(x=>x.trim())||[];
    if(!headers.length)errors.push({line:1,path:'cabecalho',message:'Cabeçalho ausente.'});
    if(new Set(headers).size!==headers.length||headers.some(x=>!x))errors.push({line:header?.line||1,path:'cabecalho',message:'Colunas precisam ter nomes únicos e preenchidos.'});
    if(records.length>50)errors.push({line:records[50].line,path:'limite',message:'Limite didático de 50 linhas de dados excedido. O lote não será exportado.'});
    for(const row of records)if(row.cells.length!==headers.length)errors.push({line:row.line,path:'csv',message:'Quantidade de colunas diferente do cabeçalho.'});
    return {headers,rows:records,errors,ignoredEmptyLines};
  }
  function dateWithZone(value){
    const text=String(value||'').trim(),m=text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/);
    if(!m||!Number.isFinite(Date.parse(text)))throw Error('Use data RFC 3339 com fuso explícito.');
    const [year,month,day,hour,minute,second]=m.slice(1,7).map(Number),calendar=new Date(Date.UTC(year,month-1,day));
    if(calendar.getUTCFullYear()!==year||calendar.getUTCMonth()!==month-1||calendar.getUTCDate()!==day||hour>23||minute>59||second>59)throw Error('Data ou hora não existe no calendário.');
    return new Date(text).toISOString();
  }
  async function transform(parsed,mapping,{decimal=',',adUserData='denied'}={}){
    const errors=[...parsed.errors],events=[],seen=new Set();
    if(![',','.'].includes(decimal))throw Error('Separador decimal inválido.');
    for(const field of ['transactionId','eventTimestamp','conversionValue','currency'])if(!parsed.headers.includes(mapping[field]))errors.push({line:1,path:field,message:'Mapeie uma coluna existente.'});
    if(errors.length)return {valid:false,errors,events:[],ignoredEmptyLines:parsed.ignoredEmptyLines};
    for(const row of parsed.rows){
      const get=key=>{const index=parsed.headers.indexOf(mapping[key]);return index<0?'':row.cells[index].trim()},event={eventSource:'WEB'};const rowErrors=[];
      const issue=(field,fn)=>{try{fn()}catch(error){rowErrors.push({line:row.line,path:field,message:error.message})}};
      issue('transactionId',()=>{const id=get('transactionId');if(!/^TEST-[A-Z0-9_-]{3,100}$/i.test(id))throw Error('Use referência sintética TEST- com ao menos três caracteres adicionais.');if(seen.has(id))throw Error('Referência repetida no lote.');seen.add(id);event.transactionId=id});
      issue('eventTimestamp',()=>event.eventTimestamp=dateWithZone(get('eventTimestamp')));
      issue('conversionValue',()=>{const value=get('conversionValue'),pattern=decimal===','?/^\d+(?:,\d{1,2})?$/:/^\d+(?:\.\d{1,2})?$/;if(!pattern.test(value))throw Error('Informe valor sem milhar e com até duas casas usando o decimal escolhido.');event.conversionValue=Number(value.replace(',','.'));if(!Number.isFinite(event.conversionValue))throw Error('Valor fora do intervalo numérico.');});
      issue('currency',()=>{const c=get('currency');if(!/^[A-Z]{3}$/.test(c))throw Error('Informe moeda com três letras maiúsculas.');event.currency=c});
      const email=get('email'),gclid=get('gclid');
      if(gclid)issue('gclid',()=>{if(!/^TEST_GCLID_[A-Z0-9_-]{8,}$/i.test(gclid))throw Error('Use apenas TEST_GCLID_ fictício.');event.adIdentifiers={gclid}});
      if(email)await(async()=>{try{if(adUserData!=='granted')throw Error('Conceda ad_user_data no exercício para incluir identidade.');const prepared=await upd.prepare(email,'');event.userData={userIdentifiers:[{emailAddress:prepared.hashed.sha256_email_address.toUpperCase()}]};}catch(error){rowErrors.push({line:row.line,path:'email',message:error.message})}})();
      if(!email&&!gclid)rowErrors.push({line:row.line,path:'identificador',message:'Mapeie um e-mail fictício ou GCLID fictício.'});
      errors.push(...rowErrors);if(!rowErrors.length)events.push(event);
    }
    return {valid:!errors.length,errors,events:errors.length?[]:events,previewCount:events.length,ignoredEmptyLines:parsed.ignoredEmptyLines,scope:'Transformação local com dados fictícios; sem chamada à API.'};
  }
  return Object.freeze({fields,sample,parse,transform,dateWithZone});
});
