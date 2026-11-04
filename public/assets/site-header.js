// Shared site header: hamburger toggle + scrolled background.
(function () {
  var header = document.querySelector('.sh');
  if (!header) return;
  var burger = header.querySelector('.sh-burger');
  var menu = header.querySelector('.sh-menu');

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!header.classList.contains('is-open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // Mark the current page's link.
  var path = location.pathname.replace(/\/$/, '') || '/';
  menu.querySelectorAll('a[href^="/"]').forEach(function (a) {
    var href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) a.setAttribute('aria-current', 'page');
  });

  // Give the header a background once the page is scrolled.
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
