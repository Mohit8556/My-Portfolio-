/* ============================================================
   Mohit Kumar portfolio - main.js
   Plain JavaScript, no libraries. Sections in this file:
     1. fit the big PORTFOLIO word to the hero
     2. pages (Home / Gallery) + scroll spy for the navbar
     3. gallery: photo list, justified layout, full-screen viewer
     4. build animation: blue wireframes, arrow cursors, bottom bar
   ============================================================ */
(function () {
  /* ---------- fit the PORTFOLIO word to the hero width ---------- */
  function fitGhost() {
    var gh = document.querySelector('.ghost span'), hero = document.querySelector('.hero');
    if (!gh || !hero || !hero.offsetWidth) return;
    var box = gh.parentNode; box.style.fontSize = '100px';
    var w = gh.getBoundingClientRect().width; if (!w) return;
    var fs = Math.min(100 * hero.clientWidth * 0.98 / w, 320);
    box.style.fontSize = fs + 'px';
  }
  addEventListener('resize', fitGhost);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGhost);

  /* ---------- pages: home, gallery, scroll spy ---------- */
  var homeView = document.getElementById('homeView'), galleryView = document.getElementById('galleryView');
  var view = 'home';
  var navLinks = [].slice.call(document.querySelectorAll('#nav a'));
  var spyIds = ['home', 'about', 'skills', 'education', 'certifications', 'experience', 'projects', 'contact'];
  function spy() {
    var cur = view;
    if (view === 'home') {
      cur = 'home';
      spyIds.forEach(function (id) { var e = document.getElementById(id); if (e && e.getBoundingClientRect().top <= 140) cur = id; });
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) cur = 'contact';
    }
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-s') === cur); });
  }
  function route() {
    var h = location.hash.replace('#', '');
    var next = h === 'gallery' ? 'gallery' : 'home';
    var changed = next !== view;
    view = next;
    homeView.hidden = next !== 'home'; galleryView.hidden = next !== 'gallery';
    var hd = document.getElementById('hud'); if (hd) hd.hidden = next !== 'home' || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (changed) {
      var t = next === 'home' && h ? document.getElementById(h) : null;
      if (t) t.scrollIntoView(); else scrollTo(0, 0);
    }
    if (next === 'home') fitGhost();
    if (next === 'gallery') layoutGal();
    spy();
  }
  addEventListener('hashchange', route);
  addEventListener('scroll', spy, { passive: true });
  route();
  (function () {
    var h = location.hash.replace('#', ''), t = h && h !== 'gallery' && document.getElementById(h);
    if (t) t.scrollIntoView();
  })();


  /* ==========================================================
     GALLERY
     To add a photo: put the file in images/gallery/ and add one
     line to the GALLERY list below (src = file path, w and h =
     the photo's width and height in pixels).
     To remove a photo: delete its line.
     ========================================================== */
  var GALLERY = [
    { src: 'images/gallery/photo-01.jpg', w: 543, h: 724 },
    { src: 'images/gallery/photo-02.jpg', w: 836, h: 470 },
    { src: 'images/gallery/photo-03.jpg', w: 540, h: 959 },
    { src: 'images/gallery/photo-04.jpg', w: 1100, h: 825 },
    { src: 'images/gallery/photo-05.jpg', w: 825, h: 1100 },
    { src: 'images/gallery/photo-06.jpg', w: 512, h: 768 },
    { src: 'images/gallery/photo-07.jpg', w: 540, h: 635 },
    { src: 'images/gallery/photo-08.jpg', w: 632, h: 422 },
    { src: 'images/gallery/photo-09.jpg', w: 836, h: 470 },
    { src: 'images/gallery/photo-10.jpg', w: 1100, h: 825 },
    { src: 'images/gallery/photo-11.jpg', w: 734, h: 1100 }
  ];

  var grid = document.getElementById('galGrid');
  var regShots = function () {};            // filled in by the build animation further down
  var galList = GALLERY, lbIdx = 0, lb = null, lbImg, lbCount, lbLast = null;

  function renderGallery() {
    grid.innerHTML = '';
    GALLERY.forEach(function (d, idx) {
      var f = document.createElement('figure'); f.className = 'shot';
      f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'Open photo ' + (idx + 1));
      f.addEventListener('click', function () { openLb(idx); });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(idx); } });
      f.dataset.ar = d.w / d.h;
      var img = document.createElement('img'); img.alt = d.caption || 'Photo of Mohit Kumar'; img.loading = 'lazy'; img.src = d.src;
      f.appendChild(img);
      if (d.caption) { var c = document.createElement('figcaption'); c.className = 'mono'; c.textContent = d.caption; f.appendChild(c); }
      grid.appendChild(f);
    });
    layoutGal(); regShots();
  }

  /* ---------- full-screen photo viewer (lightbox) ---------- */
  function buildLb() {
    lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML = '<button class="lb-x" type="button" aria-label="Close">&times;</button><button class="lb-n lb-prev" type="button" aria-label="Previous photo">&#8249;</button><img class="lb-img" alt=""><button class="lb-n lb-next" type="button" aria-label="Next photo">&#8250;</button><div class="lb-c mono"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('.lb-img'); lbCount = lb.querySelector('.lb-c');
    lb.querySelector('.lb-x').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); stepLb(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) closeLb(); });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1);
    });
    addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') stepLb(1); else if (e.key === 'ArrowLeft') stepLb(-1);
    });
  }
  function showLb() {
    var d = galList[lbIdx]; if (!d) return;
    lbImg.src = d.src; lbImg.alt = d.caption || 'Photo of Mohit Kumar';
    lbCount.textContent = (lbIdx + 1) + ' / ' + galList.length + (d.caption ? '  ·  ' + d.caption : '');
  }
  function openLb(i) {
    if (!lb) buildLb();
    lbLast = document.activeElement; lbIdx = i; showLb(); lb.hidden = false;
    document.documentElement.style.overflow = 'hidden'; lb.querySelector('.lb-x').focus();
  }
  function closeLb() { lb.hidden = true; document.documentElement.style.overflow = ''; if (lbLast && lbLast.focus) lbLast.focus(); }
  function stepLb(n) { if (!galList.length) return; lbIdx = (lbIdx + n + galList.length) % galList.length; showLb(); }

  /* ---------- gallery layout: rows that fill the full width ---------- */
  function layoutGal() {
    if (typeof grid === 'undefined' || !grid || galleryView.hidden) return;
    var W = Math.floor(grid.clientWidth); if (!W) return;
    var phone = W < 600, gap = 12, target = W < 600 ? 170 : W < 1000 ? 230 : 280, cap = target * 1.25;
    var figs = [].slice.call(grid.children), row = [], sum = 0;
    function flush(last) {
      if (!row.length) return;
      var avail = W - (row.length - 1) * gap, h = avail / sum;
      if (last) h = Math.min(h, cap);
      h = Math.round(h); var used = 0;
      row.forEach(function (it, i) {
        var w = i === row.length - 1 ? avail - used : Math.floor(avail * it.ar / sum);
        used += w; it.f.style.width = w + 'px'; it.f.style.height = h + 'px';
      });
      row = []; sum = 0;
    }
    figs.forEach(function (f) {
      var ar = parseFloat(f.dataset.ar) || 1.33;
      if (phone && row.length && (ar > 1.2 || row[0].ar > 1.2)) flush(false);
      row.push({ f: f, ar: ar }); sum += ar;
      if (phone ? (row.length >= 2 || ar > 1.2) : (W - (row.length - 1) * gap) / sum <= target) flush(false);
    });
    flush(true);
  }
  addEventListener('resize', layoutGal);

  renderGallery();

  /* ---------- build sequence + agent cursors ---------- */
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hud = document.getElementById('hud');
  if (reduce) { hud.hidden = true; return; }

  var MAP = [
    ['.brand', 'logo'], ['.top nav', 'nav'], ['.hello', 'text'], ['h1', 'heading'], ['.role', 'label'],
    ['.hero-copy .lede', 'text'], ['.btns', 'buttons'], ['.loc', 'label'], ['.hero-insta', 'label'], ['.ghost', 'display'],
    ['.portrait', 'image'], ['.stats', 'stats'], ['.marquee', 'marquee'], ['.tools', 'tools'],
    ['.eyebrow', 'label'], ['h2', 'heading'], ['.about p', 'text'], ['.facts', 'list'], ['.skill', 'card'], ['.certs', 'cards'], ['.adm-card', 'card'], ['.adm .lede', 'text'],
    ['.build .panel', 'card'], ['.build .stack', 'card'], ['.sub', 'label'], ['.row', 'row'],
    ['.contact .lede', 'text'], ['.item', 'row'], ['.empty', 'card'], ['.proj', 'card'], ['.shot', 'image'], ['.gal .lede', 'text'], ['.gal-bar', 'buttons'], ['footer', 'footer']
  ];
  var els = [].slice.call(document.querySelectorAll(MAP.map(function (m) { return m[0]; }).join(',')));
  var items = els.map(function (el) {
    var m = MAP.filter(function (x) { return el.matches(x[0]); })[0];
    return { el: el, tag: m[1], state: 'pre', count: !galleryView.contains(el)  };
  });

  regShots = function () {
    for (var k = items.length - 1; k >= 0; k--) if (!items[k].el.isConnected) items.splice(k, 1);
    [].slice.call(document.querySelectorAll('.shot')).forEach(function (el) {
      if (items.some(function (i) { return i.el === el; })) return;
      el.classList.add('pre'); items.push({ el: el, tag: 'image', state: 'pre', count: false });
    });
  };
  var layer = document.createElement('div'); layer.id = 'wires'; document.body.appendChild(layer);
  var hudN = document.getElementById('hudN'), hudBar = document.getElementById('hudBar'), hudS = document.getElementById('hudS');
  var total = items.filter(function (i) { return i.count; }).length;
  document.getElementById('hudT').textContent = total;

  /* agents */
  var COLS = ['#e5202f', '#3de0ff', '#2f6bff', '#ffffff', '#ffd23d', '#5dff9a', '#ff6ad5', '#e5202f', '#3de0ff', '#b18cff', '#ff9a3d', '#2f6bff'];
  var N = COLS.length;
  var agents = COLS.map(function (c, i) {
    var el = document.createElement('div'); el.className = 'arrow';
    el.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1 L13 6 L7 7.5 L5.5 13 Z" fill="' + c + '" stroke="#0a0709" stroke-width="1" stroke-linejoin="round"/></svg><span class="nm" style="background:' + c + '">agent-' + (i < 9 ? '0' : '') + (i + 1) + '</span>';
    document.body.appendChild(el);
    return { i: i, el: el, svg: el.firstChild, x: Math.random() * innerWidth, y: Math.random() * innerHeight, rot: 0, work: null, w: false, wp: { x: 0, y: 0, t: 0 } };
  });
  var mx = -999, my = -999, lastMove = 0, seen = false;
  addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; lastMove = performance.now(); seen = true; });
  document.addEventListener('mouseleave', function () { seen = false; });
  setTimeout(function () { document.body.classList.add('agents-on'); }, 400);

  function frame(now) {
    var active = seen && now - lastMove < 1800;
    for (var j = 0; j < N; j++) {
      var a = agents[j], tx, ty, k, working = false;
      if (a.work && now < a.work.until) {
        var r = a.work.el.getBoundingClientRect();
        tx = Math.min(Math.max(r.right - 4, 10), innerWidth - 24);
        ty = Math.min(Math.max(r.bottom - 2, 10), innerHeight - 24);
        k = 0.16; working = true;
      } else if (active) {
        var ang = now * (0.0013 + (a.i % 3) * 0.0004) + a.i * (Math.PI * 2 / N);
        var rad = 48 + (a.i % 4) * 18 + Math.sin(now * 0.003 + a.i) * 6;
        tx = mx + Math.cos(ang) * rad; ty = my + Math.sin(ang) * rad;
        k = 0.09 + (a.i % 5) * 0.014;
      } else {
        if (now > a.wp.t) {
          a.wp.x = 40 + Math.random() * (innerWidth - 80);
          a.wp.y = 40 + Math.random() * (innerHeight - 80);
          a.wp.t = now + 2200 + Math.random() * 3000;
        }
        tx = a.wp.x; ty = a.wp.y; k = 0.018;
      }
      var dx = tx - a.x, dy = ty - a.y;
      a.x += dx * k; a.y += dy * k;
      var want = Math.hypot(dx * k, dy * k) > 0.35 ? Math.atan2(dy, dx) + 2.356 : (working ? 0 : a.rot);
      var d = ((want - a.rot + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      a.rot += d * 0.18;
      a.rot = ((a.rot + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      a.el.style.transform = 'translate(' + (a.x - 8) + 'px,' + (a.y - 8) + 'px)';
      a.svg.style.transform = 'rotate(' + a.rot + 'rad)';
      if (working !== a.w) { a.w = working; a.el.classList.toggle('w', working); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* build driver */
  var goneT, run = 0, built = 0, ptr = 0, startAt = performance.now(), lastLoud = 0, lastQuiet = 0;
  function setHud() {
    hudN.textContent = built;
    hudBar.style.transform = 'scaleX(' + (built / total) + ')';
    var done = built >= total;
    hudS.textContent = done ? 'Done' : 'Building';
    hudS.setAttribute('data-s', done ? 'done' : 'building');
    clearTimeout(goneT);
    if (done) { goneT = setTimeout(function () { if (built >= total) hud.classList.add('gone'); }, 2500); } else { hud.classList.remove('gone'); }
  }
  function inView(el) { var r = el.getBoundingClientRect(); return r.top < innerHeight * 0.95 && r.bottom > 0; }
  function boot() {
    for (var i = 0; i < 18; i++) {
      var p = document.createElement('span'); p.className = 'plus';
      p.textContent = Math.random() > 0.5 ? '+' : '×';
      p.style.left = (Math.random() * 90 + 4) + '%'; p.style.top = (Math.random() * 80 + 6) + '%';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      document.body.appendChild(p);
      (function (n) { setTimeout(function () { n.remove(); }, 1800); })(p);
    }
  }
  function buildItem(it, loud) {
    var el = it.el, tok = run; it.state = 'building';
    if (loud) {
      var r = el.getBoundingClientRect();
      layer.style.height = document.documentElement.scrollHeight + 'px';
      var w = document.createElement('div');
      w.className = 'wire' + (it.tag === 'image' ? ' img' : '');
      w.style.left = (r.left + scrollX) + 'px'; w.style.top = (r.top + scrollY) + 'px';
      w.style.width = r.width + 'px'; w.style.height = r.height + 'px';
      w.innerHTML = '<i></i><i></i><i></i><i></i><b>' + it.tag + ' ' + Math.round(r.width) + '×' + Math.round(r.height) + '</b>';
      layer.appendChild(w);
      var ag = agents[ptr++ % N]; ag.work = { el: el, until: performance.now() + 1800 };
      setTimeout(function () { w.classList.add('out'); setTimeout(function () { w.remove(); }, 500); }, 1500);
    }
    setTimeout(function () {
      if (tok !== run) return;
      el.classList.remove('pre'); el.classList.add('rev');
      el.addEventListener('animationend', function f(e) {
        if (e.target !== el || e.animationName !== 'rev') return;
        el.classList.remove('rev'); el.removeEventListener('animationend', f);
      });
      it.state = 'done'; if (it.count) built++; setHud();
    }, loud ? 420 : 0);
  }
  function tick() {
    var now = performance.now();
    for (var i = 0; i < items.length; i++) {
      var it = items[i]; if (it.state !== 'pre') continue;
      var r = it.el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      if (r.bottom <= 0) { if (now - lastQuiet > 100) { buildItem(it, false); lastQuiet = now; } continue; }
      if (r.top < innerHeight * 0.9 && now - lastLoud >= (it.el.classList.contains('shot') ? 70 : 200)) { buildItem(it, true); lastLoud = now; return; }
    }
  }
  function start() {
    run++; built = 0; startAt = performance.now(); lastLoud = 0; lastQuiet = 0;
    layer.innerHTML = '';
    items.forEach(function (it) { it.state = 'pre'; it.el.classList.remove('rev'); it.el.classList.add('pre'); });
    agents.forEach(function (a) { a.work = null; });
    setHud(); boot();
  }
  function replay() { scrollTo(0, 0); start(); }
  document.getElementById('replay').addEventListener('click', replay);
  document.getElementById('replay2').addEventListener('click', replay);
  start();
  setInterval(tick, 60);
})();
