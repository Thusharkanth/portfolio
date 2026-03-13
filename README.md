# Portfolio Website — Loganathan Thusharkanth

A personal portfolio website built with **pure HTML, CSS, and JavaScript** — no frameworks, no dependencies. Features two distinct visual themes that share the same content and section structure.

**Live Site:** [thusharkanth.github.io/portfolio](https://thusharkanth.github.io/portfolio/)

---

## Two Versions

### Advanced Version (`/advanced`)

A **cyberpunk / AI-themed** design with dark backgrounds, neon accents, and interactive visual effects.

- **Neural network particle canvas** — 80 animated particles with physics simulation, mouse-tracking attraction, and particle-to-particle connections rendered on HTML5 Canvas
- **CRT scanline overlay** — retro screen effect using CSS repeating gradients
- **Glitch text animation** — CSS keyframe-based text glitch on the hero heading
- **Glassmorphism cards** — frosted glass effect using `backdrop-filter: blur()`
- **Terminal-style UI** — monospace font (JetBrains Mono), typed prefixes (`<`, `/>`), cursor blinking, and `> ` prompt-style form messages
- **Neon glow effects** — hover states with dual-color box-shadow glows
- **Hero background image** — full-width photo with gradient overlays instead of a profile photo
- **Color palette:** Dark navy (`#060b18`), cyan blue (`#4a9eff`), golden amber (`#f0a500`), purple, pink, green

### Classic Version (`/classic`)

A **clean, professional / corporate** design with light backgrounds and a traditional layout.

- **Profile photo** — circular image display in the hero section
- **Light color scheme** — white and light gray backgrounds with navy (`#0A1628`) and blue (`#3B82F6`) accents
- **Minimal effects** — standard box shadows, no particles, no glitch, no scanlines
- **Single font** — Inter (Google Fonts) for a clean, readable look
- **Professional aesthetic** — focused on content readability and corporate appeal

### Shared Features (Both Versions)

- **10 sections:** Hero, About, Education, Experience, Projects, Skills, Certificates & Memberships, Extracurricular, Contact, Footer
- **Responsive design** — desktop (3-column grids), tablet (2-column), mobile (1-column with hamburger menu)
- **Fixed navbar** — transparent over hero, solid background on scroll
- **Scroll animations** — fade-up effect on elements entering the viewport via Intersection Observer
- **Project filtering** — toggle between All / AI-ML / Web / Data categories with fade transitions
- **Active nav highlighting** — automatically highlights the current section in the navbar
- **Theme switcher** — link in both versions to switch between Advanced and Classic
- **CV download** — button to download the PDF resume
- **Smooth scrolling** — anchor links scroll smoothly to sections

---

## Contact Form — Web3Forms Integration

The contact form sends emails **without a backend server**, making it compatible with static hosting like GitHub Pages.

**How it works:**
- The form submits data to the [Web3Forms](https://web3forms.com/) API via a `fetch` POST request
- A public access key (stored as a hidden form input) identifies the destination email
- Web3Forms processes the submission and delivers the message via email
- The access key is **safe to expose in frontend code** — it can only be used to send messages to the registered email, not to read or access anything

**Features:**
- Loading state with disabled button while sending
- Success / error messages displayed below the form
- Form resets after successful submission
- Graceful error handling for network failures

---

## Project Structure

```
my website/
├── index.html                    # Root redirect → advanced version
├── README.md
├── advanced/
│   ├── index.html                # Advanced theme (cyberpunk)
│   ├── styles.css                # 1,500+ lines of styling
│   ├── script.js                 # Particles, glitch, form, animations
│   ├── assets/
│   │   └── hero-bg.png           # Hero background image
│   └── CV/
│       └── Loganathan thusharkanth_CV.pdf
├── classic/
│   ├── index.html                # Classic theme (professional)
│   ├── styles.css                # 1,400+ lines of styling
│   ├── script.js                 # Form, animations, filters
│   └── assets/
│       └── profile-photo.jpg     # Profile photo
└── images/                       # Source images
```

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Markup      | HTML5 (semantic elements, ARIA)     |
| Styling     | CSS3 (custom properties, grid, flexbox, animations, media queries) |
| Interactivity | Vanilla JavaScript (ES6+)         |
| Canvas      | HTML5 Canvas API (advanced version) |
| Fonts       | Google Fonts (Inter, JetBrains Mono)|
| Icons       | Inline SVGs (no icon font dependency)|
| Contact     | Web3Forms API (serverless email)    |
| Hosting     | GitHub Pages                        |

**Zero dependencies.** No npm, no build tools, no frameworks — just open `index.html` in a browser.

---

## Deployment

Hosted on **GitHub Pages** from the `main` branch. The root `index.html` redirects visitors to the advanced version by default.

To deploy your own:
1. Fork or clone this repository
2. Enable GitHub Pages in repository Settings → Pages → Source: `main` branch
3. Update the Web3Forms access key with your own (get one at [web3forms.com](https://web3forms.com/))
4. Replace CV, profile photo, and hero image in the `assets/` folders
5. Update content in both `advanced/index.html` and `classic/index.html`

---

## Browser Support

Tested on modern browsers (Chrome, Firefox, Edge, Safari). Uses standard CSS and ES6+ JavaScript — no polyfills needed for current browsers.
