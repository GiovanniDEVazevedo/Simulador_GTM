/* Apply before the page paints; theme preference is independent of lab settings. */
(function(){
  'use strict';
  const key='taglab_theme',root=document.documentElement;
  const system=typeof window.matchMedia==='function'?window.matchMedia('(prefers-color-scheme: dark)'):null;
  let preference=null;
  try{const saved=localStorage.getItem(key);if(saved==='dark'||saved==='light')preference=saved}catch{}
  function apply(){
    const dark=preference?preference==='dark':!!system?.matches;
    root.dataset.theme=dark?'dark':'light';
    const toggle=document.getElementById('toggle-theme');
    if(toggle){toggle.setAttribute('aria-pressed',String(dark));toggle.title=dark?'Desativar modo escuro':'Ativar modo escuro'}
    const color=document.getElementById('theme-color');
    if(color)color.content=dark?'#0b1220':'#f4f6fa';
  }
  apply();
  function bind(){
    document.getElementById('toggle-theme')?.addEventListener('click',()=>{
      preference=root.dataset.theme==='dark'?'light':'dark';
      try{localStorage.setItem(key,preference)}catch{}
      apply();
    });
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
  system?.addEventListener('change',()=>{if(!preference)apply()});
  window.addEventListener('storage',event=>{
    if(event.key!==key&&event.key!==null)return;
    preference=event.newValue==='dark'||event.newValue==='light'?event.newValue:null;
    apply();
  });
})();
