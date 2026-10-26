(function(){
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage=d.querySelector('.stage'), pin=stage.querySelector('.pin'), row=d.getElementById('row');
  var text=stage.querySelector('.stage__text'), cap=stage.querySelector('.stage__cap');
  var cur=0;
  function show(n){
    if(n===cur) return;
    [].forEach.call(row.querySelectorAll('.pf'), function(pf){
      var s=+pf.getAttribute('data-set');
      if(s===n){ pf.classList.remove('out'); pf.classList.add('on'); }
      else if(pf.classList.contains('on')){ pf.classList.remove('on'); if(!reduce){ pf.classList.add('out'); setTimeout(function(){ pf.classList.remove('out'); }, 900); } }
    });
    [].forEach.call(cap.querySelectorAll('.cap'), function(c){ c.classList.toggle('on', +c.getAttribute('data-set')===n); });
    cur=n;
  }
  function fit(){
    row.style.removeProperty('--fw'); stage.classList.remove('nopin');
    if(reduce) return;
    var cs=getComputedStyle(pin), cols=window.innerWidth<=900?2:4, rows=4/cols;
    var gap=parseFloat(getComputedStyle(row).columnGap)||12;
    var avail=pin.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)-text.offsetHeight-cap.offsetHeight-2*parseFloat(cs.rowGap||16);
    var fh=(avail-(rows-1)*gap)/rows, fw=Math.floor(fh*3/4);
    var maxw=(row.clientWidth-(cols-1)*gap)/cols;
    if(fw<Math.min(130,maxw)){ stage.classList.add('nopin'); return; }
    if(fw<maxw) row.style.setProperty('--fw', fw+'px');
  }
  function onScroll(){
    if(reduce) return;
    var p;
    if(stage.classList.contains('nopin')){ var rr=row.getBoundingClientRect(); p=rr.top<window.innerHeight*0.25?1:0; }
    else{ var r=stage.getBoundingClientRect(), span=stage.offsetHeight-pin.offsetHeight; p=span>0 ? Math.min(1,Math.max(0,-r.top/span)) : 0; }
    show(p<0.5?0:1);
  }
  fit(); onScroll();
  window.addEventListener('resize', function(){ fit(); onScroll(); });
  window.addEventListener('scroll', onScroll, {passive:true});
  if(window.ResizeObserver) new ResizeObserver(fit).observe(pin);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ root.classList.remove('pre'); }); });
})();
