(async function(){
  'use strict';
  const scripts=['competencies-core.js','learning-core.js','learning-lab.js','challenges-core.js','challenges-lab.js','event-contracts.js','missions-core.js','journey-lab.js','csv-core.js','scenarios-core.js','code-core.js','code-runner.js','advanced-lab.js','central-content-ui.js'];
  const script=src=>new Promise((resolve,reject)=>{const node=document.createElement('script');node.src='/'+src;node.onload=resolve;node.onerror=()=>reject(Error('Falha ao carregar '+src));document.head.append(node);});
  try{
    const result=await window.TagLabContentClient.load(window.TagLabContentConfig?.apiBaseUrl,window.TagLabQuestionBank);
    window.TagLabQuestionBank=result.bank;window.TagLabContentStatus={source:result.source,message:result.message};
    for(const src of scripts)await script(src);
    window.dispatchEvent(new CustomEvent('taglab:content-ready',{detail:window.TagLabContentStatus}));
  }catch(error){const note=document.createElement('p');note.className='notice';note.setAttribute('role','alert');note.textContent='O conteúdo de estudo não pôde ser iniciado. Atualize a página e confira os arquivos do deployment.';document.querySelector('main')?.prepend(note);console.error(error.message);}
})();
