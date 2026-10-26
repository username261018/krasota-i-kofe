(function(){
  var d=document, root=d.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top=d.getElementById('top');
  function setTop(){ if(top) root.style.setProperty('--toph', top.offsetHeight+'px'); }
  setTop(); window.addEventListener('resize', setTop);
  if(window.ResizeObserver && top) new ResizeObserver(setTop).observe(top);

  // menu
  var burger=d.querySelector('.burger'), nav=d.getElementById('nav');
  function setMenu(open){ if(!burger) return; burger.setAttribute('aria-expanded', open?'true':'false'); burger.setAttribute('aria-label', open?'Закрыть меню':'Меню'); nav.classList.toggle('open', open); }
  if(burger){
    burger.addEventListener('click', function(){ setMenu(burger.getAttribute('aria-expanded')!=='true'); });
    nav.addEventListener('click', function(e){ if(e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function(e){ if(e.key==='Escape' && nav.classList.contains('open')){ setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function(){ if(window.innerWidth>1020) setMenu(false); });
  }

  // reveal
  var items=[].slice.call(d.querySelectorAll('.rv,[data-reel]'));
  if(reduce || !('IntersectionObserver' in window)){ items.forEach(function(el){ el.classList.add('in'); }); }
  else{
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {rootMargin:'0px 0px -8% 0px', threshold:0.05});
    items.forEach(function(el){ io.observe(el); });
  }

  // reels
  [].forEach.call(d.querySelectorAll('[data-reel]'), function(reel){
    var track=reel.querySelector('.reel__track'), slides=track.children, n=slides.length;
    var prev=reel.querySelector('[data-dir="-1"]'), next=reel.querySelector('[data-dir="1"]'), cnt=reel.querySelector('.reel__count');
    function step(){ return slides.length>1 ? slides[1].offsetLeft-slides[0].offsetLeft : track.clientWidth; }
    function idx(){ return Math.round(track.scrollLeft/step()); }
    function upd(){
      var i=Math.min(n-1, idx()), max=track.scrollWidth-track.clientWidth-2;
      var vis=Math.max(1, Math.round(track.clientWidth/step()));
      var last=Math.min(n, i+vis);
      cnt.textContent=(vis>1 ? (i+1)+'–'+last : (i+1))+' / '+n;
      prev.disabled=track.scrollLeft<=2; next.disabled=track.scrollLeft>=max;
    }
    function go(dir){ track.scrollTo({left:Math.max(0,(idx()+dir))*step(), behavior: reduce?'auto':'smooth'}); }
    prev.addEventListener('click', function(){ go(-1); });
    next.addEventListener('click', function(){ go(1); });
    track.addEventListener('keydown', function(e){ if(e.key==='ArrowRight'){ e.preventDefault(); go(1);} if(e.key==='ArrowLeft'){ e.preventDefault(); go(-1);} });
    var t; track.addEventListener('scroll', function(){ clearTimeout(t); t=setTimeout(upd,60); }, {passive:true});
    window.addEventListener('resize', upd); upd();
  });

  // map on click
  var mo=d.querySelector('.map__open');
  if(mo) mo.addEventListener('click', function(e){
    e.preventDefault();
    var f=d.createElement('iframe'); f.src=mo.getAttribute('data-src'); f.title='Карта: Нижний Новгород, улица Белинского, 110'; f.loading='lazy'; f.setAttribute('allowfullscreen','');
    mo.parentNode.replaceChild(f, mo);
  });
})();
