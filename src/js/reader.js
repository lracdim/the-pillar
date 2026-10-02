function setupSidebarHandlers() {
  const lang = document.body.dataset.lang || 'en';
  document.querySelectorAll('.ep-item').forEach(item => {
    item.addEventListener('click', () => {
      window.location.href = `/${lang}/${item.dataset.slug}/`;
    });
  });
}

function setupProgressBar() {
  const reader = document.querySelector('.reader');
  const progressBar = document.getElementById('progress-bar');
  if (!reader || !progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupSidebarHandlers();
  setupProgressBar();
});
