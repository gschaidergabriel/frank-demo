/* ══════════════════════════════════════════════════════════════════
   Frank Response Database — Merged from 3 response modules
   ~1100 pre-made responses across 48 intents
   ══════════════════════════════════════════════════════════════════ */

import { INTENTS_A, RESPONSES_A } from './responses/a.js';
import { INTENTS_B, RESPONSES_B } from './responses/b.js';
import { INTENTS_C, RESPONSES_C, RELATED, EASTER_EGGS } from './responses/c.js';

export const FRANK_DB = {
    intents:   { ...INTENTS_A,   ...INTENTS_B,   ...INTENTS_C },
    responses: { ...RESPONSES_A, ...RESPONSES_B, ...RESPONSES_C },
    related:   RELATED,
    easterEggs: EASTER_EGGS
};
