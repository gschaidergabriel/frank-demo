const W = 128, H = 72;
let canvas, ctx, grid, next, imageData, running = false;

function init() {
    canvas = document.getElementById('gol-bg');
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');
    imageData = ctx.createImageData(W, H);
    grid = new Uint8Array(W * H);
    next = new Uint8Array(W * H);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() < 0.15 ? 1 : 0;
    }
    running = true;
    tick();
}

function tick() {
    if (!running) return;
    step();
    render();
    setTimeout(() => requestAnimationFrame(tick), 150);
}

function step() {
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            let n = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = (x + dx + W) % W;
                    const ny = (y + dy + H) % H;
                    n += grid[ny * W + nx];
                }
            }
            const i = y * W + x;
            next[i] = grid[i] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        }
    }
    [grid, next] = [next, grid];
    let alive = 0;
    for (let i = 0; i < grid.length; i++) alive += grid[i];
    if (alive < 50) {
        for (let i = 0; i < 200; i++) {
            grid[Math.floor(Math.random() * grid.length)] = 1;
        }
    }
}

function render() {
    const px = imageData.data;
    for (let i = 0; i < grid.length; i++) {
        const pi = i * 4;
        if (grid[i]) {
            px[pi] = 0; px[pi + 1] = 255; px[pi + 2] = 65; px[pi + 3] = 255;
        } else {
            px[pi] = 0; px[pi + 1] = 0; px[pi + 2] = 0; px[pi + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export function startGoLBackground() { init(); }
export function stopGoLBackground() { running = false; }
