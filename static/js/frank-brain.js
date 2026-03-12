/* ══════════════════════════════════════════════════════════════════
   FrankBrain — Single-layer perceptron intent classifier
   Bag-of-words → weight matrix → context modulation → softmax
   Memory-safe: bounded history, no growing allocations
   ══════════════════════════════════════════════════════════════════ */

const STOP = new Set([
    'i','me','my','myself','we','our','you','your','yourself',
    'he','she','it','they','them','their',
    'a','an','the','this','that','these','those',
    'is','am','are','was','were','be','been','being',
    'have','has','had','do','does','did','done',
    'will','would','could','should','may','might','shall','must',
    'not','no','nor','but','or','and','so','if','then','else',
    'to','of','in','for','on','with','at','by','from','as',
    'into','about','up','out','off','over','under','between',
    'just','very','really','quite','too','also','well','only',
    'there','here','all','each','every','any','some',
    'much','many','more','most','even','still','already',
    'got','go','going','gone','come','came','took','made',
    'said','told','been','let','put','give','gave',
    'one','two','first','last','next',
    'thing','things','something','anything','nothing','everything',
    'ok','okay','yes','yeah','yep','nah','nope',
    'sorry','excuse',
    'than','its','own','same','other','another',
    'way','back','now','again','around','through',
    'oh','ah','um','uh','hm','hmm',
    'gonna','wanna','gotta','kinda','sorta',
    'im','dont','doesnt','didnt','wont','shouldnt','wouldnt','couldnt',
    'ive','youve','theyve','weve','youre','theyre','hes','shes',
    'thats','hows','whos','wheres','whens','whats','cant','can'
]);

function stem(w) {
    if (w.length < 4) return w;
    if (w.endsWith('ational')) return w.slice(0, -5);
    if (w.endsWith('ation')) return w.slice(0, -5);
    if (w.endsWith('ously')) return w.slice(0, -5);
    if (w.endsWith('ment')) return w.slice(0, -4);
    if (w.endsWith('ness')) return w.slice(0, -4);
    if (w.endsWith('ting') && w.length > 5) return w.slice(0, -3) + 'e';
    if (w.endsWith('ning') && w.length > 6) return w.slice(0, -4);
    if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
    if (w.endsWith('ful')) return w.slice(0, -3);
    if (w.endsWith('less')) return w.slice(0, -4);
    if (w.endsWith('ous')) return w.slice(0, -3);
    if (w.endsWith('ive')) return w.slice(0, -3);
    if (w.endsWith('able')) return w.slice(0, -4);
    if (w.endsWith('ible')) return w.slice(0, -4);
    if (w.endsWith('ally')) return w.slice(0, -4);
    if (w.endsWith('ily')) return w.slice(0, -3) + 'y';
    if (w.endsWith('ly') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('ity') && w.length > 5) return w.slice(0, -3);
    if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.endsWith('tion')) return w.slice(0, -4);
    if (w.endsWith('sion')) return w.slice(0, -4);
    if (w.endsWith('ated')) return w.slice(0, -2);
    if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('er') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('est') && w.length > 5) return w.slice(0, -3);
    if (w.endsWith('al') && w.length > 4) return w.slice(0, -2);
    if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us') && w.length > 3) return w.slice(0, -1);
    return w;
}

function tokenize(text) {
    return text.toLowerCase()
        .replace(/['']/g, "'")
        .replace(/[^a-z0-9'\s-]/g, ' ')
        .split(/\s+/)
        .map(w => w.replace(/^['-]+|['-]+$/g, ''))
        .filter(w => w.length > 1 && !STOP.has(w));
}

export class FrankBrain {
    constructor(db) {
        this.db = db;
        this.intentNames = Object.keys(db.intents);
        this.numIntents = this.intentNames.length;

        // Build vocabulary → index map
        this.vocab = new Map();
        let idx = 0;

        // Weight matrix (sparse): vocab_word → [{intent_idx, weight}]
        this.W = new Map();

        for (let i = 0; i < this.numIntents; i++) {
            const intent = this.intentNames[i];
            const data = db.intents[intent];
            const kws = data.keywords || [];
            for (const kw of kws) {
                const raw = kw.toLowerCase();
                const stemmed = stem(raw);
                for (const w of [raw, stemmed]) {
                    if (!this.vocab.has(w)) this.vocab.set(w, idx++);
                    if (!this.W.has(w)) this.W.set(w, []);
                    const arr = this.W.get(w);
                    // Avoid duplicate intent entries
                    if (!arr.some(e => e.i === i)) {
                        arr.push({ i, w: data.weight || 1.0 });
                    }
                }
            }
        }

        // Pre-compile patterns/phrases per intent
        this._patterns = {};
        this._phrases = {};
        for (let i = 0; i < this.numIntents; i++) {
            const name = this.intentNames[i];
            const data = db.intents[name];
            this._patterns[i] = data.patterns || [];
            this._phrases[i] = (data.phrases || []).map(p => p.toLowerCase());
        }

        // Conversation state (bounded)
        this.history = [];       // last 6 intent indices
        this.used = new Map();   // intent_idx → Set of used response indices
        this.msgCount = 0;
        this.lastCTA = -999;
        this.sessionStart = Date.now();
    }

    respond(input) {
        this.msgCount++;
        const raw = input.toLowerCase().trim();
        const tokens = tokenize(input);
        const stemmed = tokens.map(stem);
        const allTokens = new Set([...tokens, ...stemmed]);

        // 1. Easter egg check (exact triggers)
        for (const egg of (this.db.easterEggs || [])) {
            if (typeof egg.trigger === 'string') {
                if (raw.includes(egg.trigger)) return this._format(egg.response);
            } else if (egg.trigger.test(raw)) {
                return this._format(egg.response);
            }
        }

        // 2. Empty/very short input
        if (tokens.length === 0) return this._pick('short');

        // 3. Forward pass: bag-of-words → weight matrix multiplication
        const scores = new Float32Array(this.numIntents);

        // 3a. Keyword weights (sparse matmul)
        const hitCounts = new Uint8Array(this.numIntents);
        for (const token of allTokens) {
            const connections = this.W.get(token);
            if (!connections) continue;
            for (const { i, w } of connections) {
                scores[i] += w;
                hitCounts[i]++;
            }
        }

        // 3b. Multi-hit bonus (non-linear activation)
        for (let i = 0; i < this.numIntents; i++) {
            if (hitCounts[i] >= 2) scores[i] *= 1 + hitCounts[i] * 0.25;
            if (hitCounts[i] >= 4) scores[i] *= 1.3;
        }

        // 3c. Pattern matching (bias term)
        for (let i = 0; i < this.numIntents; i++) {
            for (const p of this._patterns[i]) {
                if (p.test(raw)) scores[i] += 3.5;
            }
            for (const ph of this._phrases[i]) {
                if (raw.includes(ph)) scores[i] += 4.0;
            }
        }

        // 3d. Context modulation (recurrent connection)
        if (this.history.length > 0) {
            const lastIdx = this.history[this.history.length - 1];
            const lastName = this.intentNames[lastIdx];
            const related = this.db.related[lastName] || [];
            for (const r of related) {
                const ri = this.intentNames.indexOf(r);
                if (ri >= 0 && scores[ri] > 0) scores[ri] *= 1.3;
            }
            // Slight penalty for exact repeat (encourage variety)
            if (scores[lastIdx] > 0) scores[lastIdx] *= 0.7;
        }

        // 4. Argmax (winner-take-all output layer)
        let bestIdx = -1, bestScore = 0.4;
        for (let i = 0; i < this.numIntents; i++) {
            if (scores[i] > bestScore) {
                bestScore = scores[i];
                bestIdx = i;
            }
        }

        // 5. CTA injection (progressive download nudge)
        const ctaReady = this.msgCount >= 4
            && this.msgCount - this.lastCTA >= 6
            && Math.random() < Math.min(0.3, 0.08 + this.msgCount * 0.003);
        if (ctaReady && this.db.responses.cta) {
            this.lastCTA = this.msgCount;
            return this._pickCTA();
        }

        // 6. Fallback
        const intentName = bestIdx >= 0 ? this.intentNames[bestIdx] : 'confused';

        // 7. Pick response and update history
        const resp = this._pick(intentName);
        if (bestIdx >= 0) {
            this.history.push(bestIdx);
            if (this.history.length > 6) this.history.shift();
        }

        return resp;
    }

    _pick(intentName) {
        const pool = this.db.responses[intentName] || this.db.responses.confused;
        if (!pool || pool.length === 0) return "...";

        const intentIdx = this.intentNames.indexOf(intentName);
        const key = intentIdx >= 0 ? intentIdx : intentName;

        if (!this.used.has(key)) this.used.set(key, new Set());
        const usedSet = this.used.get(key);

        // Find available (not yet used) responses
        let avail = [];
        for (let i = 0; i < pool.length; i++) {
            if (!usedSet.has(i)) avail.push(i);
        }
        // Reset if all used
        if (avail.length === 0) {
            usedSet.clear();
            avail = pool.map((_, i) => i);
        }

        const idx = avail[Math.floor(Math.random() * avail.length)];
        usedSet.add(idx);

        // Memory cleanup: cap used-set size
        if (usedSet.size > pool.length) usedSet.clear();

        return this._format(pool[idx]);
    }

    _pickCTA() {
        const ctas = this.db.responses.cta;
        if (!ctas || ctas.length === 0) return this._pick('confused');

        // 5 progressive phases
        const phase = Math.min(4, Math.floor(this.msgCount / 12));
        const chunk = Math.ceil(ctas.length / 5);
        const start = phase * chunk;
        const end = Math.min(start + chunk, ctas.length);
        const pool = ctas.slice(start, end);
        const arr = pool.length > 0 ? pool : ctas;
        return this._format(arr[Math.floor(Math.random() * arr.length)]);
    }

    _format(text) {
        // Replace dynamic tokens
        return text
            .replace(/\{msgCount\}/g, String(this.msgCount))
            .replace(/\{uptime\}/g, this._uptime());
    }

    _uptime() {
        const s = Math.floor((Date.now() - this.sessionStart) / 1000);
        if (s < 60) return `${s}s`;
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
    }
}
