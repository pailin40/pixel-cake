# 🎂 Pixel Cake Generator

A frontend project that creates a unique pixel-style birthday cake based on your name — each cake is procedurally generated with vibrant colors and decorations in pixel-perfect detail.

Built with **React**, **Vite**, and **HTML5 Canvas**.

---

## Features

- Unique cake per name input
- Pixel-art aesthetic with dynamic layers
- Glowing animated candle flames
- Option to remove candles
- Downloadable image

---

## View Website

[🔗 View the live site](https://pixel-cake.netlify.app)

![Screenshot 2025-05-27 194748](https://github.com/user-attachments/assets/687e3cca-2ae3-4897-b2a3-3342f4eb158b)

---

## How It Works (Procedural Generation)

### String-to-Hash
- The user's input (like their name) is converted into a numeric hash using a custom function.
- This hash ensures consistent outputs — the same name will always generate the same cake.

### Hash-to-Visuals
- The hash is used to:
  - Pick **base**, **frosting**, and **decoration** colors (using HSL color math)
  - Determine how many **layers** (2–4) the cake has
  - Randomly place **cherries**, **decorations**, and **candles**

### Canvas Rendering
- The cake is drawn on a `<canvas>` using the HTML5 Canvas API.
- Each cake layer is drawn as pixel blocks on a 16x16 grid.
- Candles are animated using the `requestAnimationFrame` loop and canvas shadows to simulate glowing flames.

### Deterministic Output (no randomness)
- Because the hash is derived from the name and used for all layout/color logic, the output is fully deterministic.
- This makes the app behave like a **procedural avatar generator** (like GitHub avatar), but for cakes.

---

## Tech Stack

- **React** for the interactive UI
- **Vite** for lightning-fast dev/build tooling
- **HTML5 Canvas** for pixel drawing and animations
- **CSS** for the retro neon aesthetic

---

## Installation

```bash
git clone https://github.com/your-username/pixel-cake.git
cd pixel-cake
npm install
npm run dev
