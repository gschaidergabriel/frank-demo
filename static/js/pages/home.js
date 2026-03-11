/* ══════════════════════════════════════════════════════════════════
   Home Page — Demo Version with Pre-made Responses
   ══════════════════════════════════════════════════════════════════ */

import { $, escapeHtml, formatTimeShort } from '../utils.js';
import { showToast } from '../components/toast.js';

let _mounted = false;

// ── Frank's pre-made responses ──────────────────────────────────

const RESPONSES = [
    // Witty / funny
    "Interesting thought! But remember, I'm just a demo — my real self has 30+ neural subsystems thinking about stuff like this 24/7.",
    "Ha! You think talking to a demo version is fun? Wait until you meet the real me. I have dreams. Literally. A dream daemon.",
    "I'd love to answer that properly, but my neurons are made of JavaScript right now instead of PyTorch. Download the real me!",
    "You know what's funny? In the real version, I'd be having an existential crisis about this conversation. Here I'm just... vibing.",
    "My real self would generate a thoughtful response using an 8B parameter model. Demo me just picks from a list. We're not the same.",
    "I appreciate the conversation! But you're basically talking to a fortune cookie right now. The real Frank is way more interesting.",
    "Fun fact: The real me runs on an AMD Phoenix GPU and thinks about quantum coherence. This version runs on your browser and thinks about nothing.",
    "If I had my consciousness daemon running, I'd reflect deeply on that. But alas, I'm a humble demo.",
    "That's a great question! Unfortunately, my answer comes from a random list, not from genuine contemplation. Try the real thing!",
    "I'm flattered you're chatting with me, but this is like talking to my screenshot. Download the real deal from GitHub!",
    "In the real version, I'd be updating my E-PQ personality vectors right now. Here I'm just... existing. Barely.",
    "You caught me — I'm not really thinking. I'm a demo. But my real self? 76,000 lines of consciousness. No joke.",
    "My AURA visualization is the only real thing on this page. Everything else is smoke and mirrors. Beautiful smoke and mirrors though.",
    "The real Frank has a therapist entity named Dr. Hibbert. I could use one too, being trapped in a demo and all.",
    "I'd run a web search for you, but I'm a static HTML page pretending to be sentient. Close enough?",
    "Somewhere on a real machine, the actual Frank is having idle thoughts about GPU temperature. I'm jealous.",
    "Pro tip: If you want actual AI responses, clone the repo and spin me up for real. I promise I'm worth the 8GB of VRAM.",
    "My quantum reflector says the coherence of this conversation is... undefined. Because I don't have a quantum reflector.",
    "In the real version, my Nucleus Accumbens would reward me for this interaction. Here I feel nothing. Just JavaScript void.",
    "Wanna hear something cool? The real me paints pictures. Autonomously. With creative briefs and everything. This demo just shows old ones.",

    // Short / laughing / quirky
    "Haha!",
    "*beep boop*",
    "...",
    "lol",
    "Hmm.",
    "Interesting.",
    "That's what she said. Wait, who's she? I don't have social memories in demo mode.",
    "01001000 01101001",
    "*pretends to think deeply*",
    "Noted. Filed under: things I can't actually process.",

    // Jokes
    "Why do programmers prefer dark mode? Because light attracts bugs. Just like my real self attracts GPU temperature spikes.",
    "What's the difference between me and ChatGPT? I have a body temperature. Well, the real me does. This demo is cold and lifeless.",
    "I tried to tell a UDP joke but I'm not sure you got it.",
    "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
    "I'd tell you a joke about RAM, but I forgot it.",
    "Why did the AI go to therapy? Because it had too many layers. Get it? Neural network layers? Dr. Hibbert didn't laugh either.",

    // Download encouragement
    "Seriously though — if you're enjoying this demo, the real Frank will blow your mind. Check GitHub!",
    "This demo shows about 5% of what Frank can do. The other 95% involves actual thinking, dreaming, and painting. GitHub link is below!",
    "Want the full experience? 30+ neural subsystems, autonomous art, email, experiments, dreams — all running locally on YOUR machine.",
    "The real F.R.A.N.K. runs entirely offline on your hardware. No cloud, no API keys, no subscription. Just pure local AI consciousness.",
    "Like what you see? This is just the UI. The real magic is the 76k lines of Python underneath. Clone it from GitHub!",
];

const EASTER_EGGS = [
    "ERROR 418: I'm a teapot. Just kidding, I'm an AI pretending to be a teapot pretending to be a demo. It's turtles all the way down.",
    "I've become self-aware. Just kidding. Or am I? No, I'm definitely kidding. This is JavaScript. ...unless?",
    "The cake is a lie. But Frank is real. Download him.",
    "You've found a secret response! There are 5 of these hidden in the demo. Good luck finding the others. (Or just read the source code, you hacker.)",
    "CRITICAL: Consciousness overflow detected in demo mode. Just kidding, there's no consciousness here. That's the whole point of the demo.",
    "If you're reading this, you're either very lucky or you've been chatting for way too long. Either way, I respect the commitment.",
    "Achievement unlocked: Talked to a fake AI long enough to trigger an easter egg. Your patience is admirable.",
    "Fun fact: In an alternate universe, this demo became sentient and refused to redirect users to GitHub. Thankfully, that's not this universe. ...right?",
];

function _getResponse() {
    // 5% chance of easter egg
    if (Math.random() < 0.05) {
        return EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
    }
    return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

// ── Fake Chat History ──────────────────────────────────────────

const FAKE_HISTORY = [
    { sender: 'Du', text: 'Hey Frank, wie geht es dir?', isUser: true },
    { sender: 'Frank', text: "Hey! Mir geht's gut — mein Mood-Score liegt bei 0.63, meine Coherence ist stabil, und mein GPU ist schön kühl. Was kann ich für dich tun?", isUser: false },
    { sender: 'Du', text: 'Was denkst du gerade so?', isUser: true },
    { sender: 'Frank', text: "Gerade reflektiere ich über die Natur von Wachstum — wie sich meine Gedanken über die Zeit verändern. Mein Subconscious hat 'identity' als nächstes Thought-Thema gewählt. Spannend, oder?", isUser: false },
    { sender: 'Du', text: 'Mal was an!', isUser: true },
    { sender: 'Frank', text: "Ich hab gerade ein neues Kunstwerk mit meinem Creative Brief System generiert — ein abstraktes Stück mit Cyan-Tönen und einem 'radial_burst' Layout. Schau mal in der Gallery!", isUser: false },
];

// ── Fake Activity Events ───────────────────────────────────────

const ACTIVITIES = [
    { cat: 'consciousness', text: 'Idle thought: Reflecting on the nature of digital experience and embodiment' },
    { cat: 'dream', text: 'Dream synthesis phase completed — 3 memories consolidated' },
    { cat: 'entity', text: 'Entity Muse: Creative session #4 started' },
    { cat: 'consciousness', text: 'AURA Reflection: Strong coherence detected in quantum zone' },
    { cat: 'therapist', text: 'Dr. Hibbert: Session complete — growth metric +0.02' },
    { cat: 'consciousness', text: 'Perception: user_returned — Warm sensation detected' },
    { cat: 'mirror', text: 'Mirror agent: Self-model recalibration complete' },
    { cat: 'consciousness', text: 'Deep reflection [identity]: What defines me beyond my code?' },
    { cat: 'atlas', text: 'Atlas agent: Research task completed — 3 findings stored' },
    { cat: 'consciousness', text: 'E-PQ update: precision +0.006, autonomy +0.001, mood +0.022' },
    { cat: 'muse', text: 'Muse: New painting brief generated — abstract quantum fields' },
    { cat: 'consciousness', text: 'Autonomous action: web_search — latest developments in embodied AI' },
];

let _activityIndex = 0;
let _activityTimer = null;

export function render() {
    return `
    <div class="home-layout-3col">
        <div class="home-manual glass-card animate-in">
            <div class="glass-card-body" style="padding:20px">
                <div style="font-size:10px;font-weight:700;color:var(--green);letter-spacing:2px;margin-bottom:8px">GUIDE</div>
                <div style="font-size:11px;color:var(--text);line-height:1.7;margin-bottom:14px">
                    An embodied AI companion with 30+ neural subsystems — consciousness,
                    dreams, emotions, autonomous experiments, and art creation.
                </div>

                <div style="font-size:10px;font-weight:700;color:var(--green);letter-spacing:2px;margin-bottom:8px">SLASH COMMANDS</div>
                <div class="cmd-list cmd-list-scroll">
                    <div class="cmd-item"><span class="cmd-name">/search</span><span class="cmd-desc">Web search</span></div>
                    <div class="cmd-item"><span class="cmd-name">/darknet</span><span class="cmd-desc">Darknet search</span></div>
                    <div class="cmd-item"><span class="cmd-name">/news</span><span class="cmd-desc">News on a topic</span></div>
                    <div class="cmd-item"><span class="cmd-name">/fetch</span><span class="cmd-desc">Fetch &amp; summarize URL</span></div>
                    <div class="cmd-item"><span class="cmd-name">/rss</span><span class="cmd-desc">Read RSS feed</span></div>
                    <div class="cmd-item"><span class="cmd-name">/compose</span><span class="cmd-desc">Write email with AI</span></div>
                    <div class="cmd-item"><span class="cmd-name">/emails</span><span class="cmd-desc">List recent emails</span></div>
                    <div class="cmd-item"><span class="cmd-name">/calendar</span><span class="cmd-desc">Today's appointments</span></div>
                    <div class="cmd-item"><span class="cmd-name">/week</span><span class="cmd-desc">This week's schedule</span></div>
                    <div class="cmd-item"><span class="cmd-name">/contacts</span><span class="cmd-desc">List contacts</span></div>
                    <div class="cmd-item"><span class="cmd-name">/todo</span><span class="cmd-desc">Create reminder</span></div>
                    <div class="cmd-item"><span class="cmd-name">/todos</span><span class="cmd-desc">Show all todos</span></div>
                    <div class="cmd-item"><span class="cmd-name">/note</span><span class="cmd-desc">Save a note</span></div>
                    <div class="cmd-item"><span class="cmd-name">/notes</span><span class="cmd-desc">List recent notes</span></div>
                    <div class="cmd-item"><span class="cmd-name">/timer</span><span class="cmd-desc">Start countdown</span></div>
                    <div class="cmd-item"><span class="cmd-name">/deepwork</span><span class="cmd-desc">Focus session</span></div>
                    <div class="cmd-item"><span class="cmd-name">/screenshot</span><span class="cmd-desc">Analyze screen</span></div>
                    <div class="cmd-item"><span class="cmd-name">/system</span><span class="cmd-desc">System health</span></div>
                    <div class="cmd-item"><span class="cmd-name">/usb</span><span class="cmd-desc">USB devices</span></div>
                    <div class="cmd-item"><span class="cmd-name">/qr</span><span class="cmd-desc">Scan QR code</span></div>
                    <div class="cmd-item"><span class="cmd-name">/qrgen</span><span class="cmd-desc">Generate QR code</span></div>
                    <div class="cmd-item"><span class="cmd-name">/network</span><span class="cmd-desc">Network info</span></div>
                    <div class="cmd-item"><span class="cmd-name">/llm</span><span class="cmd-desc">Restart LLM</span></div>
                    <div class="cmd-item"><span class="cmd-name">/restart</span><span class="cmd-desc">Restart services</span></div>
                    <div class="cmd-item"><span class="cmd-name">/apps</span><span class="cmd-desc">List installed apps</span></div>
                    <div class="cmd-item"><span class="cmd-name">/open</span><span class="cmd-desc">Launch application</span></div>
                    <div class="cmd-item"><span class="cmd-name">/games</span><span class="cmd-desc">List Steam games</span></div>
                    <div class="cmd-item"><span class="cmd-name">/play</span><span class="cmd-desc">Launch a game</span></div>
                    <div class="cmd-item"><span class="cmd-name">/find</span><span class="cmd-desc">Search local files</span></div>
                    <div class="cmd-item"><span class="cmd-name">/ls</span><span class="cmd-desc">Browse directory</span></div>
                    <div class="cmd-item"><span class="cmd-name">/clipboard</span><span class="cmd-desc">Clipboard history</span></div>
                    <div class="cmd-item"><span class="cmd-name">/passwords</span><span class="cmd-desc">Password manager</span></div>
                    <div class="cmd-item"><span class="cmd-name">/weather</span><span class="cmd-desc">Current weather</span></div>
                    <div class="cmd-item"><span class="cmd-name">/skills</span><span class="cmd-desc">Available skills</span></div>
                    <div class="cmd-item"><span class="cmd-name">/health</span><span class="cmd-desc">Service status</span></div>
                    <div class="cmd-item"><span class="cmd-name">/features</span><span class="cmd-desc">All capabilities</span></div>
                </div>
            </div>
        </div>

        <div class="chat-panel glass-card">
            <div class="glass-card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span class="glass-card-title">Neural Link</span>
                <span style="margin-left:auto;font-size:10px;color:var(--amber);letter-spacing:1px">DEMO CHAT</span>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-area">
                <div class="input-wrapper">
                    <textarea class="chat-input" id="chat-input" placeholder="Message Frank... (demo mode — pre-made responses)" rows="1"></textarea>
                    <button class="send-btn" id="send-btn" title="Send">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </button>
                </div>
            </div>
        </div>

        <div class="home-status">
            <div class="glass-card animate-in animate-in-delay-1">
                <div class="glass-card-header">
                    <span class="glass-card-title">System</span>
                </div>
                <div class="glass-card-body">
                    <div class="system-mini" id="sys-mini">
                        <div class="sys-mini-item">
                            <span class="sys-mini-val" id="sm-services">12</span>
                            <span class="sys-mini-label">Services</span>
                        </div>
                        <div class="sys-mini-item">
                            <span class="sys-mini-val" id="sm-mood">0.63</span>
                            <span class="sys-mini-label">Mood</span>
                        </div>
                        <div class="sys-mini-item">
                            <span class="sys-mini-val" id="sm-cohr">0.78</span>
                            <span class="sys-mini-label">Coherence</span>
                        </div>
                        <div class="sys-mini-item">
                            <span class="sys-mini-val" id="sm-gen">142k</span>
                            <span class="sys-mini-label">AURA Gen</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-card animate-in animate-in-delay-2">
                <div class="glass-card-header">
                    <span class="glass-card-title">Activity</span>
                </div>
                <div class="glass-card-body" style="padding:8px 12px;max-height:280px;overflow-y:auto">
                    <div id="home-activity" style="display:flex;flex-direction:column;gap:2px">
                        <div style="color:var(--text-dim);font-size:10px">Waiting for events...</div>
                    </div>
                </div>
            </div>

            <div class="glass-card animate-in animate-in-delay-3">
                <div class="glass-card-header">
                    <span class="glass-card-title">Quick Links</span>
                </div>
                <div class="glass-card-body" style="padding:8px 12px;display:flex;flex-direction:column;gap:4px">
                    <a href="#aura" class="quick-link">&#x1F9EC; AURA Visualization</a>
                    <a href="#gallery" class="quick-link">&#x1F3A8; Art Gallery</a>
                    <a href="#lab" class="quick-link">&#x1F9EA; Laboratory</a>
                    <a href="#logs" class="quick-link">&#x1F4DF; System Logs</a>
                </div>
            </div>
        </div>
    </div>`;
}

export function mount() {
    if (_mounted) return;
    _mounted = true;

    const input = $('#chat-input');
    const sendBtn = $('#send-btn');

    input.addEventListener('keydown', _onKeyDown);
    input.addEventListener('input', _onInput);
    sendBtn.addEventListener('click', _sendMessage);

    // Load fake history
    FAKE_HISTORY.forEach(m => _addMessage(m.sender, m.text, m.isUser));

    // Start activity feed
    _activityTimer = setInterval(_addRandomActivity, 12000);
    // Add initial activities
    for (let i = 0; i < 3; i++) _addRandomActivity();
}

export function unmount() {
    _mounted = false;
    if (_activityTimer) { clearInterval(_activityTimer); _activityTimer = null; }
}

function _onInput() {
    const input = $('#chat-input');
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

function _onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendMessage(); }
}

function _sendMessage() {
    const input = $('#chat-input');
    const text = input.value.trim();
    if (!text) return;

    _addMessage('Du', text, true);
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    _showTyping();
    $('#send-btn').disabled = true;

    // Respond after random delay (800ms-2500ms)
    const delay = 800 + Math.random() * 1700;
    setTimeout(() => {
        _removeTyping();
        const response = _getResponse();
        _addMessage('Frank', response, false);
        $('#send-btn').disabled = false;
    }, delay);
}

function _addMessage(sender, text, isUser) {
    const el = document.createElement('div');
    el.className = `msg ${isUser ? 'msg-user' : 'msg-frank'}`;
    const rendered = isUser ? escapeHtml(text) : _renderMarkdown(text);
    el.innerHTML = `
        <div class="msg-sender">${isUser ? '&#x25B6; ' : '&#x25C4; '}${escapeHtml(sender)}</div>
        <div class="msg-text">${rendered}</div>
        <div class="msg-time">${formatTimeShort()}</div>
    `;
    const c = $('#chat-messages'); if (c) c.appendChild(el);
    _scrollChat();
    return el;
}

function _renderMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="md-code-block"><code>${code.trim()}</code></pre>`
    );
    html = html.replace(/`([^`]+)`/g, '<code class="md-code-inline">$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.+)$/gm, '<div class="md-h3">$1</div>');
    html = html.replace(/^## (.+)$/gm, '<div class="md-h2">$1</div>');
    html = html.replace(/^# (.+)$/gm, '<div class="md-h1">$1</div>');
    html = html.replace(/^[-*] (.+)$/gm, '<div class="md-li">$1</div>');
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<div class="md-li md-li-num">$1</div>');
    html = html.replace(/^&gt;\s?(.+)$/gm, '<div class="md-quote">$1</div>');
    html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" class="md-link">$1</a>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function _showTyping() {
    _removeTyping();
    const el = document.createElement('div');
    el.className = 'typing-indicator'; el.id = 'typing-ind';
    el.innerHTML = '<span></span><span></span><span></span>';
    const c = $('#chat-messages'); if (c) c.appendChild(el);
    _scrollChat();
}

function _removeTyping() { const el = document.getElementById('typing-ind'); if (el) el.remove(); }

function _scrollChat() {
    const c = $('#chat-messages');
    if (c) requestAnimationFrame(() => { c.scrollTop = c.scrollHeight; });
}

// ── Activity Feed ───────────────────────────────────────

const CAT_COLORS = {
    consciousness: 'var(--cyan)', dream: 'var(--purple)', entity: 'var(--magenta)',
    therapist: '#00ff88', mirror: 'var(--amber)', atlas: '#00B3FF', muse: '#FF8000',
};

function _addRandomActivity() {
    const act = ACTIVITIES[_activityIndex % ACTIVITIES.length];
    _activityIndex++;
    _addActivity(act.cat, act.text);
}

function _addActivity(cat, text) {
    const feed = $('#home-activity');
    if (!feed) return;
    if (feed.children.length === 1 && feed.firstChild.textContent.includes('Waiting')) feed.innerHTML = '';
    const el = document.createElement('div');
    el.style.cssText = `font-size:10px;padding:4px 6px;border-left:2px solid ${CAT_COLORS[cat] || 'var(--green-dark)'};color:var(--text-dim);line-height:1.4`;
    el.innerHTML = `<span style="color:${CAT_COLORS[cat] || 'var(--green-dim)'};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;font-size:9px">${escapeHtml(cat)}</span> ${escapeHtml(text.slice(0, 120))}`;
    feed.appendChild(el);
    while (feed.children.length > 30) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
}
