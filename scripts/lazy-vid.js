/* Viewport videos: load near view, play on screen, pause off screen.
   Heroes above the fold load immediately (no IntersectionObserver wait). */
(function initViewportVideos() {
  function resolveSrc(raw) {
    if (!raw) return '';
    return raw.split('/').map(function (part) {
      if (!part) return part;
      try {
        return encodeURIComponent(decodeURIComponent(part));
      } catch (e) {
        return encodeURIComponent(part);
      }
    }).join('/');
  }

  function loadVideo(video) {
    if (video.dataset.loaded === 'true') return;
    var src = video.dataset.src;
    if (src) {
      video.src = resolveSrc(src);
      video.load();
      video.dataset.loaded = 'true';
      return;
    }
    var source = video.querySelector('source[data-src]');
    if (source) {
      source.src = resolveSrc(source.getAttribute('data-src'));
      source.removeAttribute('data-src');
      video.load();
      video.dataset.loaded = 'true';
    }
  }

  function tryPlay(v) {
    var play = function () {
      v.play().catch(function () {});
    };
    if (v.readyState >= 2) play();
    else {
      v.addEventListener('loadeddata', play, { once: true });
      v.addEventListener('canplay', play, { once: true });
    }
  }

  function isHero(v) {
    return (
      v.classList.contains('cs-hero-video') ||
      !!(v.closest && (v.closest('.cs-hero-band') || v.closest('.hero-photo-wrap') || v.closest('.hero-right')))
    );
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          loadVideo(v);
          tryPlay(v);
        } else if (!v.paused) {
          v.pause();
        }
      });
    },
    { threshold: 0, rootMargin: '200px 0px' }
  );

  document.querySelectorAll('video.lazy-vid').forEach(function (v) {
    if (isHero(v)) {
      loadVideo(v);
      tryPlay(v);
    }
    obs.observe(v);
  });
})();
