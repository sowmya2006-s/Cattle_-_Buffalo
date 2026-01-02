import * as ort from 'onnxruntime-web';

/**
 * Loads the ONNX model session.
 * @returns {Promise<ort.InferenceSession>}
 */
export async function loadModel() {
    try {
        // Set wasm paths to CDN to avoid potential local serving issues with vite
        // In production, you might want to serve these locally
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@latest/dist/';

        const session = await ort.InferenceSession.create('./models/bovine_classifier.onnx', {
            executionProviders: ['wasm'],
        });
        console.log('ONNX Model loaded successfully');
        return session;
    } catch (e) {
        console.error('Failed to load ONNX model:', e);
        throw e;
    }
}

/**
 * Preprocesses an image element into a tensor.
 * Resizes to 224x224, validates input, normalizing if required (YOLO typ. expects 0-1 float).
 * @param {HTMLImageElement} imageElement 
 * @returns {Promise<ort.Tensor>}
 */
export async function preprocessImage(imageElement) {
    const width = 224;
    const height = 224;

    // Draw image to canvas to resize and get data
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    // Create float32 array for tensor (Batch x Channels x Height x Width)
    // YOLOv8 expects: [1, 3, 224, 224]
    const float32Data = new Float32Array(1 * 3 * width * height);

    for (let i = 0; i < width * height; i++) {
        // Red
        float32Data[i] = data[i * 4] / 255.0;
        // Green
        float32Data[width * height + i] = data[i * 4 + 1] / 255.0;
        // Blue
        float32Data[2 * width * height + i] = data[i * 4 + 2] / 255.0;
    }

    const tensor = new ort.Tensor('float32', float32Data, [1, 3, height, width]);
    return tensor;
}

/**
 * Runs inference on the preprocessed tensor.
 * @param {ort.InferenceSession} session 
 * @param {ort.Tensor} tensor 
 * @returns {Promise<Array<{idx: number, prob: number}>>} Sorted probabilities
 */
export async function runInference(session, tensor) {
    try {
        const feeds = { images: tensor }; // 'images' is the standard input name for YOLOv8
        const results = await session.run(feeds);

        // Output name usually 'output0' for classification
        const output = results[session.outputNames[0]];
        const values = output.data;

        // Softmax logic to convert logits to probabilities
        // (Though YOLOv8-cls output is usually already logits, sometimes softmax is needed if not included in export)
        // We'll assume logits here and do a quick softmax if values look unbound.
        // For simple classification, finding the max index is often enough.



        // Classes extracted from the new retrained model (68 classes)
        // Classes extracted from the new retrained model (68 classes)
        const classes_actual = [
            "buffalo_banni", "buffalo_bargur", "buffalo_bhadwari", "buffalo_chhattisgarhi", "buffalo_chilika",
            "buffalo_gojri", "buffalo_jaffarabadi", "buffalo_kalahandi", "buffalo_luit", "buffalo_marathwada",
            "buffalo_mehsana", "buffalo_murrah", "buffalo_nagpuri", "buffalo_nili_ravi", "buffalo_pandharpuri",
            "buffalo_surti", "buffalo_toda", "cattle_amritmahal", "cattle_ayrshire", "cattle_bachaur",
            "cattle_badri", "cattle_bargur", "cattle_bhelai", "cattle_dagri", "cattle_dangi", "cattle_deoni",
            "cattle_gangatari", "cattle_gaolao", "cattle_ghumsari", "cattle_gir", "cattle_hallikar",
            "cattle_hariana", "cattle_himachali_pahari", "cattle_kangayam", "cattle_kankrej", "cattle_kenkatha",
            "cattle_khariar", "cattle_kherigarh", "cattle_khillari", "cattle_konkan_kapila", "cattle_kosali",
            "cattle_krishna_valley", "cattle_ladakhi", "cattle_lakhimi", "cattle_malnad_gidda", "cattle_malvi",
            "cattle_mewati", "cattle_motu", "cattle_nagori", "cattle_nari", "cattle_nimari", "cattle_ongole",
            "cattle_poda_thirupu", "cattle_ponwar", "cattle_pulikulam", "cattle_punganur", "cattle_purnea",
            "cattle_rathi", "cattle_red_kandhari", "cattle_red_sindhi", "cattle_sahiwal", "cattle_shweta_kapila",
            "cattle_siri", "cattle_tharparkar", "cattle_thutho", "cattle_umblachery", "cattle_vechur", "invalid"
        ];

        const getCategory = (label) => {
            if (label === 'invalid') return 'Invalid';
            if (label.startsWith('buffalo_')) return 'Buffalo';
            if (label.startsWith('cattle_')) return 'Cattle';
            return 'Unknown';
        };

        // Check if output is already probabilities (sum close to 1) or logits
        const sum = values.reduce((a, b) => a + b, 0);
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        let probs;

        if (maxVal > 1.0 || minVal < 0 || Math.abs(sum - 1.0) > 0.05) {
            console.log("Model output appears to be LOGITS. Applying Softmax.");
            probs = softmax(Array.from(values));
        } else {
            console.log("Model output appears to be PROBABILITIES. Using directly.");
            probs = Array.from(values);
        }

        const predictions = probs.map((p, i) => ({
            idx: i,
            label: classes_actual[i],
            category: getCategory(classes_actual[i]),
            prob: p
        }));
        predictions.sort((a, b) => b.prob - a.prob);

        console.log("--- Model Predictions ---");
        predictions.slice(0, 5).forEach(p => {
            console.log(`${p.label} (${p.category}): ${(p.prob * 100).toFixed(2)}%`);
        });

        return predictions;
    } catch (e) {
        console.error('Inference failed:', e);
        throw e;
    }
}

function softmax(logits) {
    const max = Math.max(...logits);
    const exps = logits.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
}
