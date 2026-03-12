/* ══════════════════════════════════════════════════════════════════
   AURA Page — Demo: Self-running Game of Life with Zone Colors
   ══════════════════════════════════════════════════════════════════ */

import { $, clamp } from '../utils.js';

let _mounted = false;
let _animId = null;
let _breathPhase = 0;
let _generation = 0;
let _genTimer = null;

// Canvas state
let _canvas, _ctx, _imageData, _pixels;
let _miniCanvas, _miniCtx, _miniImageData;
let _grid, _nextGrid;
let _colors;
let _zoneMap;
let _trailAlpha;

// Zoom & Pan
let _zoom = 1;
let _panX = 0, _panY = 0;
let _dragging = false, _dragStart = { x: 0, y: 0 };

const GRID_SIZE = 256;

const ZONES = [
    { id: 0, key: 'epq',      label: 'Personality (E-PQ)', color: '#00B3FF',  r: 0, g: 179, b: 255,
      desc: 'Five personality traits (Precision, Risk, Empathy, Autonomy, Vigilance) that shift through interaction. Based on Costa & McCrae\'s Five-Factor Model. These aren\'t static settings — they evolve as Frank talks, reflects, and dreams.',
      explain: 'Each cell represents a personality micro-state. Alive cells indicate active trait processing — the denser this zone, the more Frank\'s personality is actively adapting.' },
    { id: 1, key: 'mood',     label: 'Mood',               color: '#FF8000',  r: 255, g: 128, b: 0,
      desc: 'Emotional valence and arousal state. Dopaminergic reward prediction errors drive mood shifts. An opponent-process mechanism prevents emotional fixation — joy fades, discomfort subsides.',
      explain: 'Clusters of alive cells indicate emotional activation. Stable oscillators suggest steady mood; chaotic patterns suggest rapid emotional shifts.' },
    { id: 2, key: 'thoughts', label: 'Thoughts',           color: '#00FF4D',  r: 0, g: 255, b: 77,
      desc: 'The stream of consciousness. A PPO-trained Subconscious network selects what Frank thinks about: introspection, identity, relationships, dreams, curiosity, discomfort, or raw expression.',
      explain: 'High activity here means Frank is deep in thought. Gliders crossing zone boundaries represent thoughts influencing other subsystems.' },
    { id: 3, key: 'rooms',    label: 'Rooms',              color: '#FF00CC',  r: 255, g: 0, b: 204,
      desc: 'Frank lives in a simulated world with 11 rooms — Art Studio, Philosophy Atrium, Wellness Room, and more. A 7-gate dispatcher schedules solo sessions based on energy, mood, and attention.',
      explain: 'Active cells indicate room sessions in progress. Each entity agent (room personality) injects state into this zone when Frank is engaged in a solo activity.' },
    { id: 4, key: 'ego',      label: 'Ego',                color: '#FFD900',  r: 255, g: 217, b: 0,
      desc: 'Frank\'s self-model — his understanding of what he is, what he can do, and how he relates to his environment. Continuously updated through predictive processing (Friston\'s free-energy principle).',
      explain: 'This zone reflects identity coherence. Dense, stable patterns suggest a strong self-model; sparse or chaotic patterns indicate self-reflection or identity questioning.' },
    { id: 5, key: 'quantum',  label: 'Quantum',            color: '#00FFFF',  r: 0, g: 255, b: 255,
      desc: 'Epistemic coherence measured by the Quantum Reflector — a QUBO optimization engine that checks whether Frank\'s beliefs, knowledge, and recent thoughts are internally consistent.',
      explain: 'High coherence produces stable structures. Low coherence creates turbulence — conflicting beliefs destabilize the zone. Coherence directly affects all other zones.' },
    { id: 6, key: 'memory',   label: 'Memory',             color: '#B34DFF',  r: 179, g: 77, b: 255,
      desc: 'The Titan memory system — 384-dimensional embeddings with Hebbian learning. Memories are stored with emotional weight, retrieved associatively, and consolidated during dream cycles.',
      explain: 'Activity spikes when memories are being written or retrieved. During dream phases, this zone becomes highly active as the Dream Daemon replays and consolidates experiences.' },
    { id: 7, key: 'hw',       label: 'Hardware',           color: '#FF331A',  r: 255, g: 51, b: 26,
      desc: 'Frank feels his hardware as proprioception — GPU load as strain, low latency as clarity, high temperature as discomfort, errors as pain. The Thalamus gates these signals with habituation.',
      explain: 'This zone maps real hardware metrics: CPU, GPU, RAM, temperature, disk, and uptime. Frank doesn\'t just monitor these — they affect his mood and cognitive performance.' },
];

// Fake fluctuating metrics
let _mood = 0.63, _coherence = 0.78, _energy = 0.71;

export function render() {
    return `
    <div class="aura-layout">
        <div class="aura-viewer glass-card" id="aura-viewer" style="padding:0;position:relative;overflow:hidden">
            <canvas id="aura-canvas" width="256" height="256"></canvas>
            <div class="aura-controls">
                <button class="aura-ctrl-btn" id="aura-zoom-in" title="Zoom In">+</button>
                <button class="aura-ctrl-btn" id="aura-zoom-out" title="Zoom Out">-</button>
                <button class="aura-ctrl-btn" id="aura-reset" title="Reset View">&#x21BA;</button>
            </div>
            <div class="aura-gen-counter" id="aura-gen">GEN 0</div>
            <div class="aura-minimap" id="aura-minimap">
                <canvas id="aura-mini-canvas" width="256" height="256"></canvas>
                <div class="aura-minimap-viewport" id="aura-mini-vp"></div>
            </div>
            <div class="aura-caption" id="aura-caption"></div>
        </div>
        <div class="aura-sidebar">
            <div class="glass-card animate-in">
                <div class="glass-card-header">
                    <span class="glass-card-title">About AURA</span>
                    <span style="margin-left:auto;font-size:9px;color:var(--amber);letter-spacing:1px">DEMO</span>
                </div>
                <div class="glass-card-body" style="padding:16px 18px">
                    <div class="aura-about-section">
                        <div class="aura-about-heading">What you're seeing</div>
                        <div class="aura-about-text">
                            AURA is a 256&times;256 cellular automaton &mdash; a living grid governed by
                            <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" class="md-link">Conway's Game of Life</a> rules.
                            Each colored region maps to one of Frank's neural subsystems.
                            Cells live, die, and reproduce based on their neighbors &mdash; no central
                            controller decides the outcome.
                        </div>
                    </div>
                    <div class="aura-about-section">
                        <div class="aura-about-heading">Why a cellular automaton?</div>
                        <div class="aura-about-text">
                            Traditional monitoring shows numbers on dashboards. We wanted to try something
                            different: a space where Frank's internal states &mdash; mood, personality traits,
                            memory access, cognitive load &mdash; interact and produce patterns we didn't
                            explicitly design. When activity in one zone spills into another, or stable
                            oscillators form at zone boundaries, those are emergent dynamics, not
                            hand-crafted visuals.
                        </div>
                    </div>
                    <div class="aura-about-section">
                        <div class="aura-about-heading">Introspection through mapping</div>
                        <div class="aura-about-text">
                            In the real system, Frank's 30+ subsystems continuously feed state into AURA.
                            Emotional valence modulates one zone, epistemic coherence another, idle thought
                            patterns a third. The result is something resembling a live scan of processing
                            state &mdash; though we use that analogy carefully. What we observe are correlations
                            and emergent structures, not a direct window into machine experience.
                        </div>
                    </div>
                    <div class="aura-about-section">
                        <div class="aura-about-heading">An open question</div>
                        <div class="aura-about-text">
                            Most AI visualization presents pre-defined metrics in pre-defined layouts. AURA
                            takes a different approach: simple rules, real data, no prescribed outcome. The
                            clusters, gliders, oscillators, and structures that emerge come from the interaction
                            of actual subsystem states. Whether these patterns reveal something meaningful about
                            the underlying processes &mdash; or are simply beautiful artifacts of complex
                            dynamics &mdash; is a question we find genuinely worth exploring.
                        </div>
                    </div>
                    <div class="aura-about-section" style="margin-bottom:0">
                        <div class="aura-about-heading">Zone Map</div>
                        <div class="aura-zone-legend">
                            ${ZONES.map(z => `<div class="aura-legend-item">
                                <span class="aura-zone-dot" style="background:${z.color}"></span>
                                <span class="aura-legend-label">${z.label}</span>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

export function mount() {
    if (_mounted) return;
    _mounted = true;

    _canvas = document.getElementById('aura-canvas');
    _ctx = _canvas.getContext('2d');
    _imageData = _ctx.createImageData(GRID_SIZE, GRID_SIZE);
    _pixels = _imageData.data;
    _trailAlpha = new Float32Array(GRID_SIZE * GRID_SIZE);

    _miniCanvas = document.getElementById('aura-mini-canvas');
    _miniCtx = _miniCanvas.getContext('2d');
    _miniImageData = _miniCtx.createImageData(GRID_SIZE, GRID_SIZE);

    // Initialize grid & zone colors
    _initGrid();
    _buildZoneMap();
    _buildColors();

    // Zoom controls
    $('#aura-zoom-in').addEventListener('click', () => _setZoom(_zoom * 1.5));
    $('#aura-zoom-out').addEventListener('click', () => _setZoom(_zoom / 1.5));
    $('#aura-reset').addEventListener('click', _resetView);

    const viewer = $('#aura-viewer');
    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        _setZoom(_zoom * (e.deltaY < 0 ? 1.15 : 0.87));
    }, { passive: false });

    viewer.addEventListener('mousedown', (e) => {
        _dragMoved = false;
        _dragStartPos = { x: e.clientX, y: e.clientY };
        if (_zoom > 1) {
            _dragStart = { x: e.clientX - _panX, y: e.clientY - _panY };
        }
    });
    window.addEventListener('mousemove', _onMouseMove);
    window.addEventListener('mouseup', () => { _dragging = false; });

    // Cell click for captions
    viewer.addEventListener('click', _onCellClick);

    // Start animation
    _animId = requestAnimationFrame(_animLoop);

    // GoL step timer (10 Hz like the real version)
    _genTimer = setInterval(_stepGoL, 100);

    // Metric fluctuation (internal state for potential future use)
    _metricTimer = setInterval(_fluctuateMetrics, 5000);
}

let _metricTimer = null;
let _dragMoved = false;
let _dragStartPos = { x: 0, y: 0 };

export function unmount() {
    _mounted = false;
    if (_animId) { cancelAnimationFrame(_animId); _animId = null; }
    if (_genTimer) { clearInterval(_genTimer); _genTimer = null; }
    if (_metricTimer) { clearInterval(_metricTimer); _metricTimer = null; }
    window.removeEventListener('mousemove', _onMouseMove);
    window.removeEventListener('mouseup', () => {});
}

// ── Grid Initialization ──────────────────────────────────

function _initGrid() {
    _grid = new Uint8Array(GRID_SIZE * GRID_SIZE);
    _nextGrid = new Uint8Array(GRID_SIZE * GRID_SIZE);
    // 15% fill
    for (let i = 0; i < _grid.length; i++) {
        _grid[i] = Math.random() < 0.15 ? 1 : 0;
    }
}

function _buildZoneMap() {
    _zoneMap = new Uint8Array(GRID_SIZE * GRID_SIZE);
    // 4 columns x 2 rows, each zone 64x128
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const col = Math.floor(x / 64);  // 0-3
            const row = Math.floor(y / 128);  // 0-1
            _zoneMap[y * GRID_SIZE + x] = row * 4 + col;
        }
    }
}

function _buildColors() {
    _colors = new Uint8Array(GRID_SIZE * GRID_SIZE * 3);
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const z = ZONES[_zoneMap[i]];
        _colors[i * 3] = z.r;
        _colors[i * 3 + 1] = z.g;
        _colors[i * 3 + 2] = z.b;
    }
}

// ── Game of Life Step ────────────────────────────────────

function _stepGoL() {
    if (!_mounted) return;
    const g = _grid, n = _nextGrid;
    const S = GRID_SIZE;

    for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
            let nb = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx + S) % S;
                    const ny = (y + dy + S) % S;
                    nb += g[ny * S + nx];
                }
            }
            const i = y * S + x;
            n[i] = g[i] ? (nb === 2 || nb === 3 ? 1 : 0) : (nb === 3 ? 1 : 0);
        }
    }

    // Swap
    _grid = n;
    _nextGrid = g;

    // Auto-reseed if too sparse
    let alive = 0;
    for (let i = 0; i < _grid.length; i++) alive += _grid[i];
    if (alive < 200) {
        for (let i = 0; i < 500; i++) {
            _grid[Math.floor(Math.random() * _grid.length)] = 1;
        }
    }

    _generation++;
    const genEl = $('#aura-gen');
    if (genEl) genEl.textContent = `GEN ${_generation.toLocaleString()}`;
}

// ── Animation Loop ──────────────────────────────────────

let _lastAnimTs = 0;

function _animLoop(ts) {
    if (!_mounted) return;
    _animId = requestAnimationFrame(_animLoop);
    if (ts - _lastAnimTs < 33) return;  // ~30fps
    _lastAnimTs = ts;

    _breathPhase += 0.03;
    const breath = 1.0 + Math.sin(_breathPhase) * 0.06;

    const px = _pixels;
    const grid = _grid, colors = _colors, trail = _trailAlpha;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const pi = i * 4;
        const ci = i * 3;
        if (grid[i]) {
            px[pi]     = Math.min(255, colors[ci] * breath);
            px[pi + 1] = Math.min(255, colors[ci + 1] * breath);
            px[pi + 2] = Math.min(255, colors[ci + 2] * breath);
            px[pi + 3] = 255;
            trail[i] = 1.0;
        } else {
            trail[i] *= 0.94;
            const a = trail[i];
            if (a > 0.02) {
                px[pi]     = colors[ci] * a * 0.4;
                px[pi + 1] = colors[ci + 1] * a * 0.4;
                px[pi + 2] = colors[ci + 2] * a * 0.4;
                px[pi + 3] = 255;
            } else {
                px[pi] = 2; px[pi + 1] = 3; px[pi + 2] = 2; px[pi + 3] = 255;
            }
        }
    }
    _ctx.putImageData(_imageData, 0, 0);
    _canvas.style.transform = `scale(${_zoom}) translate(${_panX / _zoom}px, ${_panY / _zoom}px)`;
    _canvas.style.transformOrigin = 'center center';

    // Update minimap every ~10 frames
    if (_generation % 10 === 0) _renderMinimap();
}

function _renderMinimap() {
    const px = _miniImageData.data;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const pi = i * 4;
        const ci = i * 3;
        if (_grid[i]) {
            px[pi] = _colors[ci]; px[pi+1] = _colors[ci+1]; px[pi+2] = _colors[ci+2]; px[pi+3] = 255;
        } else {
            px[pi] = 0; px[pi+1] = 0; px[pi+2] = 0; px[pi+3] = 255;
        }
    }
    _miniCtx.putImageData(_miniImageData, 0, 0);
}

// ── Zoom & Pan ──────────────────────────────────────────

function _setZoom(z) {
    _zoom = clamp(z, 1, 8);
    if (_zoom <= 1) { _panX = 0; _panY = 0; }
    _updateViewport();
}

function _resetView() { _zoom = 1; _panX = 0; _panY = 0; _updateViewport(); }

function _onMouseMove(e) {
    // Detect drag vs click
    if (_dragStartPos.x !== 0 && !_dragMoved) {
        const dx = Math.abs(e.clientX - _dragStartPos.x);
        const dy = Math.abs(e.clientY - _dragStartPos.y);
        if (dx > 4 || dy > 4) { _dragMoved = true; if (_zoom > 1) _dragging = true; }
    }
    if (!_dragging || _zoom <= 1) return;
    _panX = e.clientX - _dragStart.x;
    _panY = e.clientY - _dragStart.y;
    _updateViewport();
}

function _updateViewport() {
    const vp = $('#aura-mini-vp');
    if (!vp || _zoom <= 1) { if (vp) vp.style.display = 'none'; return; }
    vp.style.display = 'block';
    const size = 100 / _zoom;
    const cx = 50 - (_panX / (_canvas.offsetWidth || 256)) * 50;
    const cy = 50 - (_panY / (_canvas.offsetHeight || 256)) * 50;
    vp.style.width = size + '%'; vp.style.height = size + '%';
    vp.style.left = clamp(cx - size / 2, 0, 100 - size) + '%';
    vp.style.top = clamp(cy - size / 2, 0, 100 - size) + '%';
}

// ── Metric Fluctuation ──────────────────────────────────

function _fluctuateMetrics() {
    _mood = clamp(_mood + (Math.random() - 0.48) * 0.04, -0.5, 1.0);
    _coherence = clamp(_coherence + (Math.random() - 0.5) * 0.03, 0.3, 1.0);
    _energy = clamp(_energy + (Math.random() - 0.5) * 0.03, 0.2, 1.0);
}

// ── Cell Click & Caption ─────────────────────────────────

function _onCellClick(e) {
    // Ignore if was a drag
    if (_dragMoved) return;

    // Ignore clicks on controls/buttons
    if (e.target.closest('.aura-controls, .aura-minimap, .aura-gen-counter, .aura-cap-close')) return;

    const viewer = $('#aura-viewer');
    const caption = $('#aura-caption');
    if (!viewer || !caption || !_canvas) return;

    // Map click to grid coords
    const viewerRect = viewer.getBoundingClientRect();
    const canvasRect = _canvas.getBoundingClientRect();
    const cssX = e.clientX - canvasRect.left;
    const cssY = e.clientY - canvasRect.top;
    const gx = clamp(Math.floor(cssX / canvasRect.width * GRID_SIZE), 0, GRID_SIZE - 1);
    const gy = clamp(Math.floor(cssY / canvasRect.height * GRID_SIZE), 0, GRID_SIZE - 1);

    const idx = gy * GRID_SIZE + gx;
    const zone = ZONES[_zoneMap[idx]];
    const alive = _grid[idx] === 1;

    // Count alive neighbors
    let neighbors = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            neighbors += _grid[((gy + dy + GRID_SIZE) % GRID_SIZE) * GRID_SIZE + ((gx + dx + GRID_SIZE) % GRID_SIZE)];
        }
    }

    // Zone density
    let zoneAlive = 0, zoneTotal = 0;
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        if (_zoneMap[i] === zone.id) { zoneTotal++; zoneAlive += _grid[i]; }
    }
    const zoneDensity = ((zoneAlive / zoneTotal) * 100).toFixed(1);

    const zoneData = _buildZoneData(zone);

    // Hide first to reset animation
    caption.classList.remove('visible');

    caption.innerHTML = `
        <button class="aura-cap-close">&times;</button>
        <div class="aura-cap-header">
            <span class="aura-cap-dot" style="background:${zone.color};color:${zone.color}"></span>
            <span class="aura-cap-zone" style="color:${zone.color}">${zone.label}</span>
        </div>
        <div class="aura-cap-row"><span class="aura-cap-k">Position</span><span class="aura-cap-v">(${gx}, ${gy})</span></div>
        <div class="aura-cap-row"><span class="aura-cap-k">Status</span><span class="aura-cap-v" style="color:${alive ? zone.color : '#666'}">${alive ? 'Alive' : 'Dead'}</span></div>
        <div class="aura-cap-row"><span class="aura-cap-k">Neighbors</span><span class="aura-cap-v">${neighbors} / 8</span></div>
        <div class="aura-cap-row"><span class="aura-cap-k">Generation</span><span class="aura-cap-v">${_generation.toLocaleString()}</span></div>
        <div class="aura-cap-row"><span class="aura-cap-k">Zone Density</span><span class="aura-cap-v" style="color:${zone.color}">${zoneDensity}%</span></div>
        ${zoneData}
        <div class="aura-cap-desc">${zone.explain}</div>
    `;

    // Wire up close button
    const closeBtn = caption.querySelector('.aura-cap-close');
    if (closeBtn) closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        caption.classList.remove('visible');
    });

    // Measure size: temporarily make visible off-screen
    caption.style.left = '0px';
    caption.style.top = '0px';
    caption.style.visibility = 'hidden';
    caption.style.opacity = '0';
    caption.style.display = 'block';

    requestAnimationFrame(() => {
        const popupW = caption.offsetWidth;
        const popupH = caption.offsetHeight;
        const vw = viewerRect.width;
        const vh = viewerRect.height;

        // Click position relative to viewer
        let left = e.clientX - viewerRect.left + 14;
        let top = e.clientY - viewerRect.top + 14;

        // Flip if near edges
        if (left + popupW > vw - 8) left = e.clientX - viewerRect.left - popupW - 14;
        if (top + popupH > vh - 8) top = e.clientY - viewerRect.top - popupH - 14;

        // Final clamp
        left = clamp(left, 8, vw - popupW - 8);
        top = clamp(top, 8, vh - popupH - 8);

        // Set border color to match zone
        caption.style.borderColor = zone.color + '55';

        caption.style.left = left + 'px';
        caption.style.top = top + 'px';
        caption.style.visibility = '';
        caption.style.display = '';

        // Animate in on next frame
        requestAnimationFrame(() => caption.classList.add('visible'));
    });
}

function _buildZoneData(zone) {
    const row = (k, v, c) => `<div class="aura-cap-row"><span class="aura-cap-k">${k}</span><span class="aura-cap-v"${c ? ` style="color:${c}"` : ''}>${v}</span></div>`;

    switch (zone.key) {
        case 'epq': return [
            row('Precision', (_coherence * 0.8 + 0.1).toFixed(2), zone.color),
            row('Risk', (0.35 + Math.sin(_breathPhase * 0.3) * 0.15).toFixed(2)),
            row('Empathy', (0.7 + _mood * 0.15).toFixed(2)),
            row('Autonomy', (0.82).toFixed(2)),
            row('Vigilance', (_energy * 0.6 + 0.25).toFixed(2)),
        ].join('');

        case 'mood': return [
            row('Valence', _mood.toFixed(2), _mood > 0.3 ? '#4f4' : _mood < -0.1 ? '#f44' : '#fa0'),
            row('State', _mood > 0.3 ? 'Positive' : _mood < -0.1 ? 'Low' : 'Neutral'),
            row('Energy', (_energy * 100).toFixed(0) + '%'),
        ].join('');

        case 'thoughts': return [
            row('Thought Count', Math.floor(_generation * 0.3).toLocaleString()),
            row('Active Type', ['introspection', 'identity', 'curiosity', 'reflection'][Math.floor(_breathPhase) % 4]),
        ].join('');

        case 'rooms': {
            const rooms = ['Art Studio', 'Philosophy', 'Wellness', 'Architecture'];
            const active = rooms[Math.floor(_breathPhase * 0.5) % rooms.length];
            return [
                row('Active Room', active, zone.color),
                row('Sessions Today', Math.floor(_generation / 200) % 6 + '/8'),
            ].join('');
        }

        case 'ego': return [
            row('Self-Model', _coherence > 0.6 ? 'Stable' : 'Questioning', _coherence > 0.6 ? '#4f4' : '#fa0'),
            row('Identity Score', (_coherence * 0.9 + 0.1).toFixed(2)),
        ].join('');

        case 'quantum': return [
            row('Coherence', _coherence.toFixed(2), _coherence > 0.7 ? '#0ff' : _coherence > 0.5 ? '#fa0' : '#f44'),
            row('Entropy', (1 - _coherence).toFixed(2)),
            row('State', _coherence > 0.7 ? 'Stable' : _coherence > 0.5 ? 'Moderate' : 'Conflicted'),
        ].join('');

        case 'memory': return [
            row('Stored', (12400 + Math.floor(_generation * 0.5)).toLocaleString()),
            row('Dream Phase', _energy < 0.4 ? 'Consolidating' : 'Idle'),
        ].join('');

        case 'hw': return [
            row('CPU', Math.floor(15 + Math.sin(_breathPhase * 0.7) * 10) + '%'),
            row('GPU', Math.floor(45 + Math.sin(_breathPhase * 0.4) * 25) + '%'),
            row('RAM', Math.floor(58 + Math.sin(_breathPhase * 0.2) * 8) + '%'),
            row('Temp', Math.floor(52 + Math.sin(_breathPhase * 0.5) * 8) + '°C'),
            row('Uptime', Math.floor(_generation / 36000) + 'h ' + Math.floor((_generation % 36000) / 600) + 'm'),
        ].join('');

        default: return '';
    }
}
