document.addEventListener('DOMContentLoaded', () => {
    const evolveBtn = document.getElementById('evolveBtn');
    const userPromptInput = document.getElementById('userPrompt');
    const resultsContainer = document.getElementById('results-container');
    const loadingDiv = document.getElementById('loading');
    const errorMsg = document.getElementById('error-msg');

    evolveBtn.addEventListener('click', handleEvolution);

    // Allow pressing Enter to submit
    userPromptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleEvolution();
    });

    async function handleEvolution() {
        const userPrompt = userPromptInput.value.trim();
        if (!userPrompt) return;

        // Reset UI
        resultsContainer.innerHTML = '';
        errorMsg.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        evolveBtn.disabled = true;

        try {
            // 1. Get the 5-step text evolution
            const evolvedPrompts = await fetchPromptEvolution(userPrompt);
            
            // 2. Render the cards (Text + Images)
            await renderCardsSequential(evolvedPrompts);
        } catch (error) {
            console.error(error);
            showError("Failed to evolve the prompt. The AI might be busy. Please try again.");
        } finally {
            loadingDiv.classList.add('hidden');
            evolveBtn.disabled = false;
        }
    }

    async function fetchPromptEvolution(basePrompt) {
        // We construct a system prompt to force the AI to return a JSON array
        const systemInstruction = `
            You are an expert AI prompt engineer. 
            I will give you a simple concept: "${basePrompt}".
            
            Generate exactly 5 distinct versions of this prompt, evolving it step-by-step:
            1. Raw/Naive (The user's input)
            2. Slightly improved (Added basic subject details)
            3. More descriptive (Added style and mood)
            4. Professional quality (Added lighting, texture, camera settings)
            5. Cinematic Masterpiece (Highly detailed, complex, artistic)

            Return ONLY a raw JSON array of strings. 
            Do not include markdown formatting like \`\`\`json.
            Example format: ["prompt1", "prompt2", "prompt3", "prompt4", "prompt5"]
        `;

        // Pollinations Text API
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemInstruction)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const textData = await response.text();
        
        // Clean up the response to ensure it's valid JSON
        // Sometimes AI adds text before/after the JSON
        const jsonMatch = textData.match(/\[.*\]/s);
        
        if (!jsonMatch) {
            throw new Error('Invalid JSON format received from AI');
        }

        try {
            const prompts = JSON.parse(jsonMatch[0]);
            // Ensure we have exactly 5, or fill/slice if necessary
            if (prompts.length < 5) return prompts; 
            return prompts.slice(0, 5);
        } catch (e) {
            throw new Error('Failed to parse AI response');
        }
    }

    async function renderCardsSequential(prompts) {
        const stepTitles = [
            "Step 1: The Raw Idea",
            "Step 2: Adding Detail",
            "Step 3: Defining Style",
            "Step 4: Professional Polish",
            "Step 5: Cinematic Masterpiece"
        ];

        resultsContainer.innerHTML = "";

        for (let index = 0; index < prompts.length; index++) {
            const promptText = prompts[index];

            const card = document.createElement("div");
            card.className = "card";

            const seed = Date.now() + index;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText.trim())}` +
                `?model=flux&nologo=true&seed=${seed}&width=512&height=512`;

            card.innerHTML = `
                <div class="card-header">${stepTitles[index] || `Step ${index + 1}`}</div>
                <div class="card-image">
                    <div class="img-spinner"></div>
                    <img 
                        src="${imageUrl}" 
                        alt="AI generated image for step ${index + 1}" 
                        loading="lazy" 
                        onload="this.classList.add('loaded'); this.previousElementSibling.style.display='none';"
                        onerror="this.style.display='none'; this.previousElementSibling.style.display='none';"
                    >
                </div>
                <div class="card-body">
                    <p>${escapeHtml(promptText)}</p>
                </div>
            `;

            resultsContainer.appendChild(card);

            // 🔑 IMPORTANT: delay before next image
            await new Promise(res => setTimeout(res, 900));
        }
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
