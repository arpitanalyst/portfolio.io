# Arpit Sharma — 3D Data Analyst Portfolio

A premium, futuristic, interactive portfolio site built with plain HTML/CSS/JavaScript, **Three.js** for the 3D environment and **GSAP + ScrollTrigger** for animation.

## 1. Folder structure

```
arpit-3d-portfolio/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js            → navigation, theme toggle, rendering, contact form
│   ├── three-scene.js      → Three.js background + hero 3D environment
│   └── animations.js       → GSAP + ScrollTrigger animations
│
├── assets/
│   ├── images/
│   │   └── image.png       → YOUR profile photo goes here
│   ├── icons/               → optional extra icons
│   └── projects/            → optional project screenshots
│
├── resume/
│   └── Arpit-Sharma-Resume.pdf   → YOUR resume PDF goes here
│
└── data/
    └── projects.js         → edit this to add/change projects
```

## 2. Add your photo

Place your photo at exactly:

```
assets/images/image.png
```

- Keep the filename **image.png** — don't rename it.
- The Hero and About sections both read from this same path.
- Until you add the photo, a placeholder card is shown automatically (no broken image icon), so the site works right away.
- The Hero frame uses `object-fit: contain`, so a full-body or portrait photo will never stretch or distort.

## 3. Add your resume

Place your PDF at exactly:

```
resume/Arpit-Sharma-Resume.pdf
```

The "Download Resume" button in the Hero section links straight to this path.

## 4. Run the website

No build tools or installs are required — it's a static site.

**Easiest:** double-click `index.html` to open it in your browser.

**Recommended (avoids any local file restrictions):** use a simple local server so the browser can load the JS/CSS/image files correctly:

- VS Code: install the "Live Server" extension → right-click `index.html` → "Open with Live Server".
- Or, with Python installed, run this from the project folder:
  ```
  python -m http.server 5500
  ```
  then open `http://localhost:5500` in your browser.

The site loads Three.js and GSAP from a CDN, so you'll need an internet connection the first time (browsers cache them after that).

## 5. Change your LinkedIn and GitHub links

Open `index.html` and search for `your-username` — it appears in the navbar, mobile menu, Hero-adjacent contact section and footer. Replace:

```html
https://linkedin.com/in/your-username
https://github.com/your-username
```

with your real profile URLs. Do a find-and-replace across the file to catch every instance.

Also update the `mailto:` address inside `js/main.js` (`initContactForm`) to your real email so the contact form opens correctly addressed.

## 6. Add or edit projects

Open `data/projects.js`. Each project is one object in the `PROJECTS` array:

```js
{
  id: "your-project-id",
  number: "05",
  title: "Project Title",
  tools: ["SQL", "Python"],
  description: "One or two sentence summary.",
  features: ["Feature one", "Feature two"],
  formula: "Optional formula text",     // omit this line if not needed
  links: {
    view: "#",                          // link to a case study / live report
    github: "https://github.com/you/repo",
  },
},
```

Copy an existing object, edit the fields, and add it to the array — the Projects section renders automatically, no HTML editing required.

## 7. Customize colors, fonts and text

- Colors and fonts are defined once, at the top of `css/style.css` inside `:root { ... }` — change a value there and it updates the whole site.
- Skill cards are listed in the `SKILLS` array near the top of `js/main.js`.
- All other page copy (Hero, About, Experience, Education, Contact) lives directly in `index.html` and can be edited like normal text.

## 8. Notes on the 3D & animation

- `js/three-scene.js` renders two Three.js scenes: a subtle full-page particle/wireframe background, and the hero "analytics environment" (holographic rings, orbiting particles, a bar chart, pie chart, database cylinder and tool cubes) around your photo.
- `js/animations.js` handles the GSAP entrance timeline, scroll-triggered reveals, the timeline/skill/project stagger animations and the mouse-driven parallax tilt.
- Both respect `prefers-reduced-motion` and automatically reduce particle counts on narrower/mobile screens for performance.
