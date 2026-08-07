/* Adaptive RM + Contact contrast — samples backdrop behind fixed nav */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const LUMINANCE_THRESHOLD = 0.42;

  function parseRGB(color) {
    if (!color) return null;
    const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/);
    if (!m) return null;
    return {
      r: +m[1],
      g: +m[2],
      b: +m[3],
      a: m[4] !== undefined ? +m[4] : 1,
    };
  }

  function hexToRGB(hex) {
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    if (h.length !== 6) return null;
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }

  function colorFromBackground(style) {
    const rgb = parseRGB(style.backgroundColor);
    if (rgb && rgb.a > 0.08) return rgb;

    const image = style.backgroundImage;
    if (!image || image === 'none') return null;

    const hexMatch = image.match(/#([0-9a-fA-F]{3,8})\b/);
    if (hexMatch) return hexToRGB('#' + hexMatch[1]);

    const rgbMatch = image.match(/rgba?\([^)]+\)/);
    if (rgbMatch) return parseRGB(rgbMatch[0]);

    return null;
  }

  function relativeLuminance(r, g, b) {
    const channel = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const rs = channel(r);
    const gs = channel(g);
    const bs = channel(b);
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function luminanceFromElement(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const color = colorFromBackground(getComputedStyle(node));
      if (color) return relativeLuminance(color.r, color.g, color.b);
      node = node.parentElement;
    }

    const bodyColor = colorFromBackground(getComputedStyle(document.body));
    if (bodyColor) return relativeLuminance(bodyColor.r, bodyColor.g, bodyColor.b);

    return 0.92;
  }

  function sampleAt(x, y) {
    const stack = document.elementsFromPoint(x, y);
    for (let i = 0; i < stack.length; i++) {
      if (nav.contains(stack[i])) continue;
      return luminanceFromElement(stack[i]);
    }
    return luminanceFromElement(document.body);
  }

  function samplePoints() {
    const rect = nav.getBoundingClientRect();
    const y = Math.max(0, rect.top + rect.height * 0.5);
    const points = [];

    const logo = nav.querySelector('.nav-logo');
    if (logo) {
      const lr = logo.getBoundingClientRect();
      points.push([lr.left + lr.width * 0.5, y]);
    }

    const cta = nav.querySelector('.nav-cta');
    if (cta && cta.offsetParent !== null && getComputedStyle(cta).display !== 'none') {
      const cr = cta.getBoundingClientRect();
      points.push([cr.left + cr.width * 0.5, y]);
    }

    if (!points.length) points.push([window.innerWidth * 0.5, y]);

    nav.classList.remove('nav-dark');
    nav.style.visibility = 'hidden';
    const values = points.map(([x, py]) => sampleAt(x, py));
    nav.style.visibility = '';

    return values;
  }

  function updateNavContrast() {
    const values = samplePoints();
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    nav.classList.toggle('nav-on-dark', avg < LUMINANCE_THRESHOLD);
  }

  let contrastTick = false;
  function scheduleContrastUpdate() {
    if (contrastTick) return;
    contrastTick = true;
    requestAnimationFrame(() => {
      contrastTick = false;
      updateNavContrast();
    });
  }

  updateNavContrast();
  window.addEventListener('scroll', scheduleContrastUpdate, { passive: true });
  window.addEventListener('resize', scheduleContrastUpdate);
  window.addEventListener('load', updateNavContrast);
  document.addEventListener('DOMContentLoaded', updateNavContrast);
})();

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
