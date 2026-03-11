const _listeners = new Map();
const _state = {
    connected: true,  // Always true in demo
    currentPage: 'home',
    services: {},
    metrics: {},
    auraData: null,
    notifications: [],
};

export function getState() { return _state; }

export function setState(key, value) {
    _state[key] = value;
    const fns = _listeners.get(key);
    if (fns) fns.forEach(fn => fn(value));
}

export function onStateChange(key, fn) {
    if (!_listeners.has(key)) _listeners.set(key, new Set());
    _listeners.get(key).add(fn);
    return () => _listeners.get(key).delete(fn);
}
