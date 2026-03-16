import { getSession } from './auth.js';

let session = null;

async function initGate() {
  session = await getSession();
  document.body.classList.add('session-loaded');
  
  if (session) {
    document.body.classList.add('logged-in');
    return;
  }
  
  const body = document.body;
  const slug = body.dataset.slug;
  
  if (!slug || slug === '' || slug === 'about' || slug === 'characters') {
    return;
  }
  
  const isEpisodePage = slug.startsWith('ep');
  if (!isEpisodePage) return;
  
  const episodeBody = document.getElementById('episode-body');
  if (!episodeBody) return;
  
  const fullyFreeEpisodes = ['ep1'];
  if (fullyFreeEpisodes.includes(slug)) return;
  
  applyFullLock(episodeBody, slug);
}

function applyPaywallBlur(episodeBody, slug) {
  const paragraphs = episodeBody.querySelectorAll('p');
  
  if (paragraphs.length <= 2) return;
  
  const blurZone = document.createElement('div');
  blurZone.className = 'paywall-blur-zone';
  
  for (let i = 2; i < paragraphs.length; i++) {
    blurZone.appendChild(paragraphs[i]);
  }
  
  episodeBody.appendChild(blurZone);
  
  injectGateCard(episodeBody, blurZone, 'blur');
}

function applyFullLock(episodeBody, slug) {
  const gate = createGateCard('lock');
  episodeBody.innerHTML = '';
  episodeBody.appendChild(gate);
}

function createGateCard(type) {
  const gate = document.createElement('div');
  gate.className = 'paywall-gate';
  
  const lang = document.body.dataset.lang || 'ko';
  const isKo = lang === 'ko';
  
  const translations = {
    ko: {
      icon: '📖',
      title: '계속 읽으시겠어요?',
      subtitle: '더 필라의 모든 에피소드를 읽으려면 무료 계정을 만드세요.',
      ctaSignup: '무료 계정 만들기',
      ctaSignin: '로그인'
    },
    en: {
      icon: '📖',
      title: 'Continue reading?',
      subtitle: 'Create a free account to unlock all episodes of The Pillar.',
      ctaSignup: 'Create free account',
      ctaSignin: 'Sign in'
    }
  };
  
  const t = translations[isKo ? 'ko' : 'en'];
  
  gate.innerHTML = `
    <div class="paywall-gate-icon">${t.icon}</div>
    <h2 class="paywall-gate-title">${t.title}</h2>
    <p class="paywall-gate-subtitle">${t.subtitle}</p>
    <button class="gate-btn-primary" data-action="signup">${t.ctaSignup}</button>
    <button class="gate-btn-secondary" data-action="signin">${t.ctaSignin}</button>
  `;
  
  const signupBtn = gate.querySelector('[data-action="signup"]');
  const signinBtn = gate.querySelector('[data-action="signin"]');

  signupBtn.addEventListener('click', () => {
    window.location.href = `/signup/${lang}/`;
  });
  
  signinBtn.addEventListener('click', () => {
    window.location.href = `/login/${lang}/`;
  });
  
  return gate;
}

function injectGateCard(episodeBody, blurZone, type) {
  const gate = createGateCard(type);
  episodeBody.insertBefore(gate, blurZone.nextSibling);
}

function setupSidebarHandlers() {
  const epItems = document.querySelectorAll('.ep-item');
  
  epItems.forEach(item => {
    item.addEventListener('click', () => {
      const isLocked = item.classList.contains('locked');
      const lang = document.body.dataset.lang || 'en';
      if (isLocked && !session) {
        window.location.href = `/signup/${lang}/`;
      } else if (isLocked && session) {
        return;
      } else {
        const slug = item.dataset.slug;
        window.location.href = `/${lang}/${slug}/`;
      }
    });
  });
  
  const episodeCards = document.querySelectorAll('.episode-card');
  episodeCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const isFree = card.dataset.free === 'true';
      const lang = document.body.dataset.lang || 'en';
      if (!isFree && !session) {
        e.preventDefault();
        window.location.href = `/signup/${lang}/`;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initGate();
  setupSidebarHandlers();
  
  const setupProgressBar = () => {
    const reader = document.querySelector('.reader');
    if (!reader) return;
    
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
  };
  
  setupProgressBar();
});

// Modal logic removed
