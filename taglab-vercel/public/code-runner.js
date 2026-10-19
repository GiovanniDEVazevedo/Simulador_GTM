/* The main page never evaluates student code. Each attempt gets an opaque sandbox and Worker. */
(function(){
  'use strict';
  let running=false;
  function run(code,inputs){
    if(running)return Promise.reject(Error('Aguarde a execução atual.'));
    if(typeof code!=='string'||code.length>6000)return Promise.reject(Error('Use até 6000 caracteres de código.'));
    running=true;
    return new Promise((resolve,reject)=>{
      const frame=document.createElement('iframe'),id=crypto.randomUUID();let ready=false;
      frame.setAttribute('sandbox','allow-scripts');frame.hidden=true;frame.title='Executor de código isolado';frame.src='/runner-frame.html';
      const timeout=setTimeout(()=>finish(null,Error('O executor não respondeu no tempo esperado.')),3500);
      function finish(value,error){clearTimeout(timeout);window.removeEventListener('message',receive);frame.remove();running=false;error?reject(error):resolve(value)}
      function receive(event){if(event.source!==frame.contentWindow)return;const data=event.data;if(data?.type==='taglab:ready'&&!ready){ready=true;frame.contentWindow.postMessage({type:'taglab:run',id,code,inputs},'*')}else if(data?.type==='taglab:result'&&data.id===id){if(data.error)finish(null,Error(String(data.error).slice(0,500)));else if(Array.isArray(data.outputs)&&data.outputs.length===inputs.length)finish(data.outputs);else finish(null,Error('Resposta do executor fora do contrato.'))}}
      window.addEventListener('message',receive);document.body.append(frame);
    });
  }
  window.TagLabRunner=Object.freeze({run});
})();
