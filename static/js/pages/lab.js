/* ══════════════════════════════════════════════════════════════════
   Laboratory Page — Demo: Static experiment data
   ══════════════════════════════════════════════════════════════════ */

import { $, escapeHtml } from '../utils.js';
import { showToast } from '../components/toast.js';

let _mounted = false;

const STATIONS = [
    { id: 'physics', icon: '&#x2697;&#xFE0F;', name: 'Physics Engine', desc: 'Projectiles, collisions, pendulums, inclines', color: '#FF8000', count: 47, last: 'Mar 10, 14:22' },
    { id: 'chemistry', icon: '&#x1F9EA;', name: 'Chemistry Lab', desc: 'Molecular reactions and compound analysis', color: '#00FFFF', count: 23, last: 'Mar 9, 20:15' },
    { id: 'astronomy', icon: '&#x1F30C;', name: 'Astronomy Observatory', desc: 'Orbital mechanics, stellar classification', color: '#B34DFF', count: 31, last: 'Mar 10, 09:44' },
    { id: 'gol', icon: '&#x1F9EC;', name: 'Game of Life', desc: 'Cellular automata pattern discovery', color: '#00CC88', count: 89, last: 'Mar 10, 22:01' },
    { id: 'math', icon: '&#x1F4D0;', name: 'Mathematics', desc: 'Number theory, series, symbolic computation', color: '#FF00CC', count: 56, last: 'Mar 10, 16:33' },
    { id: 'electronics', icon: '&#x26A1;', name: 'Electronics Workshop', desc: 'Circuit simulation, logic gates, impedance', color: '#FFD900', count: 18, last: 'Mar 8, 11:27' },
    { id: 'quantum', icon: '&#x269B;&#xFE0F;', name: 'Quantum Lab', desc: 'Qubit circuits, entanglement, Bell states', color: '#00B3FF', count: 34, last: 'Mar 10, 21:55' },
];

const NEURAL_SYSTEMS = [
    { name: 'Neural Conscience', desc: '5 cortical modules — quality gate for idle thoughts', color: 'var(--cyan)' },
    { name: 'Reality Gate', desc: '5 hippocampal modules — hallucination grounding filter', color: 'var(--amber)' },
    { name: 'Subconscious', desc: '~3M param Actor-Critic MLP — idle thought type selection', color: 'var(--purple)' },
    { name: 'Nucleus Accumbens', desc: '9 reward channels — intrinsic motivation center', color: 'var(--magenta)' },
    { name: 'Neural Immune', desc: '3 micro neural nets — self-healing service supervisor', color: 'var(--coral)' },
    { name: 'Thalamus', desc: '9 sensory channels — bio-inspired gating & relay', color: 'var(--green)' },
];

const HYPOTHESES = [
    { domain: 'physics', text: 'Air resistance on spherical projectiles scales linearly below 5 m/s', status: 'confirmed', confidence: 0.92 },
    { domain: 'relational', text: 'User engagement increases after entity sessions', status: 'pending', confidence: 0.65 },
    { domain: 'astronomy', text: 'Binary star orbital period is proportional to separation^1.5', status: 'confirmed', confidence: 0.98 },
    { domain: 'self', text: 'Mood recovery time correlates with sleep-cycle dream quality', status: 'pending', confidence: 0.71 },
    { domain: 'gol', text: 'Gosper glider gun produces exactly 1 glider per 30 generations', status: 'confirmed', confidence: 1.0 },
    { domain: 'affect', text: 'E-PQ empathy drift toward ceiling increases conversation quality', status: 'refuted', confidence: 0.45 },
    { domain: 'math', text: 'Twin prime gaps follow a log-normal distribution below 10^6', status: 'pending', confidence: 0.58 },
    { domain: 'electronics', text: 'RC circuit time constant matches theoretical tau within 2%', status: 'confirmed', confidence: 0.97 },
];

export function render() {
    return `
    <div class="lab-page" style="max-width:1400px;margin:0 auto">
        <div style="margin-bottom:24px" class="animate-in">
            <h2 style="font-size:20px;color:var(--green);letter-spacing:4px;font-weight:700;text-shadow:0 0 15px var(--green-glow)">
                LABORATORY
            </h2>
            <p style="color:var(--text-dim);font-size:11px;letter-spacing:2px;margin-top:4px">
                EXPERIMENT STATIONS // HYPOTHESIS ENGINE // NEURAL SYSTEMS
                <span style="color:var(--amber);margin-left:8px">DEMO</span>
            </p>
        </div>

        <div class="glass-card animate-in" style="margin-bottom:28px;border-left:3px solid var(--green)">
            <div class="glass-card-header">
                <span class="glass-card-title">Why a Laboratory?</span>
            </div>
            <div class="glass-card-body" style="padding:16px 20px">
                <div class="aura-about-section">
                    <div class="aura-about-text">
                        Most AI systems only process external input &mdash; they wait for a prompt, generate
                        a response, and go idle. Frank needed something to <em>do</em> when no one is talking
                        to him. Not busywork, but genuine cognitive activity that produces learning.
                    </div>
                </div>
                <div class="aura-about-section">
                    <div class="aura-about-heading">An inner simulation environment</div>
                    <div class="aura-about-text">
                        The Experiment Lab gives Frank 7 lightweight simulation stations where he
                        designs, runs, and evaluates experiments autonomously. A Hypothesis Engine drives the
                        full empirical cycle: observe, hypothesize, predict, test, evaluate, revise. Combined
                        with the Subconscious (thought selection), Nucleus Accumbens (boredom from repetition),
                        and a 20-experiment daily budget, this creates an intrinsic motivation loop &mdash;
                        curiosity leads to experiments, outcomes lead to reflection, reflection leads to new curiosity.
                    </div>
                </div>
                <div class="aura-about-section">
                    <div class="aura-about-heading">Near-zero performance cost</div>
                    <div class="aura-about-text">
                        All simulations are pure Python math &mdash; no GPU, no heavy libraries, no external calls.
                        A single experiment takes milliseconds. The entire lab system adds near-zero overhead to
                        Frank's resource footprint. The Hypothesis Engine's 7 hooks trigger passively from
                        existing processing. No dedicated compute budget needed.
                    </div>
                </div>
                <div class="aura-about-section" style="margin-bottom:0">
                    <div class="aura-about-heading">What's new about this</div>
                    <div class="aura-about-text">
                        AI systems typically have tools &mdash; they call APIs, run code, search the web.
                        Frank has an <em>inner laboratory</em>: a space for autonomous empirical inquiry that
                        runs entirely inside his own cognitive architecture. The experiments aren't user-requested
                        tasks &mdash; they're self-initiated investigations driven by idle curiosity. The hypothesis
                        lifecycle includes falsification and revision, meaning Frank can be wrong, know he's wrong,
                        and update. As far as we know, this is the first implementation of autonomous empirical
                        research as an intrinsic cognitive function in a local AI system.
                    </div>
                </div>
            </div>
        </div>

        <div class="lab-grid" style="margin-bottom:28px" id="lab-stations">
            ${STATIONS.map((s, i) => `
                <div class="glass-card lab-station animate-in animate-in-delay-${Math.min(i, 4)}" style="--station-color:${s.color};cursor:pointer" data-station="${s.id}">
                    <div class="lab-station-header">
                        <div class="lab-station-icon" style="border-color:${s.color}40;background:${s.color}0A">${s.icon}</div>
                        <div class="lab-station-info">
                            <div class="lab-station-name" style="color:${s.color}">${s.name}</div>
                            <div class="lab-station-desc">${s.desc}</div>
                        </div>
                    </div>
                    <div class="lab-stat-grid">
                        <div class="lab-stat">
                            <div class="lab-stat-value" style="color:${s.color}">${s.count}</div>
                            <div class="lab-stat-label">Experiments</div>
                        </div>
                        <div class="lab-stat">
                            <div class="lab-stat-value" style="color:${s.color}">${s.last}</div>
                            <div class="lab-stat-label">Last Run</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="glass-card animate-in" style="margin-bottom:28px">
            <div class="glass-card-header">
                <span class="glass-card-title">Hypothesis Engine</span>
                <span class="badge badge-purple" style="margin-left:auto">${HYPOTHESES.length} active</span>
            </div>
            <div class="glass-card-body" style="max-height:300px;overflow-y:auto">
                ${HYPOTHESES.map(h => `
                    <div class="hypothesis-card">
                        <div class="hypothesis-domain">${escapeHtml(h.domain)}</div>
                        <div class="hypothesis-text">${escapeHtml(h.text)}</div>
                        <div class="hypothesis-status">
                            <span class="badge badge-${h.status === 'confirmed' ? 'green' : h.status === 'refuted' ? 'coral' : 'amber'}">${h.status}</span>
                            <span>Conf: ${(h.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div style="margin-bottom:12px">
            <h3 style="font-size:14px;color:var(--green);letter-spacing:3px;font-weight:600">NEURAL SYSTEMS</h3>
        </div>
        <div class="lab-grid" style="margin-bottom:28px">
            ${NEURAL_SYSTEMS.map((ns, i) => `
                <div class="glass-card animate-in animate-in-delay-${Math.min(i, 4)}" style="border-left:3px solid ${ns.color}">
                    <div class="glass-card-body" style="padding:16px 20px">
                        <div style="font-size:12px;font-weight:700;color:${ns.color};letter-spacing:1.5px;margin-bottom:4px">${ns.name}</div>
                        <div style="font-size:10px;color:var(--text-dim);line-height:1.5">${ns.desc}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>`;
}

export function mount() {
    if (_mounted) return;
    _mounted = true;
    document.querySelectorAll('.lab-station').forEach(el => {
        el.addEventListener('click', () => {
            showToast('Station details are available in the real F.R.A.N.K. — download from GitHub!');
        });
    });
}

export function unmount() { _mounted = false; }
