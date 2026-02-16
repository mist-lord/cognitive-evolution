/**
 * Nono Banana Dynamic Card Engine
 * Simulates AI-generation by procedurally compositing 3D assets with "Visual DNA"
 * derived from cognitive scores.
 */

const CardGenerator = {
    // Config
    width: 800,
    height: 480,
    assets: {},

    // Preload assets to ensure smooth generation
    async preloadAssets() {
        const promises = nonoLevels.map(level => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = level.img;
                img.onload = () => {
                    this.assets[level.img] = img;
                    resolve();
                };
                img.onerror = resolve; // Continue even if one fails
            });
        });
        // Optional: Preload overlay textures (e.g. matrix grid)
        // For now we will draw them procedurally
        return Promise.all(promises);
    },

    // Calculate "Visual DNA" parameters from scores
    calculateDNA(result) {
        const scores = result.scores; // [Facts, Structure, Model, Counter, Self]

        // Normalizing scores (assuming max score per dim is roughly 5-10 range, 
        // but looking at app.js, max score per question is 3, 12 questions... 
        // wait, max score per dimension varies. Let's assume range 0-15 roughly).
        // result.total is sum. 
        // Let's use relative strength.

        return {
            hueShift: scores[0] * 5, // Facts -> Color Temp (Hue)
            contrast: 100 + (scores[1] * 5), // Structure -> Contrast
            matrixOpacity: Math.min(0.8, scores[2] / 15), // Model -> Grid Overlay
            glitchIntensity: Math.min(1.0, scores[3] / 10), // Counter -> Glitch
            glowRadius: scores[4] * 3, // Self -> Glow
            seed: result.id || Date.now().toString()
        };
    },

    // Main generation function
    async generate(result, ctx) {
        const dna = this.calculateDNA(result);
        const nonoIndex = result.primary.index;
        const baseObj = nonoLevels[nonoIndex];

        // 1. Background
        const gradient = ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, "#0f1217");
        gradient.addColorStop(1, "#1a2232");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // 2. Draw Base Image with Filters
        const img = this.assets[baseObj.img];

        const imgX = 580;
        const imgY = 100;
        const imgW = 180;
        const imgH = 250;

        if (img) {
            ctx.save();

            // Apply DNA Filters
            let filterString = `contrast(${dna.contrast}%) hue-rotate(${dna.hueShift}deg)`;
            if (dna.glowRadius > 0) {
                filterString += ` drop-shadow(0 0 ${dna.glowRadius}px ${baseObj.color})`;
            }
            ctx.filter = filterString;

            // Glitch Effect (Draw multiple times with offset if glitch > 0)
            if (dna.glitchIntensity > 0.2) {
                // Red Channel Shift
                ctx.globalAlpha = 0.7;
                ctx.drawImage(img, imgX - (dna.glitchIntensity * 10), imgY, imgW, imgH);
                // Blue Channel Shift
                ctx.globalAlpha = 0.7;
                ctx.drawImage(img, imgX + (dna.glitchIntensity * 10), imgY, imgW, imgH);
                ctx.globalAlpha = 1.0;
            }

            // Main Image
            // Rounded Card Shape
            this.roundRect(ctx, imgX, imgY, imgW, imgH, 12);
            ctx.clip(); // Clip to rounded rect

            ctx.drawImage(img, imgX, imgY, imgW, imgH);

            ctx.restore(); // Remove clip and filters

            // 3. Overlays (Post-Process)
            ctx.save();
            this.roundRect(ctx, imgX, imgY, imgW, imgH, 12);
            ctx.clip();

            // Matrix Overlay
            if (dna.matrixOpacity > 0.1) {
                this.drawMatrixOverlay(ctx, imgX, imgY, imgW, imgH, baseObj.color, dna.matrixOpacity);
            }

            // Scanlines (High Structure)
            if (dna.contrast > 130) {
                this.drawScanlines(ctx, imgX, imgY, imgW, imgH);
            }

            ctx.restore();

            // 4. Border (Card Frame)
            ctx.strokeStyle = baseObj.color;
            ctx.lineWidth = 2; // + Math.random(); // Dynamic border?
            ctx.strokeRect(imgX, imgY, imgW, imgH);
        }

        // 5. Text & UI Elements
        this.drawUI(ctx, result, baseObj, dna);

        return ctx;
    },

    roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    },

    drawMatrixOverlay(ctx, x, y, w, h, color, opacity) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        // Simple binary rain effect simulation
        for (let i = x; i < x + w; i += 15) {
            if (Math.random() > 0.5) {
                ctx.fillRect(i, y, 1, h); // Vertical lines
                // Random blips
                if (Math.random() > 0.8) {
                    ctx.font = "10px monospace";
                    ctx.fillText(Math.random() > 0.5 ? "1" : "0", i, y + Math.random() * h);
                }
            }
        }
        ctx.restore();
    },

    drawScanlines(ctx, x, y, w, h) {
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        for (let i = y; i < y + h; i += 4) {
            ctx.fillRect(x, i, w, 1);
        }
        ctx.restore();
    },

    drawUI(ctx, result, baseObj, dna) {
        // Left Side Stats (Same as logic in app.js basically, but encapsulated)
        ctx.fillStyle = "#6aa1ff";
        ctx.font = "700 24px 'Noto Serif SC', 'Source Han Serif SC', serif";
        ctx.fillText("认知五层测评结果", 32, 48);

        const profile = resultProfiles[result.primary.index];

        ctx.fillStyle = "#e8edf7";
        ctx.font = "16px 'Manrope', 'Noto Sans SC', sans-serif";
        ctx.fillText(`主层级：${layerNames[result.primary.index]}`, 32, 82);
        ctx.fillText(`一致性：${result.consistency}%`, 32, 108);
        ctx.fillText(`标签：${profile.label}`, 32, 134);

        // Draw Bars
        const barX = 32;
        const barY = 180;
        const barHeight = 16;
        const barGap = 28;
        const barWidth = 460;

        result.scores.forEach((score, index) => {
            const percent = Math.round((score / result.total) * 100);
            const y = barY + index * barGap;
            ctx.fillStyle = "#a9b4c9";
            ctx.fillText(layerNames[index], barX, y + 12);
            ctx.fillStyle = "#1a2232";
            ctx.fillRect(barX + 80, y, barWidth, barHeight);

            const barGrad = ctx.createLinearGradient(barX + 80, y, barX + 80 + barWidth, y);
            barGrad.addColorStop(0, "#61d3c4");
            barGrad.addColorStop(1, "#6aa1ff");
            ctx.fillStyle = barGrad;
            ctx.fillRect(barX + 80, y, (barWidth * percent) / 100, barHeight);

            ctx.fillStyle = "#a9b4c9";
            ctx.fillText(`${percent}%`, barX + 80 + barWidth + 12, y + 12);
        });

        // Nono Name
        const imgX = 580;
        const imgH = 250;
        const imgY = 100;

        ctx.fillStyle = baseObj.color;
        ctx.font = "700 20px 'Noto Serif SC', 'Source Han Serif SC', serif";
        ctx.fillText(baseObj.name, imgX, imgY + imgH + 30);

        // "Minted" DNA Info
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "10px monospace";
        ctx.fillText(`DNA: Hue${Math.round(dna.hueShift)} Glt${Math.round(dna.glitchIntensity * 100)} Mtx${Math.round(dna.matrixOpacity * 100)}`, imgX, imgY + imgH + 50);
        ctx.fillText(`ID: ${dna.seed.slice(-8).toUpperCase()}`, imgX, imgY + imgH + 62);

        // Footer
        ctx.fillStyle = "#7ce1c3";
        ctx.font = "14px 'Manrope', 'Noto Sans SC', sans-serif";
        ctx.fillText(`行动建议：${profile.advice}`, 32, 480 - 52);
        ctx.fillText("认知五层测评 | Powered by Nono Banana Intelligence", 32, 480 - 28);
    },

    // Future Hook: Connect to real Nano Banana / Gemini API
    async generateRemote(result) {
        console.log("Calling external AI for High-Fidelity Render...");
        // const dna = this.calculateDNA(result);
        // const response = await fetch("/api/generate-card", {
        //   method: "POST",
        //   body: JSON.stringify({ dna, level: result.primary.index })
        // });
        // return await response.json(); // { url: "..." }
        return null;
    }
};
