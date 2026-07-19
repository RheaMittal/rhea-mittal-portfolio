/* Nav pill sliding indicator — shared across all pages */
(function () {
  const pill = document.querySelector('.nav-pill');
  if (!pill) return;
  const links = Array.from(pill.querySelectorAll('a'));
  if (!links.length) return;

  let indicator = pill.querySelector('.nav-pill-indicator');
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = 'nav-pill-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    pill.insertBefore(indicator, pill.firstChild);
  }

  function place(el, animate) {
    if (!el) return;
    const run = () => {
      indicator.style.width = el.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + el.offsetLeft + 'px)';
      indicator.style.opacity = '1';
    };
    if (!animate) {
      const prev = indicator.style.transition;
      indicator.style.transition = 'none';
      run();
      indicator.offsetHeight;
      indicator.style.transition = prev || '';
    } else {
      run();
    }
  }

  const active = pill.querySelector('a.active');
  const currIdx = active ? links.indexOf(active) : -1;
  const prevIdx = sessionStorage.getItem('navPrevIndex');

  links.forEach((a, i) => {
    a.addEventListener('click', () => {
      const from = active ? links.indexOf(active) : i;
      sessionStorage.setItem('navPrevIndex', String(from));
    });
    a.addEventListener('mouseenter', () => place(a, true));
  });

  pill.addEventListener('mouseleave', () => {
    if (active) place(active, true);
    else indicator.style.opacity = '0';
  });

  window.addEventListener('load', () => {
    if (prevIdx !== null && currIdx >= 0 && Number(prevIdx) !== currIdx && links[Number(prevIdx)]) {
      place(links[Number(prevIdx)], false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => place(active, true));
      });
    } else if (active) {
      place(active, false);
      requestAnimationFrame(() => { indicator.style.opacity = '1'; });
    }
  });

  window.addEventListener('resize', () => {
    if (active) place(active, false);
  });
})();
