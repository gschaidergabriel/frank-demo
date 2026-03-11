import { $ } from '../utils.js';

const container = () => $('#toast-container');

export function showToast(message, type = 'info', duration = 4000) {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container().appendChild(el);
    setTimeout(() => {
        el.classList.add('toast-exit');
        setTimeout(() => el.remove(), 300);
    }, duration);
}
