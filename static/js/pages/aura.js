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
    { id: 0, key: 'epq',      label: 'Personality (E-PQ)', color: '#00B3FF',  r: 0, g: 179, b: 255, desc: 'Personality trait vectors' },
    { id: 1, key: 'mood',     label: 'Mood',               color: '#FF8000',  r: 255, g: 128, b: 0, desc: 'Emotional valence buffer' },
    { id: 2, key: 'thoughts', label: 'Thoughts',           color: '#00FF4D',  r: 0, g: 255, b: 77, desc: 'Idle thoughts & reflections' },
    { id: 3, key: 'rooms',    label: 'Rooms',              color: '#FF00CC',  r: 255, g: 0, b: 204, desc: 'Solo activity rooms' },
    { id: 4, key: 'ego',      label: 'Ego',                color: '#FFD900',  r: 255, g: 217, b: 0, desc: 'Self-model construct' },
    { id: 5, key: 'quantum',  label: 'Quantum',            color: '#00FFFF',  r: 0, g: 255, b: 255, desc: 'Epistemic coherence (QUBO)' },
    { id: 6, key: 'memory',   label: 'Memory',             color: '#B34DFF',  r: 179, g: 77, b: 255, desc: 'Long-term memory (Titan)' },
    { id: 7, key: 'hw',       label: 'Hardware',           color: '#FF331A',  r: 255, g: 51, b: 26, desc: 'Physical system sensors' },
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
            <div class="aura-caption" id="aura-caption" style="display:none"></div>
        </div>
        <div class="aura-sidebar">
            <div class="glass-card animate-in">
                <div class="glass-card-header">
                    <span class="glass-card-title">AURA Status</span>
                    <span style="margin-left:auto;font-size:9px;color:var(--amber);letter-spacing:1px">DEMO</span>
                </div>
                <div class="glass-card-body" style="padding:14px 16px">
                    <div style="font-size:10px;color:var(--text-dim);line-height:1.6;margin-bottom:14px">
                        256x256 Game of Life — Frank's inner life. Each zone maps to a neural subsystem. Click cells to inspect.
                    </div>
                    <div class="aura-metric-row">
                        <span class="aura-metric-label">Mood</span>
                        <span class="aura-metric-value" id="a-mood">0.63</span>
                    </div>
                    <div class="aura-bar"><div class="aura-bar-fill mood" id="a-mood-bar" style="width:63%"></div></div>
                    <div class="aura-metric-row" style="margin-top:10px">
                        <span class="aura-metric-label">Coherence</span>
                        <span class="aura-metric-value" id="a-cohr">0.78</span>
                    </div>
                    <div class="aura-bar"><div class="aura-bar-fill coherence" id="a-cohr-bar" style="width:78%"></div></div>
                    <div class="aura-metric-row" style="margin-top:10px">
                        <span class="aura-metric-label">Energy</span>
                        <span class="aura-metric-value" id="a-energy">0.71</span>
                    </div>
                    <div class="aura-bar"><div class="aura-bar-fill energy" id="a-energy-bar" style="width:71%"></div></div>
                </div>
            </div>
            <div class="glass-card animate-in animate-in-delay-1">
                <div class="glass-card-header">
                    <span class="glass-card-title">Zones</span>
                </div>
                <div class="glass-card-body" style="padding:10px 16px">
                    <div class="aura-zone-list" id="aura-zone-list">
                        ${ZONES.map(z => `
                            <div class="aura-zone-item" style="--zc:${z.color}">
                                <span class="aura-zone-dot" style="background:${z.color}"></span>
                                <span class="aura-zone-name">${z.label}</span>
                                <span class="aura-zone-val" id="az-${z.key}">--</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="glass-card animate-in animate-in-delay-2" id="aura-cell-card">
                <div class="glass-card-header">
                    <span class="glass-card-title" id="aura-cell-title">Cell Info</span>
                </div>
                <div class="glass-card-body" style="padding:12px 16px" id="aura-cell-body">
                    <div style="color:var(--text-dim);font-size:10px">Click a cell on the grid to inspect</div>
                </div>
            </div>
            <div class="glass-card animate-in animate-in-delay-3">
                <div class="glass-card-header">
                    <span class="glass-card-title">Introspection</span>
                </div>
                <div class="glass-card-body introspect-section" id="aura-introspect" style="padding:12px 16px">
                    <div class="introspect-item">State: idle_focus</div>
                    <div class="introspect-item">Pattern: stable oscillation</div>
                    <div class="introspect-item">Dominant zone: Thoughts (22% activity)</div>
                    <div class="introspect-item">Quantum coherence holding at 0.78</div>
                    <div class="introspect-item">Memory consolidation pending</div>
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
        if (_zoom <= 1) return;
        _dragging = true;
        _dragStart = { x: e.clientX - _panX, y: e.clientY - _panY };
    });
    window.addEventListener('mousemove', _onMouseMove);
    window.addEventListener('mouseup', () => { _dragging = false; });

    _canvas.addEventListener('click', _onCellClick);

    // Start animation
    _animId = requestAnimationFrame(_animLoop);

    // GoL step timer (10 Hz like the real version)
    _genTimer = setInterval(_stepGoL, 100);

    // Metric fluctuation
    _metricTimer = setInterval(_fluctuateMetrics, 5000);
    _updateZoneValues();
}

let _metricTimer = null;

export function unmount() {
    _mounted = false;
    if (_animId) { cancelAnimationFrame(_animId); _animId = null; }
    if (_genTimer) { clearInterval(_genTimer); _genTimer = null; }
    if (_metricTimer) { clearInterval(_metricTimer); _metricTimer = null; }
    window.removeEventListener('mousemove', _onMouseMove);
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
    if (!_dragging) return;
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

// ── Cell Click ──────────────────────────────────────────

function _onCellClick(e) {
    const rect = _canvas.getBoundingClientRect();
    const scaleX = GRID_SIZE / rect.width * _zoom;
    const scaleY = GRID_SIZE / rect.height * _zoom;
    const gx = Math.floor((e.clientX - rect.left) * scaleX - (_panX / rect.width * GRID_SIZE));
    const gy = Math.floor((e.clientY - rect.top) * scaleY - (_panY / rect.height * GRID_SIZE));
    if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return;

    const idx = gy * GRID_SIZE + gx;
    const zoneId = _zoneMap[idx];
    const zone = ZONES[zoneId];
    const alive = _grid[idx] ? 'Alive' : 'Dead';

    const titleEl = $('#aura-cell-title');
    const bodyEl = $('#aura-cell-body');
    if (titleEl) titleEl.innerHTML = `<span style="color:${zone.color}">${zone.label}</span>`;
    if (bodyEl) {
        bodyEl.innerHTML = `
            <div class="aura-cap-row"><span class="aura-cap-k">Position</span><span class="aura-cap-v">(${gx}, ${gy})</span></div>
            <div class="aura-cap-row"><span class="aura-cap-k">Status</span><span class="aura-cap-v" style="color:${alive === 'Alive' ? zone.color : 'var(--text-dim)'}">${alive}</span></div>
            <div class="aura-cap-row"><span class="aura-cap-k">Zone</span><span class="aura-cap-v" style="color:${zone.color}">${zone.key}</span></div>
            <div style="border-top:1px solid var(--border-glass);margin:6px 0"></div>
            <div style="font-size:9px;color:var(--text-dim)">${zone.desc}</div>
        `;
    }
}

// ── Metric Fluctuation ──────────────────────────────────

function _fluctuateMetrics() {
    _mood = clamp(_mood + (Math.random() - 0.48) * 0.04, -0.5, 1.0);
    _coherence = clamp(_coherence + (Math.random() - 0.5) * 0.03, 0.3, 1.0);
    _energy = clamp(_energy + (Math.random() - 0.5) * 0.03, 0.2, 1.0);

    const el = (id, txt) => { const e = $(`#${id}`); if (e) e.textContent = txt; };
    el('a-mood', _mood.toFixed(2));
    el('a-cohr', _coherence.toFixed(2));
    el('a-energy', _energy.toFixed(2));

    const bar = (id, pct) => { const e = $(`#${id}`); if (e) e.style.width = pct + '%'; };
    bar('a-mood-bar', Math.abs(_mood) * 100);
    bar('a-cohr-bar', _coherence * 100);
    bar('a-energy-bar', _energy * 100);

    _updateZoneValues();
}

function _updateZoneValues() {
    const vals = {
        'epq': '0.2 -0.1 0.4 0.3',
        'mood': (_mood > 0.3 ? 'Positive' : _mood < -0.3 ? 'Low' : 'Neutral') + ` (${_mood.toFixed(2)})`,
        'thoughts': '847 stored',
        'rooms': 'Idle',
        'ego': 'Active',
        'quantum': (_coherence > 0.7 ? 'Stable' : 'Moderate') + ` (${_coherence.toFixed(2)})`,
        'memory': '847 refs',
        'hw': 'CPU 23% RAM 61%',
    };
    for (const [k, v] of Object.entries(vals)) {
        const el = $(`#az-${k}`); if (el) el.textContent = v;
    }
}
