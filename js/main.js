/* ============================================================
   ANIL KUMAR PORTFOLIO — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Nav ── */
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active', !expanded);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('active');
      });
    });
  }
a
  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });

  /* ── Reveal on scroll ── */
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  /* ── Typewriter ── */
  const tw = document.getElementById('typewriter');
  const phrases = [
    'Service & Application Engineer',
    'PLC / SCADA Specialist',
    'SINAMICS Drives Expert',
    'SINUMERIK CNC Engineer',
    'Industrial Automation Engineer',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const current = phrases[pi];
    if (!deleting) {
      tw.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      tw.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 40 : 70);
  }
  type();

  /* ── Animated counters ── */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card    = e.target;
      const target  = parseInt(card.dataset.target, 10);
      const span    = card.querySelector('.counter');
      const dur     = 1600;
      const start   = performance.now();

      function tick(now) {
        const prog = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        span.textContent = Math.round(ease * target);
        if (prog < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(card);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card[data-target]').forEach(c => counterObs.observe(c));

  /* ── Circuit canvas background ── */
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
    const ctx   = canvas.getContext('2d');
    let nodes   = [];
    let edges   = [];
    let pulses  = [];
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      buildGraph();
    }

    function buildGraph() {
      nodes = [];
      edges = [];
      pulses = [];
      const cols = Math.ceil(W / 120);
      const rows = Math.ceil(H / 80);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          nodes.push({
            x: c * 120 + (Math.random() - .5) * 40,
            y: r * 80  + (Math.random() - .5) * 30,
          });
        }
      }
      const cols1 = cols + 1;
      nodes.forEach((n, i) => {
        const r = Math.floor(i / cols1);
        const c = i % cols1;
        if (c < cols) edges.push([i, i + 1]);
        if (r < Math.floor(nodes.length / cols1)) edges.push([i, i + cols1]);
        if (Math.random() < .08 && c < cols && r < Math.floor(nodes.length / cols1) - 1) {
          edges.push([i, i + cols1 + 1]);
        }
      });

      // seed initial pulses
      for (let k = 0; k < 6; k++) {
        spawnPulse();
      }
    }

    function spawnPulse() {
      const edge  = edges[Math.floor(Math.random() * edges.length)];
      const speed = .003 + Math.random() * .004;
      const color = Math.random() < .7 ? '#00a8ff' : '#00d4aa';
      pulses.push({ edge, t: 0, speed, color });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // edges
      ctx.lineWidth = .6;
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        ctx.strokeStyle = 'rgba(0, 168, 255, 0.08)';
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      });

      // nodes
      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(0, 168, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // pulses
      pulses = pulses.filter(p => p.t <= 1);
      pulses.forEach(p => {
        const [a, b] = p.edge;
        const na = nodes[a], nb = nodes[b];
        const x = na.x + (nb.x - na.x) * p.t;
        const y = na.y + (nb.y - na.y) * p.t;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 6);
        grd.addColorStop(0, p.color + 'cc');
        grd.addColorStop(1, p.color + '00');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        p.t += p.speed;
      });

      if (Math.random() < .03) spawnPulse();

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* ── Project card expand ── */
  document.querySelectorAll('.proj-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.project-card');
      card.classList.toggle('open');
    });
  });

  /* ── Filter + Search: Certificates ── */
  makeFilter({
    searchId:   'cert-search',
    filtersId:  'cert-filters',
    gridId:     'cert-grid',
    cardSel:    '.cert-card',
    noResultId: 'cert-no-results',
  });

  /* ── Filter + Search: Projects ── */
  makeFilter({
    searchId:   'proj-search',
    filtersId:  'proj-filters',
    gridId:     'proj-grid',
    cardSel:    '.project-card',
    noResultId: 'proj-no-results',
  });

  function makeFilter({ searchId, filtersId, gridId, cardSel, noResultId }) {
    const searchEl  = document.getElementById(searchId);
    const filtersEl = document.getElementById(filtersId);
    const gridEl    = document.getElementById(gridId);
    const noResEl   = document.getElementById(noResultId);
    if (!gridEl) return;

    function run() {
      const q   = searchEl ? searchEl.value.toLowerCase().trim() : '';
      const active = filtersEl ? filtersEl.querySelector('.chip.active') : null;
      const cat = active ? active.dataset.filter : 'all';
      const cards = gridEl.querySelectorAll(cardSel);
      let visible = 0;

      cards.forEach(card => {
        const text   = card.textContent.toLowerCase();
        const cats   = (card.dataset.category || '').toLowerCase();
        const title  = (card.dataset.title || '').toLowerCase();
        const mQ     = !q || text.includes(q) || title.includes(q);
        const mCat   = cat === 'all' || cats.includes(cat);
        const show   = mQ && mCat;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (noResEl) noResEl.classList.toggle('hidden', visible > 0);
    }

    if (searchEl)  searchEl.addEventListener('input', run);
    if (filtersEl) {
      filtersEl.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          filtersEl.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          run();
        });
      });
    }
  }

  /* ── Back to top ── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active nav highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active',
            a.getAttribute('href') === '#' + e.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObs.observe(s));
});

/* ── Mail form ── */
function prepareMail(e) {
  e.preventDefault();
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const subject = document.getElementById('c-subject')?.value.trim() || 'Portfolio Inquiry';
  const message = document.getElementById('c-message').value.trim();
  const sub     = encodeURIComponent('[Portfolio] ' + (subject || 'Message from ' + name));
  const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
  window.location.href = 'mailto:anil02573@gmail.com?subject=' + sub + '&body=' + body;
  return false;
}
