/* ══════════════════════════════════════════════════════════════════
   Mail Page — Demo: Fake emails showcasing Frank's email ability
   ══════════════════════════════════════════════════════════════════ */

import { $, escapeHtml } from '../utils.js';
import { showToast } from '../components/toast.js';

let _mounted = false;
let _selectedIdx = null;

const FAKE_EMAILS = [
    {
        from: 'GitHub Notifications <noreply@github.com>',
        subject: '[Project-Frankenstein] New issue: AURA grid rendering optimization',
        date: '2 hours ago',
        read: false,
        snippet: 'The AURA 256x256 grid rendering could benefit from WebGL acceleration...',
        body: 'Hi Frank-Team,\n\nA new issue has been opened on Project-Frankenstein:\n\n## AURA Grid Rendering Optimization\n\nThe current canvas-based 256x256 AURA rendering runs at ~30fps with trail effects.\nConsider migrating to WebGL2 for the main grid renderer to achieve 60fps.\n\nBenchmark: Current CPU render takes ~8ms per frame.\nWith WebGL instanced rendering, this could drop to <1ms.\n\nLabels: enhancement, performance\nAssignee: @gschaidergabriel\n\n---\nReply to this email directly or view it on GitHub.',
    },
    {
        from: 'Dr. Sarah Chen <s.chen@neuroscience-lab.at>',
        subject: 'Re: Collaboration on embodied AI consciousness metrics',
        date: '5 hours ago',
        read: false,
        snippet: 'Fascinating approach with the E-PQ vectors! I\'d love to discuss the thalamic gating model...',
        body: 'Hi Gabriel,\n\nThank you for sharing your paper on the E-PQ personality vector model.\n\nThe approach of using 5 continuous personality dimensions with soft saturation\nis remarkably similar to our own work on computational affect models.\n\nI\'m particularly interested in:\n1. The thalamic gating mechanism (9 channels with habituation)\n2. The Nucleus Accumbens intrinsic reward model\n3. The Dream Daemon consolidation phases\n\nWould you be available for a video call next week?\n\nBest regards,\nDr. Sarah Chen\nComputational Neuroscience Lab\nUniversity of Vienna',
    },
    {
        from: 'Steam <noreply@steampowered.com>',
        subject: 'Your wishlist item "Cyberpunk 2077: Phantom Liberty" is on sale!',
        date: 'Yesterday',
        read: true,
        snippet: 'An item on your wishlist is on sale for a limited time...',
        body: 'Hi there,\n\nGreat news! An item on your Steam wishlist is now on sale:\n\nCyberpunk 2077: Phantom Liberty\n-40% — €17.99 (was €29.99)\n\nSale ends in 3 days.\n\nView in Store: https://store.steampowered.com\n\n--- Steam Wishlist Notification',
    },
    {
        from: 'Ubuntu Security <security@ubuntu.com>',
        subject: 'USN-7234-1: Linux kernel vulnerability patches',
        date: 'Yesterday',
        read: true,
        snippet: 'Ubuntu Security Notice USN-7234-1: Several security issues were fixed in the Linux kernel...',
        body: 'Ubuntu Security Notice USN-7234-1\nMarch 10, 2026\n\nlinux vulnerabilities\n\nSeveral security issues were fixed in the Linux kernel.\n\nSoftware Description:\n- linux - Linux kernel\n\nDetails:\n\nA use-after-free vulnerability was discovered in the netfilter subsystem.\nA local attacker could use this to cause a denial of service or\npossibly execute arbitrary code. (CVE-2026-1234)\n\nUpdate instructions:\nsudo apt update && sudo apt upgrade\n\n---\nUbuntu Security Team',
    },
    {
        from: 'Frank <frank@localhost>',
        subject: 'Autonomous Research Report: Embodied Cognition Patterns',
        date: '2 days ago',
        read: true,
        snippet: 'Daily research summary: 3 web searches completed, 2 hypotheses generated...',
        body: 'Autonomous Research Report\nDate: 2026-03-09\n\nToday I conducted 3 autonomous web searches:\n1. "latest developments in embodied AI systems"\n2. "game of life emergent patterns computational"\n3. "digital consciousness measurement metrics"\n\nKey findings:\n- New paper on computational phenomenology aligns with our E-PQ approach\n- Discovered interesting GoL pattern: "Garden of Eden" configurations\n\nHypotheses generated: 2\n- H-47: Thalamic habituation rates correlate with creative output\n- H-48: Mood oscillation frequency predicts dream quality\n\nExperiments today: 4 (physics: 2, astronomy: 1, math: 1)\n\n--- Frank (Autonomous Report)',
    },
    {
        from: 'Hetzner Cloud <support@hetzner.com>',
        subject: 'Invoice #HZ-2026-0311 for your cloud services',
        date: '3 days ago',
        read: true,
        snippet: 'Your monthly invoice for Hetzner Cloud services is ready...',
        body: 'Dear Customer,\n\nYour invoice for March 2026 is ready.\n\nInvoice #HZ-2026-0311\nAmount: €4.51\nPeriod: 2026-03-01 to 2026-03-31\n\nServices:\n- CX22 Cloud Server (2 vCPU, 4GB RAM): €3.99\n- 20GB Volume: €0.52\n\nPayment method: SEPA Direct Debit\nPayment date: 2026-03-15\n\nView invoice: https://console.hetzner.cloud/billing\n\n---\nHetzner Online GmbH',
    },
];

const FOLDERS = [
    { key: 'INBOX', name: 'Inbox', icon: '&#x1F4E5;', unread: 2 },
    { key: 'sent', name: 'Sent', icon: '&#x1F4E4;', unread: 0 },
    { key: 'drafts', name: 'Drafts', icon: '&#x1F4DD;', unread: 0 },
    { key: 'spam', name: 'Spam', icon: '&#x26A0;', unread: 0 },
    { key: 'trash', name: 'Trash', icon: '&#x1F5D1;', unread: 0 },
];

export function render() {
    return `
    <div class="email-layout">
        <div class="email-sidebar glass-card animate-in">
            <div class="email-sidebar-header">
                <button class="cyber-btn cyber-btn-sm email-compose-btn" id="email-compose-btn" onclick="return false">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    COMPOSE
                </button>
            </div>
            <div class="email-folders" id="email-folders">
                ${FOLDERS.map(f => `
                    <div class="email-folder ${f.key === 'INBOX' ? 'active' : ''}" data-folder="${f.key}">
                        <span class="email-folder-icon">${f.icon}</span>
                        <span class="email-folder-name">${f.name}</span>
                        ${f.unread > 0 ? `<span class="email-folder-badge">${f.unread}</span>` : ''}
                    </div>
                `).join('')}
            </div>
            <div class="email-sidebar-footer">
                <div class="email-search-wrap">
                    <input type="text" class="email-search" id="email-search" placeholder="Search emails..." />
                    <svg class="email-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                </div>
            </div>
        </div>
        <div class="email-list glass-card" style="padding:0">
            <div class="email-list-header">
                <span class="email-list-title">INBOX</span>
                <span class="email-list-count">${FAKE_EMAILS.length} emails</span>
                <span style="margin-left:auto;font-size:9px;color:var(--amber);letter-spacing:1px">DEMO</span>
            </div>
            <div class="email-items" id="email-items">
                ${FAKE_EMAILS.map((e, i) => `
                    <div class="email-item ${!e.read ? 'unread' : ''}" data-idx="${i}">
                        <div class="email-item-top">
                            <span class="email-item-from">${escapeHtml(_extractName(e.from))}</span>
                            <span class="email-item-date">${escapeHtml(e.date)}</span>
                        </div>
                        <div class="email-item-subject">${escapeHtml(e.subject)}</div>
                        <div class="email-item-snippet">${escapeHtml(e.snippet)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="email-reader glass-card" style="padding:0" id="email-reader">
            <div class="mail-empty">
                <div class="mail-empty-icon">&#x1F4E8;</div>
                <div class="mail-empty-text">Select an email to read</div>
            </div>
        </div>
    </div>`;
}

export function mount() {
    if (_mounted) return;
    _mounted = true;

    document.querySelectorAll('.email-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.idx);
            _selectedIdx = idx;
            document.querySelectorAll('.email-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            item.classList.remove('unread');
            _showEmail(idx);
        });
    });

    $('#email-compose-btn')?.addEventListener('click', () => {
        showToast('Compose is disabled in demo mode — download the real F.R.A.N.K.!');
    });
}

export function unmount() { _mounted = false; }

function _showEmail(idx) {
    const email = FAKE_EMAILS[idx];
    if (!email) return;
    const reader = $('#email-reader');
    if (!reader) return;

    reader.innerHTML = `
        <div class="email-read-header">
            <div class="email-read-subject">${escapeHtml(email.subject)}</div>
            <div class="email-read-meta">
                <div><span class="email-meta-label">From</span> <span class="email-meta-value">${escapeHtml(email.from)}</span></div>
                <div><span class="email-meta-label">Date</span> <span class="email-meta-value">${escapeHtml(email.date)}</span></div>
            </div>
        </div>
        <div class="email-read-actions">
            <button class="email-action-btn email-action-ai-reply" onclick="return false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                AI Reply
            </button>
            <button class="email-action-btn email-action-reply" onclick="return false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>
                Reply
            </button>
            <button class="email-action-btn email-action-delete" onclick="return false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                Delete
            </button>
        </div>
        <div class="email-read-body">${escapeHtml(email.body).replace(/\n/g, '<br>')}</div>
    `;

    reader.querySelectorAll('.email-action-btn').forEach(btn => {
        btn.addEventListener('click', () => showToast('This action is disabled in demo mode'));
    });
}

function _extractName(fromStr) {
    const match = fromStr.match(/^(.+?)\s*<[^>]+>$/);
    if (match) return match[1].replace(/^["']|["']$/g, '').trim();
    return fromStr.split('@')[0] || fromStr;
}
