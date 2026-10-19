/* GTM uses a synchronous template callback. gtag commands are only updates in direct mode. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabConsent=api;})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  const keys=['analytics_storage','ad_storage','ad_user_data','ad_personalization'];
  const normalize=input=>Object.fromEntries(keys.map(key=>[key,input?.[key]==='granted'?'granted':'denied']));
  function create({mode,initial,command,notify=()=>{}}){
    let state=normalize(initial),listener=null,applied=false;
    const denied=normalize(null);
    if(mode==='ga4')command('consent','default',{...state,wait_for_update:500});
    // Denied bootstrap fallback prevents a missing GTM template from silently granting saved choices.
    if(mode==='gtm')command('consent','default',{...denied,wait_for_update:500});
    function apply(){applied=false;if(mode==='ga4'){command('consent','update',{...state});applied=true}else if(mode==='gtm'&&listener){try{listener({...state});applied=true}catch{listener=null}}notify();return status()}
    function register(callback){if(typeof callback!=='function')return false;listener=callback;apply();return applied}
    function update(next){state=normalize(next);return apply()}
    function status(){return {mode,ready:mode==='layer'||mode==='ga4'||applied,via:mode==='gtm'?(applied?'gtm-template':'template-pendente'):mode==='ga4'?'gtag':'local',state:{...state}}}
    return Object.freeze({update,register,status,get:()=>({...state})});
  }
  return Object.freeze({keys,normalize,create});
});
