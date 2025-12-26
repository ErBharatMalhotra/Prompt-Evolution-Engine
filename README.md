# Prompt Evolution Engine

The **Prompt Evolution Engine** is an experimental web application designed to visualize the journey of an AI prompt. It demonstrates how a simple, raw idea can be transformed into a highly detailed, cinematic image generation prompt through iterative refinement.

## 🚀 How It Works

1. **Input:** The user enters a basic concept (e.g., "A futuristic city").
2. **Evolution:** The app uses the Pollinations AI Text API to generate a 5-step evolution of that prompt, ranging from naive to expert-level.
3. **Visualization:** For each of the 5 steps, the app uses the Pollinations AI Image API to generate and display the resulting image.

## 🛠️ Tech Stack

This project is built with a strict **Frontend-Only** architecture:
- **HTML5** for structure
- **CSS3** for styling (Responsive, Flexbox/Grid)
- **Vanilla JavaScript** for logic and API integration
- **Pollinations.ai** for public, keyless AI generation (Text & Image)

No backend, no database, and no API keys are required to run this project.

## 🎯 Purpose & Learning

This tool is an **educational experiment** intended to help users understand:
- **Prompt Engineering:** How specific adjectives, lighting descriptions, and stylistic keywords affect AI output.
- **Iterative Design:** The value of refining inputs to achieve higher quality outputs.
- **API Integration:** How to chain asynchronous AI services in a client-side environment.

## ⚠️ Disclaimer

This is a learning tool and exploration prototype. It relies on public, free APIs which may have rate limits or variable latency. It is not intended for commercial or enterprise production use.

## 📦 How to Run

1. Download the files (`index.html`, `style.css`, `script.js`).
2. Place them in the same folder.
3. Open `index.html` in any modern web browser.
