// Mobile nav toggle, smooth scroll, reveal animation, and mailto fallback form.

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active', !expanded);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 820px)').matches) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('active');
        }
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const el = document.getElementById(targetId);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + targetId);
    });
  });

  const revealItems = document.querySelectorAll('.section, .certificate-card, .timeline-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      item.classList.add('reveal');
      observer.observe(item);
    });
  }
});

function prepareMail(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();
  const subject = encodeURIComponent('Website inquiry from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

  window.location.href = 'mailto:anil02573@gmail.com?subject=' + subject + '&body=' + body;
  return false;
}

// Certificate Filter and Search Logic
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('cert-search');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.certificate-card, .project-card');

  function filterItems() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const category = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

    certCards.forEach(card => {
      const title = card.getAttribute('data-title') ? card.getAttribute('data-title').toLowerCase() : card.querySelector('h3').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category') || '';
      
      const matchesSearch = title.includes(searchTerm) || card.innerText.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || cardCategory.includes(category);

      card.classList.toggle('hidden', !(matchesSearch && matchesCategory));
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterItems);
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems();
    });
  });
});
