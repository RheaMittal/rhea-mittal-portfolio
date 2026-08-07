/* Collage hero (Concept 4) — loading curtain that clears on scroll / hint / ~1.2s.
   Sticky overlay + tall runway so page content below scrolls normally after clear.
   Scroll-up within the runway reassembles the collage. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c4 = document.getElementById('c4');
  if (!c4) return;

  document.body.classList.add('c4-curtain');

  /* src, centerY%, centerX%, baseSide(px), rot, keepOnMobile
     Soft overlaps. CliquePrize: hero/system frames only — never Pricing.
     Paint order: OUTER first, CENTER last so presenting chips sit on top. */
  var PHOTOS = [
    /* OUTER — playground + about */
    ['assets/Terra Tales Card Game.jpg',                                        8, 20, 240,  8, true],
    ['assets/ElevenLabs Hackathon.png',                                         8, 68, 250, -7, true],
    ['assets/Book Design.jpg',                                                 68,  8, 230,  6, true],
    ['assets/Smeg Iron image.jpg',                                             60, 58, 230, -5, true],
    ['assets/boardgame design.png',                                            12, 52, 190,  3, false],
    ['assets/Crochet Business.png',                                            36, 88, 200,  9, true],
    ['assets/Illustratuion pt1.png',                                           78, 16, 210, -4, false],
    ['assets/About Me/Beyond Design/Adventure Sports.JPG',                     90, 18, 200, -9, true],
    ['assets/About Me/Beyond Design/Travel.jpg',                               50, 96, 180,  9, true],
    ['assets/About Me/Beyond Design/Music.jpeg',                               92, 58, 190,  4, false],
    ['assets/About Me/Beyond Design/Formula 1.jpg',                            34, 14, 190, -5, false],
    ['assets/About Me/Beyond Design/Reading.jpg',                              62, 92, 180,  7, true],
    ['assets/Me at the Havells office.jpeg',                                   92, 88, 170,  5, false],
    ["assets/About Me/HowIgothere/Bachelor's/Product sketching.jpg",           58, 16, 190, -6, false],
    ['assets/About Me/HowIgothere/Exchange Program/Ethnographic Research in Public.jpg', 28, 10, 180,  5, false],
    ['assets/About Me/Beyond Design/Crochet Business.png',                     22, 96, 170, -8, false],
    /* OUTER — visual case-study frames (collage JPEGs) */
    ['assets/collage/freetown-landing.jpg',                                    14,  4, 250, -8, true],
    ['assets/collage/cliqueprize-hero.jpg',                                    10, 44, 260,  5, true],
    ['assets/collage/techguy-hero.jpg',                                        86,  6, 260,  4, true],
    ['assets/collage/opsiq-dash.jpg',                                          86, 72, 250, -6, true],
    ['assets/collage/canvas-landing.jpg',                                      32, 80, 230, -4, true],
    ['assets/TechGuy/Admin dashboard.png',                                     50, 74, 210,  6, false],
    ['assets/Hero Image Landing Image.jpg',                                    48,  4, 200, -7, false],
    ['assets/collage/cliqueprize-system.jpg',                                  64, 76, 200, -6, false],
    /* Extra fillers — repeats far from primaries */
    ['assets/Terra Tales Card Game.jpg',                                       84, 50, 180, -3, false],
    ['assets/ElevenLabs Hackathon.png',                                        78, 28, 190,  8, false],
    ['assets/Smeg Iron image.jpg',                                             14, 72, 180,  2, false],
    /* CENTER last — presenting / work on top */
    ['assets/salesforce/screenshots/capstone-event-1.jpg',                     40, 34, 300,  4, true],
    ["assets/About Me/HowIgothere/Bachelor's/Presentation.png",                30, 56, 280, -6, true],
    ['assets/salesforce/screenshots/capstone-event-2.jpg',                     56, 48, 290,  7, true],
    ['assets/salesforce/screenshots/iteration-phase/iteration-team-01.jpg',    22, 26, 250, -4, true],
    ['assets/salesforce/screenshots/iteration-phase/iteration-whiteboard.jpg', 62, 24, 240,  5, true],
    ['assets/ABC Company/Working with my team.jpg',                            42, 66, 250, -3, true],
    ['assets/salesforce/screenshots/iteration-phase/iteration-team-02.jpg',    20, 40, 220,  6, false],
    ['assets/salesforce/screenshots/capstone-event-1.jpg',                     78, 88, 200, -8, false],
    ["assets/About Me/HowIgothere/Bachelor's/Presentation.png",                88, 42, 190,  3, false],
    ['assets/salesforce/screenshots/capstone-event-2.jpg',                     14, 88, 190,  5, false]
  ];

  function encodePath(p) {
    return p.split('/').map(function (part) {
      if (!part) return part;
      try { return encodeURIComponent(decodeURIComponent(part)); }
      catch (e) { return encodeURIComponent(part); }
    }).join('/');
  }

  function isMobileC4() { return window.innerWidth < 720; }

  var collage = document.getElementById('collage');
  var chips = [];

  function keepChipInView(el) {
    requestAnimationFrame(function () {
      if (!collage || !el.parentNode) return;
      var parent = collage.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      if (parent.width < 40 || parent.height < 40) return;
      var margin = 6;
      var dx = 0, dy = 0;
      if (r.left < parent.left + margin) dx += (parent.left + margin) - r.left;
      if (r.top < parent.top + margin) dy += (parent.top + margin) - r.top;
      if (r.right > parent.right - margin) dx += (parent.right - margin) - r.right;
      if (r.bottom > parent.bottom - margin) dy += (parent.bottom - margin) - r.bottom;
      if (!dx && !dy) return;
      var curL = parseFloat(el.style.left) || 0;
      var curT = parseFloat(el.style.top) || 0;
      el.style.left = (curL + (dx / parent.width) * 100) + '%';
      el.style.top = (curT + (dy / parent.height) * 100) + '%';
    });
  }

  function sizeFromNatural(el, img, base) {
    var nw = img.naturalWidth || 1;
    var nh = img.naturalHeight || 1;
    var aspect = nw / nh;
    var w, h;
    if (aspect >= 1) { w = base; h = base / aspect; }
    else { h = base; w = base * aspect; }
    el.style.width = Math.round(w) + 'px';
    el.style.height = Math.round(h) + 'px';
    keepChipInView(el);
  }

  function chipBaseTransform(rot) {
    return 'translate(-50%, -50%) rotate(' + rot + 'deg)';
  }

  function buildC4Collage() {
    if (!collage) return;
    collage.innerHTML = '';
    chips = [];
    var mobile = isMobileC4();
    var scale = mobile ? 0.66 : 1;
    PHOTOS.forEach(function (spec, i) {
      var src = spec[0], top = spec[1], left = spec[2], base = spec[3], rot = spec[4], keep = spec[5];
      if (mobile && !keep) return;

      var el = document.createElement('div');
      el.className = 'c4-chip';
      el.style.top = top + '%';
      el.style.left = left + '%';
      var b = Math.round(base * scale);
      el.style.width = b + 'px';
      el.style.height = Math.round(b * 0.72) + 'px';

      var img = document.createElement('img');
      img.alt = '';
      img.decoding = 'async';
      img.onload = function () { sizeFromNatural(el, img, b); };
      img.src = encodePath(src);
      el.appendChild(img);
      collage.appendChild(el);

      var dx = left - 50;
      var dy = top - 48;
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 10) {
        var a = (i / PHOTOS.length) * Math.PI * 2;
        dx = Math.cos(a); dy = Math.sin(a); len = 1;
      }
      chips.push({
        el: el,
        rot: rot,
        ux: (dx / len) * 1200,
        uy: (dy / len) * 950
      });
      el.style.transform = chipBaseTransform(rot);
      if (img.complete && img.naturalWidth) sizeFromNatural(el, img, b);
    });
  }

  var center = document.getElementById('c4Center');
  var hint = document.getElementById('c4Hint');
  var tint = document.getElementById('c4Tint');

  var c4Progress = 0;
  var c4Mode = 'idle';
  var c4Timer = null;
  var c4Raf = null;
  var c4IgnoreScrollUntil = 0;
  var c4ScrollBound = false;

  function smoothstep(t) {
    t = Math.min(Math.max(t, 0), 1);
    return t * t * (3 - 2 * t);
  }

  function c4Runway() {
    return Math.max(1, c4.offsetHeight - window.innerHeight);
  }

  function progressFromScrollY() {
    var top = c4.offsetTop;
    var max = c4Runway();
    var y = (window.scrollY || window.pageYOffset || 0) - top;
    return Math.min(Math.max(y / (max * 0.8), 0), 1);
  }

  function scrollInstant(y) {
    try {
      window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    } catch (err) {
      window.scrollTo(0, y);
    }
  }

  function syncC4Scroll(p) {
    var top = c4.offsetTop;
    var max = c4Runway();
    c4IgnoreScrollUntil = performance.now() + 80;
    scrollInstant(top + p * max * 0.8);
  }

  function renderC4(p) {
    c4Progress = Math.min(Math.max(p, 0), 1);
    var eased = smoothstep(c4Progress);
    chips.forEach(function (c) {
      var tx = c.ux * eased;
      var ty = c.uy * eased;
      var sc = 1 - 0.35 * eased;
      c.el.style.transform =
        'translate(-50%, -50%) translate(' + tx + 'px,' + ty + 'px) rotate(' + (c.rot + eased * c.rot * 2.5) + 'deg) scale(' + sc + ')';
      c.el.style.opacity = String(Math.max(0, 1 - eased * 1.35));
    });
    if (tint) tint.style.opacity = String(Math.max(0, 1 - eased));
    var textEased = smoothstep(Math.min(1, c4Progress / 0.7));
    if (center) {
      center.style.opacity = String(0.9 + 0.1 * textEased);
      center.style.transform = 'scale(' + (0.97 + 0.03 * textEased) + ')';
      center.classList.toggle('ready', c4Progress > 0.9);
    }
    if (hint) {
      hint.style.opacity = String(Math.max(0, 1 - c4Progress * 3));
      hint.style.pointerEvents = c4Progress > 0.35 ? 'none' : 'auto';
    }
    var revealed = c4Progress > 0.92;
    c4.classList.toggle('revealed', revealed);
    document.body.classList.toggle('c4-revealed', revealed);
    if (revealed && c4Mode !== 'scroll' && c4Mode !== 'auto' && c4Mode !== 'tween') {
      c4Mode = 'done';
    }
  }

  function clearC4Timer() {
    if (c4Timer) { clearTimeout(c4Timer); c4Timer = null; }
  }

  function clearC4Raf() {
    if (c4Raf) { cancelAnimationFrame(c4Raf); c4Raf = null; }
  }

  function finishC4Clear() {
    c4ScrollBound = true;
    c4Mode = 'done';
    renderC4(1);
    syncC4Scroll(1);
  }

  function tweenC4ToOne(modeName) {
    clearC4Timer();
    clearC4Raf();
    if (c4Progress >= 0.99) { finishC4Clear(); return; }
    c4Mode = modeName || 'tween';
    var start = performance.now();
    var duration = reduce ? 1 : 1400;
    var from = c4Progress;
    function step(now) {
      if (c4Mode === 'scroll') { c4Raf = null; return; }
      var t = Math.min(1, (now - start) / duration);
      var p = from + (1 - from) * smoothstep(t);
      renderC4(p);
      syncC4Scroll(p);
      if (t < 1) {
        c4Raf = requestAnimationFrame(step);
      } else {
        c4Raf = null;
        finishC4Clear();
      }
    }
    c4Raf = requestAnimationFrame(step);
  }

  function armC4Auto() {
    clearC4Timer();
    clearC4Raf();
    c4Mode = 'wait';
    if (reduce) {
      finishC4Clear();
      return;
    }
    c4Timer = setTimeout(function () {
      c4Timer = null;
      if (c4Mode !== 'wait') return;
      tweenC4ToOne('auto');
    }, 1200);
  }

  function onC4Wheel(e) {
    if (c4Mode === 'auto' || c4Mode === 'tween') return;
    var y = window.scrollY || window.pageYOffset || 0;
    var top = c4.offsetTop;
    var max = c4Runway();
    var clearY = top + max * 0.8;
    var pastClear = y > clearY + 2;
    var dy = e.deltaY || 0;
    if (Math.abs(dy) < 1) return;
    /* Fully clear + scrolling down: don't syncScroll (would pin to clearY) */
    if (c4Progress >= 0.99 && dy > 0) return;
    /* Past the disperse runway — let the page scroll normally */
    if (pastClear) return;
    if (c4Mode === 'done' || c4ScrollBound || c4Mode === 'wait' || c4Mode === 'scroll') {
      clearC4Timer();
      clearC4Raf();
      c4Mode = 'scroll';
      c4ScrollBound = true;
      var next = c4Progress + dy / 900;
      renderC4(next);
      syncC4Scroll(c4Progress);
      if (c4Progress >= 0.99) c4Mode = 'done';
    }
  }

  function onC4Scroll() {
    if (c4Mode === 'auto' || c4Mode === 'tween') return;
    if (performance.now() < c4IgnoreScrollUntil) return;
    var y = window.scrollY || window.pageYOffset || 0;
    var top = c4.offsetTop;
    var max = c4Runway();
    var pastClear = y > top + max * 0.8 + 2;

    if (c4Mode === 'wait' && y > top + 4) {
      clearC4Timer();
      c4Mode = 'scroll';
      c4ScrollBound = true;
    }

    if (pastClear) {
      if (c4Progress < 0.99) renderC4(1);
      c4Mode = 'done';
      return;
    }

    if (c4Mode === 'done' && c4ScrollBound) {
      c4Mode = 'scroll';
    }
    if (c4Mode !== 'scroll') return;
    var p = progressFromScrollY();
    renderC4(p);
    if (p >= 0.99) c4Mode = 'done';
  }

  function onC4HintClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (c4Mode === 'done' && c4Progress >= 0.99) return;
    tweenC4ToOne('tween');
  }

  /* Scramble "ship." */
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var c4ScrambleTimers = [];
  var c4ScrambleInterval = null;

  function clearC4Scramble() {
    c4ScrambleTimers.forEach(clearTimeout);
    c4ScrambleTimers = [];
    if (c4ScrambleInterval) { clearInterval(c4ScrambleInterval); c4ScrambleInterval = null; }
  }

  function scrambleEl(el, finalText, duration) {
    var frame = 0;
    var totalFrames = Math.floor(duration / 16);
    if (c4ScrambleInterval) clearInterval(c4ScrambleInterval);
    c4ScrambleInterval = setInterval(function () {
      frame++;
      var progress = frame / totalFrames;
      el.textContent = finalText.split('').map(function (char, i) {
        if (char === ' ') return ' ';
        if (i < Math.floor(finalText.length * progress)) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      if (frame >= totalFrames) {
        el.textContent = finalText;
        clearInterval(c4ScrambleInterval);
        c4ScrambleInterval = null;
      }
    }, 16);
  }

  function runC4Scramble() {
    clearC4Scramble();
    if (reduce) return;
    var el = document.querySelector('#c4Center .scramble');
    if (!el) return;
    var txt = el.dataset.final || el.textContent;
    el.dataset.final = txt;
    el.textContent = txt;
    c4ScrambleTimers.push(setTimeout(function () {
      scrambleEl(el, txt, 800);
    }, 300));
  }

  function initC4() {
    clearC4Timer();
    clearC4Raf();
    clearC4Scramble();
    c4Mode = 'idle';
    c4Progress = 0;
    c4ScrollBound = false;
    c4.classList.remove('revealed');
    document.body.classList.remove('c4-revealed');
    buildC4Collage();
    renderC4(0);
    runC4Scramble();
    c4IgnoreScrollUntil = performance.now() + 200;
    scrollInstant(0);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        scrollInstant(0);
        renderC4(0);
        armC4Auto();
      });
    });
  }

  if (hint) hint.addEventListener('click', onC4HintClick);
  window.addEventListener('scroll', function () { requestAnimationFrame(onC4Scroll); }, { passive: true });
  window.addEventListener('wheel', onC4Wheel, { passive: true });
  var c4ResizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(c4ResizeTimer);
    c4ResizeTimer = setTimeout(function () {
      var p = c4Progress;
      var mode = c4Mode;
      buildC4Collage();
      renderC4(p);
      if (mode === 'wait') armC4Auto();
    }, 150);
  });

  initC4();
})();
