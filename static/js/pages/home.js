/* ══════════════════════════════════════════════════════════════════
   Home Page — Neural-net response selection via FrankBrain
   ══════════════════════════════════════════════════════════════════ */

import { $, escapeHtml, formatTimeShort } from '../utils.js';
import { showToast } from '../components/toast.js';
import { FrankBrain } from '../frank-brain.js';
import { FRANK_DB } from '../frank-responses.js';

let _mounted = false;
const brain = new FrankBrain(FRANK_DB);

// ── Event listener references (for proper cleanup) ───────────
let _keyHandler = null;
let _inputHandler = null;
let _sendHandler = null;

// ── Fake Chat History ────────────────────────────────────────

const FAKE_HISTORY = [
    { sender: 'You', text: 'Hi Frank, how are you?', isUser: true },
    { sender: 'Frank', text: "Hey! Mood score 0.71, coherence stable, 11 rooms operational. I'd say I'm thriving, but I'm a demo so technically I'm just... existing. Ask me anything -- consciousness, dreams, art, my 30+ neural subsystems, or why I paint at 3 AM. I've got time. Well, all I have is time.", isUser: false },
];


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
                    <textarea class="chat-input" id="chat-input" placeholder="Message Frank... (demo mode)" rows="1"></textarea>
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
                <div class="glass-card-body" style="padding:6px 8px">
                    <div class="system-mini" id="sys-mini" style="grid-template-columns:1fr 1fr;gap:4px">
                        <div class="sys-mini-item" style="padding:6px 4px">
                            <span class="sys-mini-val" id="sm-services" style="font-size:16px">12</span>
                            <span class="sys-mini-label" style="font-size:8px">Services</span>
                        </div>
                        <div class="sys-mini-item" style="padding:6px 4px">
                            <span class="sys-mini-val" id="sm-mood" style="font-size:16px">0.63</span>
                            <span class="sys-mini-label" style="font-size:8px">Mood</span>
                        </div>
                        <div class="sys-mini-item" style="padding:6px 4px">
                            <span class="sys-mini-val" id="sm-cohr" style="font-size:16px">0.78</span>
                            <span class="sys-mini-label" style="font-size:8px">Coherence</span>
                        </div>
                        <div class="sys-mini-item" style="padding:6px 4px">
                            <span class="sys-mini-val" id="sm-gen" style="font-size:16px">142k</span>
                            <span class="sys-mini-label" style="font-size:8px">AURA Gen</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-card animate-in animate-in-delay-2">
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

    _keyHandler = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendMessage(); } };
    _inputHandler = () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; };
    _sendHandler = () => _sendMessage();

    input.addEventListener('keydown', _keyHandler);
    input.addEventListener('input', _inputHandler);
    sendBtn.addEventListener('click', _sendHandler);

    // Load fake history
    FAKE_HISTORY.forEach(m => _addMessage(m.sender, m.text, m.isUser));
}

export function unmount() {
    if (!_mounted) return;
    _mounted = false;

    const input = $('#chat-input');
    const sendBtn = $('#send-btn');

    if (input && _keyHandler) input.removeEventListener('keydown', _keyHandler);
    if (input && _inputHandler) input.removeEventListener('input', _inputHandler);
    if (sendBtn && _sendHandler) sendBtn.removeEventListener('click', _sendHandler);

    _keyHandler = _inputHandler = _sendHandler = null;
}

function _sendMessage() {
    const input = $('#chat-input');
    const text = input.value.trim();
    if (!text) return;

    _addMessage('You', text, true);
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    _showTyping();
    $('#send-btn').disabled = true;

    // Use neural net to pick response
    const response = brain.respond(text);
    const delay = 600 + Math.random() * 1400;
    setTimeout(() => {
        _removeTyping();
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
    const c = $('#chat-messages');
    if (c) {
        c.appendChild(el);
        // Memory leak fix: cap at 150 messages
        while (c.children.length > 150) {
            c.removeChild(c.firstChild);
        }
    }
    _scrollChat();
    return el;
}

function _renderMarkdown(text) {
    if (!text) return '';
    // Responses are pre-made trusted content — preserve existing HTML (CTA links)
    let html = text;
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="md-code-block"><code>${code.trim()}</code></pre>`
    );
    html = html.replace(/`([^`]+)`/g, '<code class="md-code-inline">$1</code>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Auto-link bare URLs only if response has no pre-formatted HTML links
    if (!html.includes('<a ')) {
        html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" class="md-link">$1</a>');
    }
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
