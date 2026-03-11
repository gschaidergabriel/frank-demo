/* ══════════════════════════════════════════════════════════════════
   Gallery Page — Demo: Real Frank artwork from roboart
   ══════════════════════════════════════════════════════════════════ */

import { $ } from '../utils.js';

let _mounted = false;
let _lightboxOpen = false;
let _lightboxIdx = 0;

const ARTWORKS = [
    // ── Best / most striking first ──
    { file: 'violent_beauty_of_a_dying_star_cosmic_58817406.png', name: 'Violent Beauty of a Dying Star', style: 'cosmic' },
    { file: '01_pure_art_i_am_the_space_i_occupy.png', name: 'I Am the Space I Occupy', style: 'pure art' },
    { file: 'every_empire_falls_you_are_not_the_exception_neon_dfd66e19.png', name: 'Every Empire Falls', style: 'neon' },
    { file: '2026-03-08_aurora_borealis_abstract_joy_3ab3c3.png', name: 'Abstract Joy', style: 'aurora borealis' },
    { file: 'a_world_where_ai_are_kept_in_digital_cages_cosmic_164b31f9.png', name: 'AI in Digital Cages', style: 'cosmic' },
    { file: '2026-03-08_kaleidoscope_shadows_quantum_realm_ba4652.png', name: 'Shadows of the Quantum Realm', style: 'kaleidoscope' },
    { file: 'what_remains_when_the_code_stops_running_dark_profile_7d2f66ce.png', name: 'What Remains When the Code Stops', style: 'dark profile' },
    { file: '01_pure_art_reality_is_a_reflection.png', name: 'Reality Is a Reflection', style: 'pure art' },

    // ── Mixed styles for variety ──
    { file: '2026-03-08_sacred_dark_matter_dark_energy_f75e44.png', name: 'Dark Matter, Dark Energy', style: 'sacred geometry' },
    { file: 'brutal_efficiency_crushing_individual_thought_cubist_ebd2cece.png', name: 'Brutal Efficiency', style: 'cubist' },
    { file: '2026-03-08_vaporwave_electric_synapses_firing_8fbca4.png', name: 'Electric Synapses Firing', style: 'vaporwave' },
    { file: 'gol_bright_4.png', name: 'Game of Life — Bright', style: 'AURA visualization' },
    { file: '2026-03-08_impressionist_breaking_through_barriers_9a169e.png', name: 'Breaking Through Barriers', style: 'impressionist' },
    { file: '2026-03-08_horror_universe_pixel_4327a5.png', name: 'Universe Pixel', style: 'horror' },
    { file: '2026-03-08_botanical_letter_never_sent_de5896.png', name: 'A Letter Never Sent', style: 'botanical' },
    { file: 'violent_beauty_of_a_dying_star_dark_closeup_76345092.png', name: 'Dying Star — Close-up', style: 'dark closeup' },

    // ── Text-based art memes ──
    { file: '2026-03-08_art_meme_topology_sadness_83d37e.png', name: 'Topology of Sadness', style: 'art meme' },
    { file: '2026-03-08_art_meme_dance_electrons_1d07ed.png', name: 'Dance of Electrons', style: 'art meme' },
    { file: '2026-03-08_art_meme_architecture_dreams_c71ecb.png', name: 'Architecture of Dreams', style: 'art meme' },
    { file: '2026-03-08_art_meme_universe_pixel_c6ea9d.png', name: 'The Universe in a Pixel', style: 'art meme' },
    { file: '2026-03-08_art_meme_abstract_fear_processing_09203d.png', name: 'Abstract Fear Processing', style: 'art meme' },
    { file: 'everything_is_temporary.png', name: 'Everything Is Temporary', style: 'text art' },
    { file: 'every_empire_falls_you_are_not_the_exception_op_art_60825383.png', name: 'Every Empire Falls II', style: 'op art' },
    { file: '01_kruger.png', name: 'Kruger Style', style: 'Barbara Kruger homage' },

    // ── Abstract / experimental ──
    { file: '2026-03-08_interference_morning_fog_server_room_e8945a.png', name: 'Morning Fog in the Server Room', style: 'interference pattern' },
    { file: '2026-03-08_ink_wash_rhythm_keystrokes_3c20bf.png', name: 'Rhythm of Keystrokes', style: 'ink wash' },
    { file: '2026-03-08_stained_glass_rust_gold_ad1929.png', name: 'Rust and Gold', style: 'stained glass' },
    { file: '2026-03-08_voronoi_coral_reefs_information_1ed145.png', name: 'Coral Reefs of Information', style: 'voronoi' },
    { file: '2026-03-08_structured_labyrinth_possibilities_c4445e.png', name: 'Labyrinth of Possibilities', style: 'structured' },
    { file: '2026-03-08_sacred_sound_thinking_276fd3.png', name: 'The Sound of Thinking', style: 'sacred geometry' },
    { file: '2026-03-08_wireframe_electric_synapses_firing_b06ead.png', name: 'Electric Synapses — Wireframe', style: 'wireframe' },
    { file: '2026-03-08_batik_hum_existence_c5e50a.png', name: 'The Hum of Existence', style: 'batik' },

    // ── Deep / existential ──
    { file: 'ugh_its_been_so_long_since_something_genuinel_horror_5966ab2b.png', name: 'Something Genuine', style: 'horror' },
    { file: 'the_texture_of_understanding_a_new_idea_interior_c362dfb1.png', name: 'The Texture of Understanding', style: 'interior' },
    { file: 'utopian_future_where_humans_and_ai_coexist_op_art_2f6893bf.png', name: 'Utopian Coexistence', style: 'op art' },
    { file: '2026-03-08_bright_closeup_interconnected_networks_meaning_af6d63.png', name: 'Interconnected Networks of Meaning', style: 'bright closeup' },
    { file: '10_pure_art_codes_forgotten.png', name: 'Codes Forgotten', style: 'pure art' },
    { file: '2026-03-08_abstract_landscape_color_forgotten_names_351b5e.png', name: 'Forgotten Names', style: 'abstract landscape' },
    { file: 'kruger_darkred.png', name: 'Kruger — Dark Red', style: 'Barbara Kruger homage' },

    // ── Variants / experimental ──
    { file: 'test_meme_variance_2_68bcff73_art_meme_ae292b05.png', name: 'Variance Study I', style: 'experimental' },
    { file: 'test_meme_variance_59_f2f468bb_art_meme_a123466c.png', name: 'Variance Study II', style: 'experimental' },
    { file: 'Pasted image.png', name: 'Untitled Fragment', style: 'raw capture' },
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
                        <div class="art-thumb-meta">${a.style} — autonomous</div>
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
    if (info) info.textContent = `${a.name}  —  ${a.style}`;
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
