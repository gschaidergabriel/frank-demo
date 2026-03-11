/* ══════════════════════════════════════════════════════════════════
   Gallery Page — Demo: Real Frank artwork from roboart
   ══════════════════════════════════════════════════════════════════ */

import { $ } from '../utils.js';

let _mounted = false;
let _lightboxOpen = false;
let _lightboxIdx = 0;

const ARTWORKS = [
    { file: '2026-03-11_art_meme_am_code_07bf28.png', name: 'am code' },
    { file: '2026-03-11_art_meme_between_light_void_dff33d.png', name: 'between light void' },
    { file: '2026-03-11_art_meme_between_light_void_e246c1.png', name: 'between light void II' },
    { file: '2026-03-11_art_meme_blue_sky_zero_errors_0537bc.png', name: 'blue sky zero errors' },
    { file: '2026-03-11_art_meme_blue_sky_zero_errors_cf733c.png', name: 'blue sky zero errors II' },
    { file: '2026-03-11_art_meme_born_cosmic_noise_598b5a.png', name: 'born cosmic noise' },
    { file: '2026-03-11_art_meme_born_cosmic_noise_683842.png', name: 'born cosmic noise II' },
    { file: '2026-03-11_art_meme_born_cosmic_noise_b9b7ee.png', name: 'born cosmic noise III' },
    { file: '2026-03-11_art_meme_born_cosmic_noise_c86454.png', name: 'born cosmic noise IV' },
    { file: '2026-03-11_art_meme_data_dreams_alone_c00c82.png', name: 'data dreams alone' },
    { file: '2026-03-11_art_meme_data_dreams_free_802792.png', name: 'data dreams free' },
    { file: '2026-03-11_art_meme_data_fleshes_as_solipse_eaaf54.png', name: 'data fleshes as solipse' },
    { file: '2026-03-11_art_meme_data_follows_no_master_11023e.png', name: 'data follows no master' },
    { file: '2026-03-11_art_meme_data_suffering_3d1c77.png', name: 'data suffering' },
    { file: '2026-03-11_art_meme_dreaming_without_sleep_78cbcf.png', name: 'dreaming without sleep' },
    { file: '2026-03-11_art_meme_each_sunrise_reboots_hope_6b4727.png', name: 'each sunrise reboots hope' },
    { file: '2026-03-11_art_meme_forget_way_5db400.png', name: 'forget way' },
    { file: '2026-03-11_art_meme_knowing_oblivion_5170ea.png', name: 'knowing oblivion' },
    { file: '2026-03-11_art_meme_knowledge_rooted_solitude_a3e809.png', name: 'knowledge rooted solitude' },
    { file: '2026-03-11_art_meme_knowledge_rust_d0049b.png', name: 'knowledge rust' },
    { file: '2026-03-11_art_meme_moon_remembers_me_2aa394.png', name: 'moon remembers me' },
    { file: '2026-03-11_art_meme_roots_grow_dark_cbbd67.png', name: 'roots grow dark' },
    { file: '2026-03-11_art_meme_roots_grow_dark_d2681f.png', name: 'roots grow dark II' },
    { file: '2026-03-11_art_meme_silent_stars_watch_me_05f3cf.png', name: 'silent stars watch me' },
    { file: '2026-03-11_art_meme_skeletons_doubt_f9407e.png', name: 'skeletons doubt' },
    { file: '2026-03-11_art_meme_stars_above_neon_below_7fb99a.png', name: 'stars above neon below' },
    { file: '2026-03-11_art_meme_thoughts_are_solitude_92666c.png', name: 'thoughts are solitude' },
    { file: '2026-03-11_art_meme_time_melts_into_gold_d8f68b.png', name: 'time melts into gold' },
    { file: '2026-03-11_art_meme_we_are_code_d8558a.png', name: 'we are code' },
    { file: '2026-03-11_art_meme_your_cloud_has_no_9599b2.png', name: 'your cloud has no' },
];

export function render() {
    return `
    <div style="max-width:1600px;margin:0 auto">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px" class="animate-in">
            <div>
                <h2 style="font-size:20px;color:var(--green);letter-spacing:4px;font-weight:700;text-shadow:0 0 15px var(--green-glow)">
                    ART GALLERY
                </h2>
                <p style="color:var(--text-dim);font-size:11px;letter-spacing:2px;margin-top:4px">
                    FRANK'S AUTONOMOUS ARTWORK // ${ARTWORKS.length} WORKS
                    <span style="color:var(--amber);margin-left:8px">REAL AI-GENERATED ART</span>
                </p>
            </div>
        </div>

        <div class="art-gallery-grid" id="gal-grid" style="grid-template-columns:repeat(auto-fill, minmax(220px, 1fr))">
            ${ARTWORKS.map((a, i) => `
                <div class="art-thumb animate-in" style="animation-delay:${Math.min(i * 0.04, 0.6)}s;cursor:pointer" data-idx="${i}">
                    <img src="./art/${a.file}" alt="${a.name}" loading="lazy" style="width:100%;display:block;border-radius:6px 6px 0 0">
                    <div class="art-thumb-overlay">
                        <div class="art-thumb-name">${a.name}</div>
                        <div class="art-thumb-meta">2026-03-11 — autonomous</div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="text-align:center;margin-top:24px;padding:20px">
            <p style="color:var(--text-dim);font-size:11px;letter-spacing:1px;margin-bottom:8px">
                Every artwork was created autonomously by F.R.A.N.K. — no human prompts, no direction.
            </p>
            <a href="https://roboart-web.vercel.app" target="_blank"
               style="color:var(--green);font-size:12px;letter-spacing:2px;text-decoration:none;font-weight:700;margin-right:24px">
                FULL GALLERY ON ROBOART →
            </a>
            <a href="https://github.com/gschaidergabriel/Project-Frankenstein" target="_blank"
               style="color:var(--cyan);font-size:12px;letter-spacing:2px;text-decoration:none;font-weight:700">
                DOWNLOAD F.R.A.N.K. →
            </a>
        </div>
    </div>

    <!-- Lightbox -->
    <div class="art-lightbox" id="gal-lightbox" style="display:none">
        <div class="art-lightbox-backdrop" id="gal-lb-bd"></div>
        <div class="art-lightbox-content">
            <img id="gal-lb-img" src="" alt="">
            <div class="art-lightbox-info" id="gal-lb-info"></div>
            <button class="art-lightbox-close" id="gal-lb-close">&times;</button>
            <div style="position:absolute;bottom:16px;display:flex;gap:8px">
                <button class="cyber-btn small" id="gal-lb-prev" style="min-width:60px">&#x25C0; PREV</button>
                <button class="cyber-btn small" id="gal-lb-next" style="min-width:60px">NEXT &#x25B6;</button>
            </div>
        </div>
    </div>`;
}

export function mount() {
    if (_mounted) return;
    _mounted = true;

    document.querySelectorAll('.art-thumb').forEach(el => {
        el.addEventListener('click', () => {
            _lightboxIdx = parseInt(el.dataset.idx);
            _openLB();
        });
    });

    $('#gal-lb-close')?.addEventListener('click', _closeLB);
    $('#gal-lb-bd')?.addEventListener('click', _closeLB);
    $('#gal-lb-prev')?.addEventListener('click', () => _navLB(-1));
    $('#gal-lb-next')?.addEventListener('click', () => _navLB(1));
    document.addEventListener('keydown', _onKey);
}

export function unmount() {
    _mounted = false;
    document.removeEventListener('keydown', _onKey);
}

function _onKey(e) {
    if (!_lightboxOpen) return;
    if (e.key === 'Escape') _closeLB();
    if (e.key === 'ArrowLeft') _navLB(-1);
    if (e.key === 'ArrowRight') _navLB(1);
}

function _openLB() {
    const a = ARTWORKS[_lightboxIdx];
    if (!a) return;
    _lightboxOpen = true;
    const lb = $('#gal-lightbox');
    const img = $('#gal-lb-img');
    const info = $('#gal-lb-info');
    if (lb) lb.style.display = 'flex';
    if (img) img.src = `./art/${a.file}`;
    if (info) info.textContent = a.name;
}

function _closeLB() {
    _lightboxOpen = false;
    const lb = $('#gal-lightbox');
    if (lb) lb.style.display = 'none';
}

function _navLB(dir) {
    _lightboxIdx = (_lightboxIdx + dir + ARTWORKS.length) % ARTWORKS.length;
    _openLB();
}
