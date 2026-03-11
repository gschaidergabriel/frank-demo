import { $ } from '../utils.js';

let _interval = null;

function randomMetrics() {
    const cpuTemp = 45 + Math.floor(Math.random() * 18);
    const cpuPct = 12 + Math.floor(Math.random() * 35);
    const gpuPct = 3 + Math.floor(Math.random() * 20);
    const ramPct = 55 + Math.floor(Math.random() * 15);

    const el = (id, txt) => { const e = $(id); if (e) e.textContent = txt; };
    el('#m-cpu-temp', `CPU ${cpuTemp}°C`);
    el('#m-cpu', `CPU ${cpuPct}%`);
    el('#m-gpu', `GPU ${gpuPct}%`);
    el('#m-ram', `RAM ${ramPct}%`);
}

export function initStatusBar() {
    // All services always online in demo
    randomMetrics();
    _interval = setInterval(randomMetrics, 8000);
}
