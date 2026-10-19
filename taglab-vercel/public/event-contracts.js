(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabContracts=api;})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const finite=x=>typeof x==='number'&&Number.isFinite(x);
  const canonical=ec=>JSON.stringify({currency:ec.currency,value:ec.value,items:ec.items.map(x=>({id:x.item_id||x.item_name,price:x.price,quantity:x.quantity??1})).sort((a,b)=>String(a.id).localeCompare(String(b.id)))});
  function check(input,expected='purchase',previous=[]){
    const errors=[],warnings=[];let payload;
    const add=(path,message,origin='contrato do laboratório')=>errors.push({path,message,origin});
    try{if(typeof input==='string'&&input.length>50000)throw Error('Use um JSON de até 50 mil caracteres.');payload=typeof input==='string'?JSON.parse(input):input}catch(error){add('$',error.message);return {version:1,valid:false,errors,warnings}}
    if(!['add_to_cart','purchase'].includes(expected))throw Error('Contrato indisponível.');
    if(!object(payload)){add('$','Use um objeto JSON.');return {version:1,valid:false,errors,warnings}}
    if(payload.event!==expected)add('event','Esperado '+expected+'.');
    const ec=payload.ecommerce;
    if(!object(ec))add('ecommerce','Objeto de e-commerce ausente.');
    else{
      if(!/^[A-Z]{3}$/.test(ec.currency||''))add('ecommerce.currency','Informe uma moeda com três letras maiúsculas.');
      if(!finite(ec.value)||ec.value<0)add('ecommerce.value','Informe número finito maior ou igual a zero.');
      if(!Array.isArray(ec.items)||!ec.items.length)add('ecommerce.items','Informe ao menos um item.');
      else{
        ec.items.forEach((item,i)=>{const path='ecommerce.items['+i+']';if(!object(item)){add(path,'Item precisa ser um objeto.');return}if(![item.item_id,item.item_name].some(v=>typeof v==='string'&&v.trim()))add(path+'.item_id','Informe item_id ou item_name.');if(item.price!==undefined&&(!finite(item.price)||item.price<0))add(path+'.price','Preço deve ser número não negativo.');if(item.quantity!==undefined&&(!Number.isInteger(item.quantity)||item.quantity<1))add(path+'.quantity','Quantidade precisa ser inteiro positivo neste laboratório.');});
        if(!errors.length&&ec.items.every(x=>finite(x.price))){const total=Math.round(ec.items.reduce((sum,x)=>sum+x.price*(x.quantity??1),0)*100);if(Math.abs(total-Math.round(ec.value*100))>1)add('ecommerce.value','Valor diverge da soma dos itens; não incluir frete no valor dos itens.');}
      }
      if(expected==='purchase'){
        if(typeof ec.transaction_id!=='string'||!ec.transaction_id.trim())add('ecommerce.transaction_id','A compra exige referência da transação no contrato.');
        else if(!errors.length){const old=previous.find(x=>x.transactionId===ec.transaction_id);if(old&&old.signature!==canonical(ec))add('ecommerce.transaction_id','ID já observado com outra venda.');else if(old)warnings.push({path:'ecommerce.transaction_id',message:'Repetição da mesma referência. Investigue a origem do reenvio antes de criar outro ID.'});}
      }
    }
    return {version:1,valid:errors.length===0,errors,warnings,event:payload.event,transaction:errors.length===0&&expected==='purchase'?{transactionId:ec.transaction_id,signature:canonical(ec)}:null,evidenceLevel:'simulation',scope:'Validação local do contrato; recebimento externo não verificado.'};
  }
  function sample(event='purchase'){return {event,ecommerce:{currency:'BRL',value:99.9,...(event==='purchase'?{transaction_id:'TEST-CONTRATO-001'}:{}),items:[{item_id:'SKU-TEST',item_name:'Produto fictício',price:49.95,quantity:2}]}}}
  const faults=[
    {id:'duplicate',title:'FAL 01 Visualização duplicada',objective:'Manter uma fonte por visualização e explicar qual emissor foi removido.',broken:{events:[{event:'page_view',source:'manual'},{event:'page_view',source:'historico'}]},solution:{events:[{event:'page_view',source:'manual'}]}},
    {id:'trigger',title:'FAL 02 Tag sem disparo',objective:'Relacionar o nome do evento ao acionador configurado.',broken:{event:'add_to_cart',trigger:'addToCart'},solution:{event:'add_to_cart',trigger:'add_to_cart'}},
    {id:'stale',title:'FAL 03 Identidade antiga',objective:'Corrigir a revisão usada pela variável e respeitar revogação.',broken:{currentRevision:2,eventRevision:1,ad_user_data:'denied',hasUserData:true},solution:{currentRevision:2,eventRevision:2,ad_user_data:'denied',hasUserData:false}},
    {id:'transaction',title:'FAL 04 ID de outra venda',objective:'Conservar o ID na repetição da mesma venda e separar vendas novas.',broken:{sales:[{sale:'A',transactionId:'TEST-A'},{sale:'A',transactionId:'TEST-A'},{sale:'B',transactionId:'TEST-A'}]},solution:{sales:[{sale:'A',transactionId:'TEST-A'},{sale:'A',transactionId:'TEST-A'},{sale:'B',transactionId:'TEST-B'}]}}
  ];
  function diagnose(id,input){const f=faults.find(x=>x.id===id);if(!f)throw Error('Cenário inválido.');let x;try{x=typeof input==='string'?JSON.parse(input):input}catch{return {valid:false,message:'JSON inválido.'}}let valid=false;
    if(id==='duplicate')valid=Array.isArray(x?.events)&&x.events.length===1&&x.events[0].event==='page_view'&&['manual','historico'].includes(x.events[0].source);
    if(id==='trigger')valid=x?.event==='add_to_cart'&&x.trigger===x.event;
    if(id==='stale')valid=x?.currentRevision===2&&x.eventRevision===2&&x.ad_user_data==='denied'&&x.hasUserData===false;
    if(id==='transaction'&&Array.isArray(x?.sales)&&x.sales.length===3){const [a,b,c]=x.sales;valid=a?.sale==='A'&&b?.sale==='A'&&c?.sale==='B'&&a.transactionId==='TEST-A'&&b.transactionId===a.transactionId&&/^TEST-[A-Z0-9-]+$/.test(c.transactionId)&&c.transactionId!==a.transactionId;}
    return {valid,message:valid?'Correção local aceita. Explique a causa e a evidência usada.':f.objective,scope:'Cenário simulado; a loja e as tags reais não foram alteradas.'};
  }
  return Object.freeze({version:1,check,sample,faults,diagnose});
});
