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
