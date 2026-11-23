(function () {
  var d = document, r = d.documentElement;

  try {
    var s = localStorage.getItem('theme');
    if (s) r.setAttribute('data-theme', s);
  } catch (e) {}

  d.querySelectorAll('.tbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var cur = r.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var n = cur === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', n);
      try { localStorage.setItem('theme', n); } catch (e) {}
    });
  });

  var mb = d.querySelector('.menu-btn'), nv = d.querySelector('.nav.hasmenu');
  if (mb && nv) {
    mb.addEventListener('click', function () {
      var o = nv.classList.toggle('open');
      mb.setAttribute('aria-expanded', String(o));
    });
    nv.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nv.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var pr = d.getElementById('progress');
  if (pr) {
    var f = function () {
      var h = r.scrollHeight - r.clientHeight;
      pr.style.width = (h > 0 ? (r.scrollTop / h * 100) : 0) + '%';
    };
    addEventListener('scroll', f, { passive: true });
    f();
  }

  var links = [].slice.call(d.querySelectorAll('.rail a'));
  if (links.length && 'IntersectionObserver' in window) {
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    d.querySelectorAll('.content section[id]').forEach(function (s) { o.observe(s); });
  }

  var lb = d.getElementById('lb');
  if (lb) {
    var li = lb.querySelector('img');
    var closeBtn = lb.querySelector('button');
    var lastTrigger = null;

    d.querySelectorAll('.content figure img').forEach(function (im) {
      im.setAttribute('tabindex', '0');
      im.setAttribute('role', 'button');
      if (!im.getAttribute('aria-label') && im.alt) {
        im.setAttribute('aria-label', 'Enlarge image: ' + im.alt);
      }
      var open = function () {
        lastTrigger = im;
        li.src = im.currentSrc || im.src;
        li.alt = im.alt;
        if (lb.showModal) {
          lb.showModal();
          if (closeBtn) closeBtn.focus();
        }
      };
      im.addEventListener('click', open);
      im.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.tagName === 'BUTTON') lb.close();
    });

    lb.addEventListener('close', function () {
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    });
  }
})();