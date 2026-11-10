(() => {
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('#project-list [data-types]')];
  let currentFilter = 'all';
  function filterProjects(value) {
    currentFilter = value;
    filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    cards.forEach(card => { card.hidden = value !== 'all' && !card.dataset.types.split(' ').includes(value); });
  }
  filterButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
  try {
    const state = JSON.parse(sessionStorage.getItem('portfolio-list-state') || 'null');
    if (state && document.querySelector('#project-list')) {
      filterProjects(state.filter || 'all');
      if (new URLSearchParams(location.search).has('return')) {
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({top:state.scroll || 0,behavior:'instant'})));
      }
    }
  } catch (_) {}
  document.querySelectorAll('a[data-project]').forEach(link => link.addEventListener('click', () => {
    try { sessionStorage.setItem('portfolio-list-state', JSON.stringify({filter:currentFilter,scroll:window.scrollY})); } catch (_) {}
  }));
  const returnLink = document.querySelector('[data-return]');
  if (returnLink) {
    try { if (sessionStorage.getItem('portfolio-list-state')) returnLink.href = '../index.html?return=1#projects'; } catch (_) {}
  }
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const groups={home:'home',guide:'resume',resume:'resume',projects:'projects','all-projects':'projects',about:'about',working:'about',career:'career',skills:'skills',tools:'skills',contact:'contact'};
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const active=groups[visible[0].target.id];
      navLinks.forEach(link => { if (link.hash === '#' + active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    }, {rootMargin:'-15% 0px -60% 0px',threshold:0});
    Object.keys(groups).forEach(id => { const section=document.getElementById(id); if(section) observer.observe(section); });
  }
  const dialog=document.querySelector('.image-dialog');
  if (dialog) {
    const dialogImage=dialog.querySelector('.dialog-image');
    const dialogTitle=dialog.querySelector('.dialog-title');
    let trigger=null;
    document.querySelectorAll('[data-enlarge]').forEach(button => button.addEventListener('click', () => {
      trigger=button;dialogImage.src=button.dataset.enlarge;dialogImage.alt=button.dataset.caption;dialogTitle.textContent=button.dataset.caption;dialog.showModal();document.body.classList.add('modal-open');
    }));
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(trigger) trigger.focus();});
  }
})();
