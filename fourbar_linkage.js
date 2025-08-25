// fourbar_linkage.js
// Interactive 4-bar linkage kinematics and animation

function deg2rad(deg) { return deg * Math.PI / 180; }
function rad2deg(rad) { return rad * 180 / Math.PI; }

function solveKinematics(r1, r2, r3, r4, th1, th2, beta) {
    // Analytical solution for th4 and th3
    let A = 2 * r1 * r4 * Math.cos(th1) - 2 * r2 * r4 * Math.cos(th2);
    let B = 2 * r1 * r4 * Math.sin(th1) - 2 * r2 * r4 * Math.sin(th2);
    let C = r1**2 + r2**2 + r4**2 - r3**2 - 2 * r1 * r2 * Math.cos(th1 - th2);
    let D = B**2 - C**2 + A**2;
    let th4 = 2 * Math.atan((-B + Math.sqrt(D)) / (C - A));
    let th3 = Math.atan2(
        r1 * Math.sin(th1) + r4 * Math.sin(th4) - r2 * Math.sin(th2),
        r1 * Math.cos(th1) + r4 * Math.cos(th4) - r2 * Math.cos(th2)
    );
    return { th3, th4 };
}

function drawLinkage(ctx, r1, r2, r3, r4, th1, th2, th3, th4, beta) {
    ctx.clearRect(0, 0, 400, 400);
    ctx.save();
    ctx.translate(200, 200); // Center canvas
    let OA = { x: 0, y: 0 };
    let A = { x: r2 * Math.cos(th2), y: r2 * Math.sin(th2) };
    let B = { x: A.x + r3 * Math.cos(th3), y: A.y + r3 * Math.sin(th3) };
    let E = { x: A.x + (2 / Math.cos(beta)) * Math.cos(th3 + beta), y: A.y + (2 / Math.cos(beta)) * Math.sin(th3 + beta) };
    let OB = { x: 1, y: 0 };
    // Draw links
    ctx.beginPath();
    ctx.moveTo(OA.x, OA.y);
    ctx.lineTo(A.x, A.y);
    ctx.lineTo(E.x, E.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(OB.x, OB.y);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Draw points
    [OA, A, E, B, OB].forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#0074D9';
        ctx.fill();
    });
    ctx.restore();
}

function animateLinkage() {
    let r1 = parseFloat(document.getElementById('r1').value);
    let r2 = parseFloat(document.getElementById('r2').value);
    let r3 = parseFloat(document.getElementById('r3').value);
    let r4 = parseFloat(document.getElementById('r4').value);
    let beta = parseFloat(document.getElementById('beta').value);
    let th1 = 0;
    let ctx = document.getElementById('canvas-panel').getContext('2d');
    let plotCtx = document.getElementById('plot-canvas').getContext('2d');
    let th2_start = 0;
    let th2_end = 360;
    let th2_step = 5;
    let trajectory = [];
    let th2_vals = [];
    let th3_vals = [];
    let th4_vals = [];
    let frame = 0;
    function step() {
        let th2 = deg2rad(th2_start + frame * th2_step);
        if (th2 > deg2rad(th2_end)) return;
        let { th3, th4 } = solveKinematics(r1, r2, r3, r4, th1, th2, beta);
        th2_vals.push(rad2deg(th2));
        th3_vals.push(rad2deg(th3));
        th4_vals.push(rad2deg(th4));
        let A = { x: r2 * Math.cos(th2), y: r2 * Math.sin(th2) };
        let E = { x: A.x + (2 / Math.cos(beta)) * Math.cos(th3 + beta), y: A.y + (2 / Math.cos(beta)) * Math.sin(th3 + beta) };
        trajectory.push(E);
        drawLinkage(ctx, r1, r2, r3, r4, th1, th2, th3, th4, beta);
        // Draw trajectory
        ctx.save();
        ctx.translate(200, 200);
        ctx.beginPath();
        trajectory.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        // Plot th3 and th4
        plotCtx.clearRect(0, 0, 400, 400);
        plotCtx.beginPath();
        th2_vals.forEach((t, i) => {
            let x = t * 400 / 360;
            let y = 200 - th3_vals[i] * 2;
            if (i === 0) plotCtx.moveTo(x, y);
            else plotCtx.lineTo(x, y);
        });
        plotCtx.strokeStyle = '#0074D9';
        plotCtx.lineWidth = 2;
        plotCtx.stroke();
        plotCtx.beginPath();
        th2_vals.forEach((t, i) => {
            let x = t * 400 / 360;
            let y = 200 - th4_vals[i] * 2;
            if (i === 0) plotCtx.moveTo(x, y);
            else plotCtx.lineTo(x, y);
        });
        plotCtx.strokeStyle = '#FF4136';
        plotCtx.lineWidth = 2;
        plotCtx.stroke();
        frame++;
        requestAnimationFrame(step);
    }
    step();
}

// Initial draw
window.onload = function() {
    animateLinkage();
};