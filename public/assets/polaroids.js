// Polaroid stacks on the home page.
// 1. ".polaroid-container-2" stacks (pillars section): the four polaroids
//    take turns sliding out and landing on top. Hovering a pillar title
//    (#trigger-expand, #trigger-discover, #trigger-heal, #trigger-actualize)
//    brings that pillar's photo to the front.
// 2. ".polaroid-container" pairs (heal / actualize section): the two photos
//    swap places on a timer.
// Animations only run while the stack is on screen.
(function () {
  var INTERVAL = 2500;
  var SLIDE_MS = 320;
  var angles = { 'image-expand': 2, 'image-discover': 1, 'image-heal': -2, 'image-actualize': -1 };
  var order = ['image-expand', 'image-discover', 'image-heal', 'image-actualize'];

  function visibleTimer(el, fn, ms) {
    var timer = null;
    function start() { if (!timer) timer = setInterval(fn, ms); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
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
  document.querySelectorAll('.polaroid-container-2').forEach(function (container) {
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
      show(order[step % order.length]);
      step++;
    }
    // The container collapses (its photos are absolutely positioned), so
    // watch the first photo to know when the stack is on screen.
    var timer = visibleTimer(imgs[0], next, INTERVAL);
    stacks.push({ show: show, timer: timer });
  });

  order.forEach(function (id) {
    var trigger = document.getElementById('trigger-' + id.replace('image-', ''));
    if (!trigger) return;
    trigger.addEventListener('mouseenter', function () {
      stacks.forEach(function (s) { s.show(id); s.timer.restart(); });
    });
  });

  // ---- Heal / actualize pairs ----
  document.querySelectorAll('.polaroid-container').forEach(function (container) {
    var top = container.querySelector('.polaroid:not(.polaroid-bottom)');
    var bottom = container.querySelector('.polaroid.polaroid-bottom');
    if (!top || !bottom) return;
    var baseTransform = getComputedStyle(top).transform;
    if (baseTransform === 'none') baseTransform = '';
    top.style.transition = 'transform .3s ease';
    var dir = container.classList.contains('polaroid-container-right') ? '-110%' : '110%';

    function swap() {
      top.style.transform = 'translateX(' + dir + ') ' + baseTransform;
      setTimeout(function () {
        var a = top.getAttribute('src'), b = bottom.getAttribute('src');
        var as = top.getAttribute('srcset'), bs = bottom.getAttribute('srcset');
        top.setAttribute('src', b); bottom.setAttribute('src', a);
        if (as || bs) {
          bs ? top.setAttribute('srcset', bs) : top.removeAttribute('srcset');
          as ? bottom.setAttribute('srcset', as) : bottom.removeAttribute('srcset');
        }
        setTimeout(function () { top.style.transform = baseTransform; }, 20);
      }, SLIDE_MS);
    }
    visibleTimer(container, swap, INTERVAL + 700);
  });
})();
