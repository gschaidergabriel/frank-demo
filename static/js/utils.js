export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

export function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
}

export function formatTime(date) {
    if (!(date instanceof Date)) date = new Date(date || Date.now());
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatTimeShort(date) {
    if (!(date instanceof Date)) date = new Date(date || Date.now());
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function relativeTime(ts) {
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

export function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function throttle(fn, ms) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= ms) { last = now; fn(...args); }
    };
}
