/* FAST-GC subsection controls: preserves existing chapter pages and anchor URLs. */
(function () {
  function install() {
    document.querySelectorAll('.fastgc-section-nav').forEach(el => el.remove());
    const article = document.querySelector('article.md-content__inner');
    if (!article) return;
    const headings = Array.from(article.querySelectorAll('h2[id]')).filter(h => !h.closest('.fastgc-section-nav'));
    if (headings.length < 2) return;
    const addLink = (nav, label, target, klass) => {
      const a = document.createElement('a'); a.textContent = label; a.href = target;
      if (klass) a.className = klass;
      nav.appendChild(a);
    };
    headings.forEach((heading, i) => {
      const nav = document.createElement('nav');
      nav.className = 'fastgc-section-nav'; nav.setAttribute('aria-label', 'Section navigation');
      if (i > 0) addLink(nav, 'â† Previous section', '#' + headings[i-1].id);
      addLink(nav, 'â†‘ Top', '#');
      const back = document.createElement('button');
      back.type = 'button'; back.textContent = 'â†¶ Back';
      back.setAttribute('aria-label', 'Go back to previous page');
      back.addEventListener('click', () => { if (history.length > 1) history.back(); else location.href = document.querySelector('.md-header__title a')?.href || '/'; });
      nav.appendChild(back);
      if (i < headings.length - 1) addLink(nav, 'Next section â†’', '#' + headings[i+1].id, 'fastgc-next');
      if (i + 1 < headings.length) headings[i+1].before(nav);
      else article.appendChild(nav);
    });
  }
  if (typeof document$ !== 'undefined') document$.subscribe(install);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();


/* FAST-GC sidebar section shortcuts v2 */
(function () {
  function updateSidebar() {
    document.querySelectorAll('.fastgc-toc-heading,.fastgc-toc-list').forEach(e=>e.remove());
    const sidebar=document.querySelector('.md-sidebar--primary .md-nav--primary .md-nav__list');
    const article=document.querySelector('article.md-content__inner');
    if (!sidebar || !article) return;
    const headings=[...article.querySelectorAll('h2[id]')];
    if (!headings.length) return;
    const header=document.createElement('li');
    header.className='fastgc-toc-heading';
    header.textContent='On this page';
    sidebar.appendChild(header);
    const wrapper=document.createElement('li');
    const list=document.createElement('ul');
    list.className='fastgc-toc-list';
    for (const heading of headings) {
      const item=document.createElement('li');
      const link=document.createElement('a');
      link.href='#'+encodeURIComponent(heading.id);
      link.textContent=heading.textContent.trim().replace(/??$/,'').trim();
      link.addEventListener('click',()=>{if (window.matchMedia('(max-width: 76.24em)').matches) {
        const toggle=document.querySelector('input[data-md-toggle="drawer"]');
        if (toggle) toggle.checked=false;
      }});
      item.appendChild(link); list.appendChild(item);
    }
    wrapper.appendChild(list); sidebar.appendChild(wrapper);
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(entry.isIntersecting){
        list.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));
        const a=list.querySelector('a[href="#'+CSS.escape(encodeURIComponent(entry.target.id))+'"]');
        if(a)a.setAttribute('aria-current','location');
      }}
    },{rootMargin:'-15% 0px -75% 0px'});
    headings.forEach(h=>observer.observe(h));
    if (window.__fastgcSidebarObserver) window.__fastgcSidebarObserver.disconnect();
    window.__fastgcSidebarObserver=observer;
  }
  if(typeof document$!=='undefined') document$.subscribe(updateSidebar);
  else if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',updateSidebar);
  else updateSidebar();
})();
