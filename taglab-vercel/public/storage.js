/* Shared storage with a session fallback. No tag or network dependency. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TagLabStorage=api.create(()=>globalThis.localStorage,()=>{if(typeof root.dispatchEvent==='function')root.dispatchEvent(new Event('taglab:storage'))});})(typeof window==='object'?window:globalThis,function(){
  'use strict';
  function create(provider,onChange=()=>{}){
    const memory=new Map(),invalid=new Set();let available=true,reason='';
    function fail(error){available=false;reason=error?.name||'StorageError';onChange()}
    function getItem(key){key=String(key);if(!available)return memory.get(key)??null;try{const value=provider().getItem(key);memory.set(key,value);return value}catch(error){fail(error);return memory.get(key)??null}}
    function setItem(key,value){key=String(key);value=String(value);memory.set(key,value);invalid.delete(key);if(!available)return false;try{provider().setItem(key,value);return true}catch(error){fail(error);return false}}
    function removeItem(key){key=String(key);memory.set(key,null);invalid.delete(key);if(!available)return false;try{provider().removeItem(key);return true}catch(error){fail(error);return false}}
    function readJSON(key,fallback=null){const raw=getItem(key);if(raw===null)return fallback;try{return JSON.parse(raw)??fallback}catch{invalid.add(key);onChange();return fallback}}
    function writeJSON(key,value){try{return setItem(key,JSON.stringify(value))}catch(error){fail(error);return false}}
    return Object.freeze({getItem,setItem,removeItem,readJSON,writeJSON,status:()=>({persistent:available,reason,invalidKeys:[...invalid]})});
  }
  return Object.freeze({create});
});
