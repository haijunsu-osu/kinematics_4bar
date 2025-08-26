// Four-bar linkage interactive analysis
// Canvas and plotting logic

window.addEventListener('load', function() {
    const canvas = document.getElementById('linkage-canvas');
    const ctx = canvas.getContext('2d');
    const plotCanvas = document.getElementById('plot');
    const plotCtx = plotCanvas.getContext('2d');

    const inputA = document.getElementById('input_a');
    const inputB = document.getElementById('input_b');
    const inputC = document.getElementById('input_c');
    const inputD = document.getElementById('input_d');
    const inputE = document.getElementById('input_e');
    const inputAlpha = document.getElementById('input_alpha');
    const configOpen = document.getElementById('config_open');
    const configClosed = document.getElementById('config_closed');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const angleSlider = document.getElementById('angle-slider');
    const angleValue = document.getElementById('angle-value');

    let a = parseFloat(inputA.value);
    let e = parseFloat(inputE ? inputE.value : 60);
    let alpha = parseFloat(inputAlpha ? inputAlpha.value : 30);
    let b = parseFloat(inputB.value);
    let c = parseFloat(inputC.value);
    let d = parseFloat(inputD.value);
    let inputAngle = 0;
    let animationId = null;
    let isPlaying = false;

    const canvasSize = 600;
    const origin = { x: canvasSize / 2, y: canvasSize / 2 };
    const gridSpacing = 50;

    function drawGrid() {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.save();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvasSize; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasSize);
            ctx.stroke();
        }
        for (let y = 0; y < canvasSize; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasSize, y);
            ctx.stroke();
        }
        // Draw axes
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        // x-axis
        ctx.beginPath();
        ctx.moveTo(0, origin.y);
        ctx.lineTo(canvasSize, origin.y);
        ctx.stroke();
        // y-axis
        ctx.beginPath();
        ctx.moveTo(origin.x, 0);
        ctx.lineTo(origin.x, canvasSize);
        ctx.stroke();
        ctx.restore();
    }

    function toCanvasCoords(x, y) {
        // x to right, y to up, origin at center
        return {
            x: origin.x + x,
            y: origin.y - y
        };
    }

    function solveLinkage(a, b, c, d, theta1Deg, config = 'open') {
        // Returns {A, B, C, D, couplerAngle, outputAngle}
        // Ground points
        const A = { x: 0, y: 0 };
        const D = { x: d, y: 0 };
        // Input crank
        const theta1 = theta1Deg * Math.PI / 180;
        const B = { x: a * Math.cos(theta1), y: a * Math.sin(theta1) };
        // Find C by circle intersection
        // Circle 1: center B, radius b
        // Circle 2: center D, radius c
        const dx = D.x - B.x;
        const dy = D.y - B.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > b + c || dist < Math.abs(b - c)) {
            return null; // No solution
        }
        const ex = dx / dist;
        const ey = dy / dist;
        const x = (dist*dist + b*b - c*c) / (2*dist);
        const y = Math.sqrt(Math.max(0, b*b - x*x));
        // Two possible solutions
        let C;
        if (config === 'open') {
            // Elbow up
            C = {
                x: B.x + x*ex - y*ey,
                y: B.y + x*ey + y*ex
            };
        } else {
            // Elbow down
            C = {
                x: B.x + x*ex + y*ey,
                y: B.y + x*ey - y*ex
            };
        }
        // Coupler angle
        const couplerAngle = Math.atan2(C.y - B.y, C.x - B.x) * 180 / Math.PI;
        // Output angle
        const outputAngle = Math.atan2(C.y - D.y, C.x - D.x) * 180 / Math.PI;
        return { A, B, C, D, couplerAngle, outputAngle };
    }

    function drawLinkage(a, b, c, d, theta1Deg, e = 60, alpha = 30) {
        drawGrid();
        // Get configuration
        let config = configOpen && configOpen.checked ? 'open' : 'closed';
        // Draw trajectory of coupler point P
        let trajPoints = [];
        for (let theta = 0; theta <= 360; theta += 2) {
            let res = solveLinkage(a, b, c, d, theta, config);
            if (res) {
                let thetaBC = Math.atan2(res.C.y - res.B.y, res.C.x - res.B.x);
                let thetaP = thetaBC + alpha * Math.PI / 180;
                let Px = res.B.x + e * Math.cos(thetaP);
                let Py = res.B.y + e * Math.sin(thetaP);
                let pP = toCanvasCoords(Px, Py);
                trajPoints.push(pP);
            }
        }
        if (trajPoints.length > 1) {
            ctx.save();
            ctx.strokeStyle = '#FF851B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(trajPoints[0].x, trajPoints[0].y);
            for (let i = 1; i < trajPoints.length; i++) {
                ctx.lineTo(trajPoints[i].x, trajPoints[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }
        const result = solveLinkage(a, b, c, d, theta1Deg, config);
        if (!result) {
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.font = '20px Arial';
            ctx.fillText('No solution for these link lengths and angle.', 100, 50);
            ctx.restore();
            return;
        }
        const { A, B, C, D, couplerAngle, outputAngle } = result;
        // Draw links
        ctx.save();
        ctx.strokeStyle = '#0074D9';
        ctx.lineWidth = 4;
        // Ground (d)
        let pA = toCanvasCoords(A.x, A.y);
        let pD = toCanvasCoords(D.x, D.y);
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.stroke();
        // Input (a)
        ctx.strokeStyle = '#2ECC40';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        let pB = toCanvasCoords(B.x, B.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
        // Coupler (b)
        ctx.strokeStyle = '#FFDC00';
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y);
        let pC = toCanvasCoords(C.x, C.y);
        ctx.lineTo(pC.x, pC.y);
        ctx.stroke();
        // Output (c)
        ctx.strokeStyle = '#FF4136';
        ctx.beginPath();
        ctx.moveTo(pC.x, pC.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.stroke();
        // Draw joints
        ctx.fillStyle = '#111';
        [A, B, C, D].forEach(pt => {
            let p = toCanvasCoords(pt.x, pt.y);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, 2*Math.PI);
            ctx.fill();
        });
        // Label links
        ctx.font = '18px Arial';
        ctx.fillStyle = '#0074D9';
        ctx.fillText('d', (pA.x + pD.x)/2 - 20, (pA.y + pD.y)/2 + 25);
        ctx.fillStyle = '#2ECC40';
        ctx.fillText('a', (pA.x + pB.x)/2 - 20, (pA.y + pB.y)/2 - 10);
        ctx.fillStyle = '#FFDC00';
        ctx.fillText('b', (pB.x + pC.x)/2 + 10, (pB.y + pC.y)/2);
        ctx.fillStyle = '#FF4136';
        ctx.fillText('c', (pC.x + pD.x)/2 + 10, (pC.y + pD.y)/2);
        // Coupler point P
        // Vector from B: e at angle alpha from BC (CCW positive)
        let thetaBC = Math.atan2(C.y - B.y, C.x - B.x); // radians
        let thetaP = thetaBC + alpha * Math.PI / 180;
        let Px = B.x + e * Math.cos(thetaP);
        let Py = B.y + e * Math.sin(thetaP);
        let pP = toCanvasCoords(Px, Py);
        // Draw vector BP
        ctx.save();
        ctx.strokeStyle = '#FF851B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pB.x, pB.y);
        ctx.lineTo(pP.x, pP.y);
        ctx.stroke();
        // Draw point P
        ctx.fillStyle = '#FF851B';
        ctx.beginPath();
        ctx.arc(pP.x, pP.y, 7, 0, 2*Math.PI);
        ctx.fill();
        ctx.font = '18px Arial';
        ctx.fillText('P', pP.x + 10, pP.y - 10);
        ctx.restore();
        ctx.restore();
    }

    function plotAngles(a, b, c, d, currentInputAngle = null) {
        // Plot coupler and output angle vs input angle
        plotCtx.clearRect(0, 0, plotCanvas.width, plotCanvas.height);
        // Axes
        plotCtx.save();
        plotCtx.strokeStyle = '#888';
        plotCtx.lineWidth = 2;
        // x-axis
        plotCtx.beginPath();
        plotCtx.moveTo(40, plotCanvas.height-40);
        plotCtx.lineTo(plotCanvas.width-20, plotCanvas.height-40);
        plotCtx.stroke();
        // y-axis
        plotCtx.beginPath();
        plotCtx.moveTo(40, plotCanvas.height-40);
        plotCtx.lineTo(40, 20);
        plotCtx.stroke();
        // Labels
        plotCtx.fillStyle = '#111';
        plotCtx.font = '14px Arial';
        plotCtx.fillText('Input Angle (deg)', plotCanvas.width/2-50, plotCanvas.height-10);
        plotCtx.save();
        plotCtx.translate(10, plotCanvas.height/2+50);
        plotCtx.rotate(-Math.PI/2);
        plotCtx.fillText('Angle (deg)', 0, 0);
        plotCtx.restore();
        // Data
        let couplerAngles = [];
        let outputAngles = [];
        let inputAngles = [];
        let config = configOpen && configOpen.checked ? 'open' : 'closed';
        for (let theta = 0; theta <= 360; theta += 2) {
            let result = solveLinkage(a, b, c, d, theta, config);
            if (result) {
                couplerAngles.push(result.couplerAngle);
                outputAngles.push(result.outputAngle);
                inputAngles.push(theta);
            }
        }
        // Scale
        const x0 = 40, x1 = plotCanvas.width-20;
        const y0 = plotCanvas.height-40, y1 = 20;
        const xRange = x1 - x0;
        const yRange = y0 - y1;
        const minAngle = Math.min(...couplerAngles, ...outputAngles, 0);
        const maxAngle = Math.max(...couplerAngles, ...outputAngles, 360);
        // Coupler angle plot
        plotCtx.strokeStyle = '#FFDC00';
        plotCtx.lineWidth = 2;
        plotCtx.beginPath();
        for (let i = 0; i < inputAngles.length; i++) {
            let x = x0 + (inputAngles[i]/360)*xRange;
            let y = y0 - ((couplerAngles[i]-minAngle)/(maxAngle-minAngle))*yRange;
            if (i === 0) plotCtx.moveTo(x, y);
            else plotCtx.lineTo(x, y);
        }
        plotCtx.stroke();
        // Output angle plot
        plotCtx.strokeStyle = '#FF4136';
        plotCtx.beginPath();
        for (let i = 0; i < inputAngles.length; i++) {
            let x = x0 + (inputAngles[i]/360)*xRange;
            let y = y0 - ((outputAngles[i]-minAngle)/(maxAngle-minAngle))*yRange;
            if (i === 0) plotCtx.moveTo(x, y);
            else plotCtx.lineTo(x, y);
        }
        plotCtx.stroke();
        // Vertical line for current input angle
        let currentCoupler = null, currentOutput = null;
        if (currentInputAngle !== null) {
            let x = x0 + (currentInputAngle/360)*xRange;
            plotCtx.save();
            plotCtx.strokeStyle = '#0074D9';
            plotCtx.lineWidth = 2;
            plotCtx.setLineDash([6, 6]);
            plotCtx.beginPath();
            plotCtx.moveTo(x, y0);
            plotCtx.lineTo(x, y1);
            plotCtx.stroke();
            plotCtx.setLineDash([]);
            // Find current coupler and output angle
            let result = solveLinkage(a, b, c, d, currentInputAngle, config);
            if (result) {
                currentCoupler = result.couplerAngle;
                currentOutput = result.outputAngle;
                // Draw points on curves
                // Coupler
                let yCoupler = y0 - ((currentCoupler-minAngle)/(maxAngle-minAngle))*yRange;
                plotCtx.fillStyle = '#FFDC00';
                plotCtx.beginPath();
                plotCtx.arc(x, yCoupler, 6, 0, 2*Math.PI);
                plotCtx.fill();
                // Output
                let yOutput = y0 - ((currentOutput-minAngle)/(maxAngle-minAngle))*yRange;
                plotCtx.fillStyle = '#FF4136';
                plotCtx.beginPath();
                plotCtx.arc(x, yOutput, 6, 0, 2*Math.PI);
                plotCtx.fill();
            }
            plotCtx.restore();
        }
        // Legend
        plotCtx.fillStyle = '#FFDC00';
        plotCtx.fillRect(plotCanvas.width-120, 30, 15, 15);
        plotCtx.fillStyle = '#111';
        plotCtx.fillText('Coupler Angle', plotCanvas.width-100, 43);
        plotCtx.fillStyle = '#FF4136';
        plotCtx.fillRect(plotCanvas.width-120, 50, 15, 15);
        plotCtx.fillStyle = '#111';
        plotCtx.fillText('Output Angle', plotCanvas.width-100, 63);
        // Show current angles
        if (currentInputAngle !== null && currentCoupler !== null && currentOutput !== null) {
            plotCtx.fillStyle = '#0074D9';
            plotCtx.font = '16px Arial';
            plotCtx.fillText(`Input: ${currentInputAngle.toFixed(1)}°`, 50, 30);
            plotCtx.fillStyle = '#FFDC00';
            plotCtx.fillText(`Coupler: ${currentCoupler.toFixed(1)}°`, 50, 55);
            plotCtx.fillStyle = '#FF4136';
            plotCtx.fillText(`Output: ${currentOutput.toFixed(1)}°`, 50, 80);
        }
        plotCtx.restore();
    }

    function updateAll() {
        a = parseFloat(inputA.value);
        b = parseFloat(inputB.value);
        c = parseFloat(inputC.value);
        d = parseFloat(inputD.value);
        e = parseFloat(inputE.value);
        alpha = parseFloat(inputAlpha.value);
        inputAngle = parseFloat(angleSlider.value);
        angleValue.textContent = `${inputAngle}°`;
        drawLinkage(a, b, c, d, inputAngle, e, alpha);
        plotAngles(a, b, c, d, inputAngle);
    }

    inputA.addEventListener('input', updateAll);
    configOpen.addEventListener('change', updateAll);
    configClosed.addEventListener('change', updateAll);
    inputE.addEventListener('input', updateAll);
    inputAlpha.addEventListener('input', updateAll);
    inputB.addEventListener('input', updateAll);
    inputC.addEventListener('input', updateAll);
    inputD.addEventListener('input', updateAll);
    angleSlider.addEventListener('input', updateAll);

    playBtn.addEventListener('click', () => {
        if (isPlaying) return;
        isPlaying = true;
        function animate() {
            if (!isPlaying) return;
            let val = parseFloat(angleSlider.value);
            val = (val + 1) % 361;
            angleSlider.value = val;
            updateAll();
            animationId = requestAnimationFrame(animate);
        }
        animate();
    });

    pauseBtn.addEventListener('click', () => {
        isPlaying = false;
        if (animationId) cancelAnimationFrame(animationId);
    });

    updateAll();
});
