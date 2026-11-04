// Polaroid stacks on the home page.
// 1. ".polaroid-container-2" stacks (pillars section): the four polaroids
//    take turns sliding out and landing on top. Hovering a pillar title
//    (#trigger-expand, #trigger-discover, #trigger-heal, #trigger-actualize)
//    brings that pillar's photo to the front.
// The polaroids around the motto quote are intentionally static.
// Animations only run while the stack is on screen.
(function () {
  var INTERVAL = 2500;
  var SLIDE_MS = 320;
  var angles = { 'image-expand': 2, 'image-discover': 1, 'image-heal': -2, 'image-actualize': -1 };
  var order = ['image-expand', 'image-discover', 'image-heal', 'image-actualize'];

  function visibleTimer(el, fn, ms, offset) {
    var timer = null, lead = null;
    function start() {
      if (timer || lead) return;
      lead = setTimeout(function () { lead = null; fn(); timer = setInterval(fn, ms); }, offset || 0);
    }
    function stop() {
      if (lead) { clearTimeout(lead); lead = null; }
      if (timer) { clearInterval(timer); timer = null; }
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(el);
    } else {
      start();
    }
    return { restart: function () { stop(); start(); } };
  }

  // ---- Pillar stacks ----
  var stacks = [];
  document.querySelectorAll('.polaroid-container-2').forEach(function (container, idx) {
    container.setAttribute('data-stack', idx + 1);
    var imgs = Array.prototype.slice.call(container.querySelectorAll('.pillar-polaroid'));
    if (imgs.length < 2) return;
    var z = 1, current = null, step = 0;
    imgs.forEach(function (img) {
      img.style.transform = 'rotate(' + (angles[img.id] || 0) + 'deg)';
      img.style.transition = 'transform .3s ease';
    });

    function show(id) {
      var img = imgs.filter(function (i) { return i.id === id; })[0];
      if (!img || current === id) return;
      current = id;
      var rot = ' rotate(' + (angles[id] || 0) + 'deg)';
      img.style.transform = 'translateX(110%)' + rot;
      setTimeout(function () {
        img.style.zIndex = ++z;
        setTimeout(function () { img.style.transform = 'translateX(0)' + rot; }, 20);
      }, SLIDE_MS);
    }
    function next() {
      // Cycle through every photo in the stack, in document order.
      show(imgs[step % imgs.length].id);
      step++;
    }
    // The container collapses (its photos are absolutely positioned), so
    // watch the first photo to know when the stack is on screen.
    // Each stack runs on its own rhythm so the two never move in unison.
    var timer = visibleTimer(imgs[0], next, INTERVAL + idx * 1100, idx * 1300);
    stacks.push({ show: show, timer: timer });
  });

  order.forEach(function (id) {
    var trigger = document.getElementById('trigger-' + id.replace('image-', ''));
    if (!trigger) return;
    trigger.addEventListener('mouseenter', function () {
      stacks.forEach(function (s) { s.show(id); s.timer.restart(); });
    });
  });

  // The four polaroids around the motto quote (.polaroid-container) stay still.
})();
