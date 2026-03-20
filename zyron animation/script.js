// === ZYRON AI Interface Animation ===

const canvas = document.getElementById('zyronCanvas');
const ctx = canvas.getContext('2d');

let width, height, centerX, centerY, orbRadius;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    orbRadius = Math.min(width, height) * 0.22;
}

resize();
window.addEventListener('resize', resize);

// === Colors (matching advanced portfolio theme) ===
const COLORS = {
    primary: '#4a9eff',       // neon cyan
    secondary: '#f0a500',     // gold accent
    glow: '#4a9eff',
};

// RGB values for inline use
const PRIMARY_R = 74, PRIMARY_G = 158, PRIMARY_B = 255;   // #4a9eff
const GOLD_R = 240, GOLD_G = 165, GOLD_B = 0;             // #f0a500

// === Time tracking ===
let time = 0;
const startTime = performance.now();

// === Scatter / Explode Config ===
const SCATTER_START = 8;     // seconds before scatter begins
const SCATTER_DURATION = 3;  // seconds for scatter to complete

// === Get scatter progress (0 = not started, 1 = fully scattered) ===
function getScatterProgress() {
    const elapsed = (performance.now() - startTime) / 1000;
    if (elapsed < SCATTER_START) return 0;
    return Math.min((elapsed - SCATTER_START) / SCATTER_DURATION, 1);
}

// === Orb Particles (form a sphere shape) ===
const orbParticles = [];
const ORB_PARTICLE_COUNT = 1200;

for (let i = 0; i < ORB_PARTICLE_COUNT; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / ORB_PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterSpeed = 1.5 + Math.random() * 4;

    orbParticles.push({
        phi: phi,
        theta: theta,
        offsetX: (Math.random() - 0.5) * 3,
        offsetY: (Math.random() - 0.5) * 3,
        offsetZ: (Math.random() - 0.5) * 3,
        size: 0.3 + Math.random() * 0.7,
        baseOpacity: 0.3 + Math.random() * 0.7,
        pulseOffset: Math.random() * Math.PI * 2,
        connectTo: Math.random() < 0.15 ? Math.floor(Math.random() * ORB_PARTICLE_COUNT) : -1,
        isGold: false,
        scatterVX: Math.cos(scatterAngle) * scatterSpeed,
        scatterVY: Math.sin(scatterAngle) * scatterSpeed,
        scatterDelay: Math.random() * 0.5,
    });
}

// === Background ambient particles ===
const ambientParticles = [];
const AMBIENT_COUNT = 120;

for (let i = 0; i < AMBIENT_COUNT; i++) {
    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterSpeed = 1 + Math.random() * 3;

    ambientParticles.push({
        x: Math.random() * 2000 - 500,
        y: Math.random() * 2000 - 500,
        speed: 0.1 + Math.random() * 0.4,
        angle: Math.random() * Math.PI * 2,
        size: 0.3 + Math.random() * 0.8,
        opacity: 0.1 + Math.random() * 0.4,
        drift: Math.random() * 0.5 - 0.25,
        isGold: false,
        scatterVX: Math.cos(scatterAngle) * scatterSpeed,
        scatterVY: Math.sin(scatterAngle) * scatterSpeed,
        scatterDelay: Math.random() * 0.5,
    });
}

// === Breathing function (shrink & expand) ===
function getBreathScale(t) {
    return 1 + 0.15 * Math.sin(t * 0.8);
}

// === Draw Particle Orb ===
function drawOrb(t) {
    const elapsed = (performance.now() - startTime) / 1000;
    const fadeIn = Math.min(elapsed / 2, 1);
    const scatter = getScatterProgress();
    const scatterFade = 1 - scatter;
    const breathScale = getBreathScale(t);
    const currentRadius = orbRadius * breathScale;
    const rotationY = t * 0.25;
    const rotationX = t * 0.15;

    // Glow behind the orb
    if (scatterFade > 0.01) {
        const glowRadius = currentRadius * 2.5;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
        gradient.addColorStop(0, `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.2 * fadeIn * scatterFade})`);
        gradient.addColorStop(0.3, `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.1 * fadeIn * scatterFade})`);
        gradient.addColorStop(0.6, `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.03 * fadeIn * scatterFade})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Project and draw each particle
    const projected = [];

    orbParticles.forEach((p, idx) => {
        let x = Math.sin(p.phi) * Math.cos(p.theta) * currentRadius + p.offsetX;
        let y = Math.cos(p.phi) * currentRadius + p.offsetY;
        let z = Math.sin(p.phi) * Math.sin(p.theta) * currentRadius + p.offsetZ;

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const x2 = x * cosY - z * sinY;
        const z2 = x * sinY + z * cosY;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = y * cosX - z2 * sinX;
        const z3 = y * sinX + z2 * cosX;

        const depthFactor = (z3 + currentRadius) / (currentRadius * 2);
        const pulse = 0.6 + 0.4 * Math.sin(t * 2 + p.pulseOffset);

        let px = centerX + x2;
        let py = centerY + y2;
        let particleAlpha;

        if (scatter > 0) {
            const ps = Math.max(0, (scatter - p.scatterDelay) / (1 - p.scatterDelay));
            const eased = ps * ps;
            const dist = eased * Math.max(width, height) * 0.8;
            px += p.scatterVX * dist;
            py += p.scatterVY * dist;
            particleAlpha = p.baseOpacity * fadeIn * depthFactor * pulse * (1 - ps);
        } else {
            particleAlpha = p.baseOpacity * fadeIn * depthFactor * pulse;
        }

        if (particleAlpha < 0.005) return;

        const sz = p.size * (0.5 + depthFactor * 0.8);
        projected.push({ px, py, alpha: particleAlpha, sz, depthFactor, idx });

        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${particleAlpha})`;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 6 * depthFactor;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Connection lines (fade early during scatter)
    if (scatter < 0.5) {
        const lineFade = scatter < 0.3 ? 1 : 1 - (scatter - 0.3) / 0.2;
        ctx.lineWidth = 0.4;
        orbParticles.forEach((p, i) => {
            if (p.connectTo >= 0 && p.connectTo < projected.length) {
                const a = projected[i];
                const b = projected[p.connectTo];
                if (a && b) {
                    const dist = Math.hypot(a.px - b.px, a.py - b.py);
                    if (dist < currentRadius * 0.8) {
                        const lineAlpha = Math.min(a.alpha, b.alpha) * 0.4 * lineFade;
                        ctx.beginPath();
                        ctx.moveTo(a.px, a.py);
                        ctx.lineTo(b.px, b.py);
                        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${lineAlpha})`;
                        ctx.stroke();
                    }
                }
            }
        });
    }

    // Inner core glow
    if (scatterFade > 0.01) {
        const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, currentRadius * 0.5);
        coreGrad.addColorStop(0, `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.15 * fadeIn * scatterFade})`);
        coreGrad.addColorStop(1, `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// === Glowing Energy Ring ===
const RING_PARTICLE_COUNT = 600;
const ringParticles = [];

for (let i = 0; i < RING_PARTICLE_COUNT; i++) {
    const scatterAngle = Math.random() * Math.PI * 2;
    const scatterSpeed = 2 + Math.random() * 5;

    ringParticles.push({
        angle: (i / RING_PARTICLE_COUNT) * Math.PI * 2,
        size: 0.2 + Math.random() * 0.8,
        radiusOffset: (Math.random() - 0.5) * 8,
        speed: 0.0003 + Math.random() * 0.001,
        opacity: 0.2 + Math.random() * 0.8,
        pulseSpeed: 1 + Math.random() * 3,
        pulseOffset: Math.random() * Math.PI * 2,
        scatterVX: Math.cos(scatterAngle) * scatterSpeed,
        scatterVY: Math.sin(scatterAngle) * scatterSpeed,
        scatterDelay: Math.random() * 0.4,
    });
}

function drawEnergyRing(t) {
    const elapsed = (performance.now() - startTime) / 1000;
    const fadeIn = Math.min(Math.max((elapsed - 0.8) / 2, 0), 1);
    const scatter = getScatterProgress();

    if (scatter >= 1) return;

    const scatterFade = 1 - scatter;
    const breathScale = getBreathScale(t);
    const ringRadius = orbRadius * 1.6 * breathScale;

    if (scatterFade > 0.05) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.08 * fadeIn * scatterFade})`;
        ctx.lineWidth = 25;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 40 * fadeIn * scatterFade;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.3 * fadeIn * scatterFade})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 15 * fadeIn * scatterFade;
        ctx.stroke();
        ctx.restore();

        const sweepAngle = t * 0.5;
        const sweepLength = Math.PI * 0.6;
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, sweepAngle, sweepAngle + sweepLength);
        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.6 * fadeIn * scatterFade})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 30 * fadeIn * scatterFade;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, sweepAngle + Math.PI, sweepAngle + Math.PI + sweepLength * 0.4);
        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.25 * fadeIn * scatterFade})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 20 * fadeIn * scatterFade;
        ctx.stroke();
        ctx.restore();

        const rippleRadius = ringRadius - 6;
        const ripplePhase = t * 2;
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
            const a = (i / 200) * Math.PI * 2;
            const wave = Math.sin(a * 12 + ripplePhase) * 2.5 * fadeIn;
            const rx = centerX + Math.cos(a) * (rippleRadius + wave);
            const ry = centerY + Math.sin(a) * (rippleRadius + wave);
            if (i === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${0.15 * fadeIn * scatterFade})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
    }

    const sweepAngle = t * 0.5;
    const sweepLength = Math.PI * 0.6;

    ringParticles.forEach(p => {
        p.angle += p.speed;
        const a = p.angle + t * 0.15;
        const r = ringRadius + p.radiusOffset;
        let px = centerX + Math.cos(a) * r;
        let py = centerY + Math.sin(a) * r;

        const pulse = 0.3 + 0.7 * Math.sin(t * p.pulseSpeed + p.pulseOffset);
        let alpha = p.opacity * fadeIn * pulse;

        if (scatter > 0) {
            const ps = Math.max(0, (scatter - p.scatterDelay) / (1 - p.scatterDelay));
            const eased = ps * ps;
            const dist = eased * Math.max(width, height) * 0.8;
            px += p.scatterVX * dist;
            py += p.scatterVY * dist;
            alpha *= (1 - ps);
        }

        if (alpha < 0.005) return;

        const angleDiff = Math.abs(((a - sweepAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2));
        const sweepBoost = angleDiff < sweepLength ? 1.5 : 1;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.5 + pulse * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${Math.min(alpha * sweepBoost, 1)})`;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

// === Ambient Particles ===
function drawAmbientParticles(t) {
    const elapsed = (performance.now() - startTime) / 1000;
    const fadeIn = Math.min(Math.max((elapsed - 1) / 2, 0), 1);
    const scatter = getScatterProgress();

    ambientParticles.forEach(p => {
        p.angle += p.speed * 0.005;
        let x = centerX + Math.cos(p.angle) * (orbRadius * 2.5 + p.x * 0.3);
        let y = centerY + Math.sin(p.angle) * (orbRadius * 2 + p.y * 0.3);

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + p.angle * 3);
        let alpha = p.opacity * fadeIn * (0.3 + 0.7 * pulse);

        if (scatter > 0) {
            const ps = Math.max(0, (scatter - p.scatterDelay) / (1 - p.scatterDelay));
            const eased = ps * ps;
            const dist = eased * Math.max(width, height) * 0.6;
            x += p.scatterVX * dist;
            y += p.scatterVY * dist;
            alpha *= (1 - ps);
        }

        if (alpha < 0.005) return;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PRIMARY_R}, ${PRIMARY_G}, ${PRIMARY_B}, ${alpha})`;
        ctx.shadowColor = COLORS.primary;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

// === Scan Lines (subtle CRT effect) ===
function drawScanLines() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
    }
}

// === Background ===
function drawBackground() {
    const bg = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.7);
    bg.addColorStop(0, '#0a1020');
    bg.addColorStop(0.5, '#060b18');
    bg.addColorStop(1, '#030710');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
}

// === Text reveal + scatter fade ===
let textRevealed = false;
let textHidden = false;

function checkTextReveal() {
    const elapsed = (performance.now() - startTime) / 1000;
    const scatter = getScatterProgress();

    if (!textRevealed && elapsed > 5) {
        textRevealed = true;
        document.getElementById('zyronText').classList.add('revealed');
    }

    // Fade out text during scatter
    if (!textHidden && scatter > 0) {
        const overlay = document.querySelector('.overlay');
        overlay.style.transition = 'opacity 1.5s ease-out';
        overlay.style.opacity = Math.max(0, 1 - scatter * 2);

        if (scatter >= 0.5) {
            textHidden = true;
            overlay.style.opacity = '0';
        }
    }
}

// === Animation Loop ===
let animationDone = false;

function animate() {
    time += 0.016;

    const scatter = getScatterProgress();

    // Stop after everything has vanished
    if (scatter >= 1) {
        if (!animationDone) {
            animationDone = true;
            ctx.clearRect(0, 0, width, height);
            drawBackground();
        }
        return;
    }

    ctx.clearRect(0, 0, width, height);

    drawBackground();
    drawAmbientParticles(time);
    drawEnergyRing(time);
    drawOrb(time);
    drawScanLines();
    checkTextReveal();

    requestAnimationFrame(animate);
}

animate();
