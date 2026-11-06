/* Keyboard support for non-button controls marked role="button":
   Enter and Space activate them, like a native button. */
(function () {
  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!el || el.getAttribute('role') !== 'button' || el.tagName === 'BUTTON') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
})();
