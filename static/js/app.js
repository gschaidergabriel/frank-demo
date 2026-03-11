import { $ } from './utils.js';
import { initStatusBar } from './components/status-bar.js';
import { startGoLBackground } from './components/gol-bg.js';

const PAGE_MODULES = {
    home:    () => import('./pages/home.js'),
    aura:    () => import('./pages/aura.js'),
    gallery: () => import('./pages/gallery.js'),
    lab:     () => import('./pages/lab.js'),
    logs:    () => import('./pages/logs.js'),
    mail:    () => import('./pages/mail.js'),
};

const _pageCache = {};
let _currentPage = null;

function _isMobile() { return window.innerWidth <= 900; }

function getPageFromHash() {
    const hash = location.hash.replace('#', '') || 'home';
    if (!PAGE_MODULES[hash]) return 'home';
    // On mobile, redirect AURA and Mail to home
    if (_isMobile() && (hash === 'aura' || hash === 'mail')) return 'home';
    return hash;
}

async function navigateTo(pageName) {
    if (pageName === _currentPage) return;
    if (_currentPage && _pageCache[_currentPage]) {
        const cached = _pageCache[_currentPage];
        if (cached.module.unmount) cached.module.unmount();
        cached.mounted = false;
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageName) link.classList.add('active');
        else link.classList.remove('active');
    });
    const container = $('#page-container');
    if (!_pageCache[pageName]) {
        try {
            const mod = await PAGE_MODULES[pageName]();
            _pageCache[pageName] = { module: mod, mounted: false };
        } catch (e) {
            console.error(`Failed to load page: ${pageName}`, e);
            container.innerHTML = `<div class="page active" style="display:flex;align-items:center;justify-content:center">
                <div style="color:var(--danger);font-size:14px">Failed to load page: ${pageName}</div>
            </div>`;
            return;
        }
    }
    const cached = _pageCache[pageName];
    const pageDiv = document.createElement('section');
    pageDiv.className = 'page';
    pageDiv.id = `page-${pageName}`;
    pageDiv.innerHTML = cached.module.render();
    container.innerHTML = '';
    container.appendChild(pageDiv);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { pageDiv.classList.add('active'); });
    });
    _currentPage = pageName;
    if (cached.module.mount) {
        cached.module.mount();
        cached.mounted = true;
    }
}

function onHashChange() { navigateTo(getPageFromHash()); }

document.addEventListener('DOMContentLoaded', () => {
    startGoLBackground();
    initStatusBar();
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
});
