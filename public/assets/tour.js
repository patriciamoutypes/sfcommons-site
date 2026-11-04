// "Explore The Space" guided tour: the photo panel follows the room you're on.
// Scrolling the list, hovering or focusing a room makes it active; the stage
// crossfades to that room's photos and cycles them while the room is active.
(function () {
  var tour = document.querySelector('.tour');
  if (!tour) return;
  var rooms = Array.prototype.slice.call(tour.querySelectorAll('.tour-room'));
  var photos = Array.prototype.slice.call(tour.querySelectorAll('.tour-photo'));
  var activeId = null, cycle = null, hoverLock = false;

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    rooms.forEach(function (r) { r.classList.toggle('is-active', r.dataset.room === id); });
    photos.forEach(function (p) { p.classList.toggle('is-active', p.dataset.room === id); });
    restartCycle();
  }

  function showPhoto(fig, idx) {
    var imgs = fig.querySelectorAll('img'), dots = fig.querySelectorAll('.tour-dot');
    imgs.forEach(function (im, i) { im.classList.toggle('is-on', i === idx); });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
    fig.dataset.idx = idx;
  }

  function restartCycle() {
    clearInterval(cycle);
    var fig = photos.filter(function (p) { return p.dataset.room === activeId; })[0];
    if (!fig) return;
    var n = fig.querySelectorAll('img').length;
    if (n < 2) return;
    cycle = setInterval(function () {
      showPhoto(fig, ((+fig.dataset.idx || 0) + 1) % n);
    }, 3500);
  }

  photos.forEach(function (fig) {
    fig.querySelectorAll('.tour-dot').forEach(function (dot, i) {
      dot.addEventListener('click', function () { showPhoto(fig, i); restartCycle(); });
    });
  });

  rooms.forEach(function (r) {
    r.addEventListener('mouseenter', function () { hoverLock = true; setActive(r.dataset.room); });
    r.addEventListener('mouseleave', function () { hoverLock = false; });
    r.addEventListener('focus', function () { setActive(r.dataset.room); });
  });

  // Scroll: the room nearest the middle of the viewport is active.
  var ticking = false;
  function onScroll() {
    if (ticking || hoverLock) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var mid = window.innerHeight * 0.45, best = null, bestD = Infinity;
      rooms.forEach(function (r) {
        var b = r.getBoundingClientRect();
        var d = Math.abs((b.top + b.height / 2) - mid);
        if (d < bestD) { bestD = d; best = r; }
      });
      if (best) setActive(best.dataset.room);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  setActive(rooms[0].dataset.room);
  onScroll();
})();

// "The Member Experience" day line: a marker shows the current time in San
// Francisco and what the house is doing right now.
(function () {
  var line = document.querySelector('.day-line');
  if (!line) return;
  var now = line.querySelector('.day-now');
  function update() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var h = +parts.find(function (p) { return p.type === 'hour'; }).value % 24;
    var m = +parts.find(function (p) { return p.type === 'minute'; }).value;
    var mins = h * 60 + m, open = 9 * 60, gong = 17 * 60 + 15, close = 22 * 60;
    var label, pct;
    if (mins < open) { label = 'Doors open at 9am'; pct = 0; }
    else if (mins < gong) { label = 'Right now: co-working'; pct = (mins - open) / (close - open) * 100; }
    else if (mins < close) { label = 'Right now: meeting house'; pct = (mins - open) / (close - open) * 100; }
    else { label = 'Closed for the night, back at 9am'; pct = 100; }
    now.style.left = pct + '%';
    now.querySelector('b').textContent = label;
    now.hidden = false;
  }
  update();
  setInterval(update, 60000);
})();

// Event pills: stagger the drop so each column stacks from the bottom up.
(function () {
  var wrap = document.querySelector('.pill-columns');
  if (!wrap) return;
  wrap.querySelectorAll('.pill-column').forEach(function (col) {
    var pills = col.querySelectorAll('.pill'), n = pills.length;
    pills.forEach(function (p, i) { p.style.setProperty('--d', ((n - 1 - i) * 0.11) + 's'); });
  });
  function go() { wrap.classList.add('is-live'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { go(); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(wrap);
  } else { go(); }
})();
