# Mohit Kumar - Portfolio Website

Ye ek **static website** hai: sirf HTML + CSS + JavaScript. Koi framework (React, etc.), koi database ya
server nahi chahiye. Folder ko kahin bhi upload karo (Netlify, GitHub Pages, Cloudflare Pages) aur chalega.

---

## 1. Folder me kya hai

```
portfolio-site/
├── index.html            <- poora content (text, sections, links)
├── css/
│   └── style.css         <- design: colours, fonts, layout, hover effects
├── js/
│   └── main.js           <- behaviour: navbar, gallery, photo viewer, build animation
└── images/
    ├── hero-photo.webp   <- home page ki tumhari photo (background hata hua)
    ├── gallery/          <- photo-01.jpg ... photo-11.jpg
    └── logos/            <- harshnath.png, gem.png, tradingview.png
```

## 2. Kaun si languages / technology use hui

| Cheez | Kya hai | Kahan |
|---|---|---|
| **HTML** | Page ka structure aur sara text | `index.html` |
| **CSS** | Colours, fonts, layout, hover, animation | `css/style.css` |
| **JavaScript** (plain, bina library ke) | Navbar, gallery, photo viewer, build animation | `js/main.js` |
| **Google Fonts** | Anton (bade headings), Bricolage Grotesque (normal text), JetBrains Mono (chhote labels), Kaushan Script ("Hello, I'm") | `index.html` ke top me link; **internet chahiye** |
| **Images** | WebP (hero photo), JPG (gallery), PNG (logos) | `images/` |

Python is website me use **nahi** hui hai. Tools wali strip me "Python" sirf ek naam hai jo tumhari skill dikhata hai.

---

## 3. VS Code me kaise kholo

1. VS Code kholo -> **File -> Open Folder** -> `portfolio-site` folder chuno.
2. Extensions me **Live Server** (Ritwick Dey) install karo.
3. `index.html` par right-click -> **Open with Live Server**. Browser me site khul jayegi, aur tum file save karoge to apne aap refresh hogi.
   (Live Server ke bina bhi `index.html` ko double-click karke browser me khol sakte ho.)

---

## 4. Kya badalna hai -> kahan badlo

### Text aur content (`index.html`)

| Badalna hai | Kahan dhundho (Ctrl+F) |
|---|---|
| Naam (Mohit / Kumar) | `<h1 class="display">` |
| Role line "Web Development & Trading" | `class="role mono"` |
| Home ka chhota bio | `class="lede"` (pehla wala, hero ke andar) |
| Home ke 3 numbers (3+ Years on GeM, MCA, 3 Degrees) | `class="stat"` |
| About ka text aur facts | `<section id="about">` |
| Skills (Stock markets, Web development, GeM & tenders) | `<section id="skills">` |
| Education | `<section id="education">` |
| **Certifications** (add/hatao) | `<section id="certifications">` -> `<article class="cert">` ko copy-paste karo |
| Experience | `<section id="experience">` |
| **Projects** (naya project jodna) | `<section id="projects">` -> `<article class="proj">` poora copy-paste karke badlo |
| Email | `id="v-email"` (do jagah badlo: `mailto:` wali link aur dikhne wala text) |
| Phone | `id="v-phone"` (`tel:` link aur dikhne wala text) |
| **Instagram ID** | `trade_or_code` Ctrl+F karo, 4 jagah milega (hero me link + naam, Contact me link + naam) |
| Footer | `<footer class="mono">` |

**Project ka link lagana (jab portfolio ka Netlify link ban jaye):** `This portfolio website` wale card me
`<div class="proj-url mono">Live link coming soon</div>` ki jagah ye likho:

```html
<a class="btn proj-link" href="https://TUMHARA-LINK.netlify.app" target="_blank" rel="noopener">Visit website <span aria-hidden="true">&#8599;</span></a>
```

### Photos

- **Hero photo badalna:** nayi photo (background hata hui, PNG/WebP) ko `images/hero-photo.webp` naam se replace kar do.
- **Gallery me photo jodna:**
  1. Photo ko `images/gallery/` me daalo (jaise `photo-12.jpg`).
  2. `js/main.js` me `var GALLERY = [` list dhundho aur ek line jodo:
     `{ src: 'images/gallery/photo-12.jpg', w: 1200, h: 800 },`
     (`w` aur `h` = photo ki width aur height pixels me. Windows me photo par right-click -> Properties -> Details me milta hai.)
  3. Photo hatani ho to us line ko delete kar do.
  4. Photo ke neeche likhna ho to line me `caption: 'Udaipur'` bhi jod sakte ho.
- Photo badi ho to pehle 1200-1600 px chaudai tak chhoti kar lena, taaki site tez khule.
- **Tools strip ke logos:** `images/logos/` me files hain; `index.html` me `class="marquee"` ke andar `<span class="lg">` items hain.

### Colours aur fonts (`css/style.css`)

File ke bilkul upar `:root { ... }` me:

- `--red` = site ka main red colour
- `--bg` = background
- `--blue`, `--cyan` = wireframe aur hover ke colours
- `--font-display`, `--font-body`, `--font-mono` = fonts

Yahan ek colour badloge to poori site me badal jayega.

> **Dhyan:** `style.css` me neeche ke blocks (`v8`, `v9`, `v10`, "gallery", "projects" wagairah) upar wale blocks ko
> override karte hain (badal dete hain). Kuch badalna ho aur asar na dikhe, to file ke **neeche** se dhundhna shuru karo.
> Kuch purane rules ab kaam me nahi aate, par unhe na chhedo to bhi site theek chalti hai. Delete karne se pehle file ka backup le lena.

---

## 5. Site kaise kaam karti hai (short me)

**Navbar aur pages (`main.js` -> "pages")**
Site me do "pages" hain: Home aur Gallery, jo `#gallery` jaise hash se badalte hain. Home ke sections (About, Skills...) navbar se scroll hote hain, aur jis section me ho wo navbar me highlight hota hai (scroll spy).

**"PORTFOLIO" bada word** (`fitGhost`)
Hero ke peeche ka bada PORTFOLIO shabd screen ki width ke hisaab se apne aap size hota hai.

**Build animation (`main.js` -> "build sequence")**
Scroll karte hue har cheez (heading, card, photo) pehle ek neele wireframe box ki tarah aati hai, 12 rangeen arrow cursors usse "banate" dikhte hain, aur phir asli content ubharta hai. Neeche wali bar me kitni layers bani wo dikhta hai, aur **Replay** se dobara chalta hai. Jo kuch banna hai uski list `var MAP = [...]` me hai (selector -> type).
Computer me "reduce motion" on ho to ye animation band ho jati hai.

**Gallery (`main.js` -> `GALLERY`, `layoutGal`)**
Photos ek list se aati hain. `layoutGal` unhe aise rows me lagata hai ki har row poori width bhare (laptop par kai photos ek row me, phone par landscape akeli aur portrait do-do). Photo par click/tap karne se full-screen viewer khulta hai: arrows, keyboard left/right, phone par swipe, `Esc` se band.

**Mobile**
CSS ke `@media (max-width: ...)` rules phone ke liye layout badalte hain.

---

## 6. Netlify par daalna (link banana)

1. https://app.netlify.com/drop kholo (Netlify account me login karke).
2. Poora `portfolio-site` **folder** (ya uski zip) us page par drag-drop kar do.
3. Kuch seconds me link mil jayega, jaise `https://kuch-naam.netlify.app`. Site settings me naam badal sakte ho.
4. Baad me kuch badalna ho: files badlo -> Netlify me us site ke **Deploys** tab me naya folder drag-drop karo.

Ye link **sabko dikhta hai**, kisi login ki zaroorat nahi.

---

## 7. Zaroori baatein

- **Admin panel is folder me nahi hai.** Claude wale version me photos/text badalne ke liye ek private admin tha, jo sirf Claude ke andar chalta hai. Netlify par content badalna ho to is README ke hisaab se files badlo.
- Fonts Google se aate hain, isliye bina internet ke fallback fonts dikhenge (design thoda alag lagega).
- `index.html`, `css/style.css`, `js/main.js` ka **folder structure mat badlo**, warna links toot jayenge (css/js/images ke paths file me likhe hain).
- Instagram, email, phone jaisi cheezein HTML me seedhe likhi hain, kisi form ya database se nahi aati.
