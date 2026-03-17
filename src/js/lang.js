const COOKIE_NAME = 'pillar_lang';
const COOKIE_DAYS = 365;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function detectBrowserLang() {
  const lang = navigator.language || navigator.userLanguage;
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('tl') || lang.startsWith('fil')) return 'tl';
  return 'en';
}

function getLangFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/^\/(ko|en|tl)\//);
  if (match) return match[1];
  const matchShort = path.match(/^\/(ko|en|tl)$/);
  if (matchShort) return matchShort[1];
  return null;
}

function initLang() {
  const urlLang = getLangFromUrl();
  let savedLang = getCookie(COOKIE_NAME);
  
  if (urlLang) {
    // If URL has a language, synchronize cookie and use it
    if (savedLang !== urlLang) {
      setCookie(COOKIE_NAME, urlLang, COOKIE_DAYS);
    }
    savedLang = urlLang;
  } else if (!savedLang) {
    // If no cookie and no URL lang, detect and set cookie
    savedLang = detectBrowserLang();
    setCookie(COOKIE_NAME, savedLang, COOKIE_DAYS);
  }
  
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = savedLang;
  }
}

function setupLangDropdown() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;
  
  langSelect.addEventListener('change', (e) => {
    const newLang = e.target.value;
    setCookie(COOKIE_NAME, newLang, COOKIE_DAYS);
    
    let currentPath = window.location.pathname;
    const langRegex = /^\/(ko|en|tl)/;
    
    if (currentPath === '/' || currentPath === '') {
      currentPath = `/${newLang}/`;
    } else if (currentPath.match(langRegex)) {
      currentPath = currentPath.replace(langRegex, `/${newLang}`);
    } else {
      currentPath = `/${newLang}${currentPath}`;
    }
    
    window.location.href = currentPath;
  });
}

function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!hamburger || !mobileMenu) return;
  
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  setupLangDropdown();
  setupMobileMenu();
});
