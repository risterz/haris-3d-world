export interface Project {
  id: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  category: string
  status: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  driveInFeatured?: boolean
  period: string
  image: string
  images?: string[]
  accentColor?: string
}

export const projects: Project[] = [
  // 11 Drive-In Alley Featured Live Websites (all verified HTTP 200)
  {
    id: 'vela-atelier',
    title: 'VELA — Donut V Architectural Showcase',
    shortTitle: 'VELA Donut V',
    description:
      'Zero-framework luxury patisserie showcase with real-time WebGL1 fluid sprinkle reveal, 12-dot SDF blooming mark, parametric 3D SVG CAD wireframes, and interactive glaze studio.',
    longDescription:
      'Built with vanilla ES modules, Lenis smooth scroll, raw WebGL1 GLSL shaders, and a 25-plate headless Three.js PBR studio renderer in ~27 KB gzipped. Features a 3-pass ping-pong fluid cursor reveal uncovering 280 cascading 3D sprinkles, 6-act scroll choreography, holdout-occluded interactive glaze dipping studio, and full SPA checkout.',
    technologies: ['WebGL1 GLSL', 'Three.js', 'Lenis', 'Vite 6', 'SVG CAD', 'Cloudflare Pages'],
    githubUrl: 'https://github.com/risterz/vela-atelier',
    liveUrl: 'https://vela-atelier.pages.dev',
    category: '3D & WebGL Showcase',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/vela-atelier-hero.png',
    images: [
      '/images/projects/vela-atelier-hero.png',
      '/images/projects/vela-atelier-studio.png',
    ],
    accentColor: '#B8925A',
  },
  {
    id: 'cosmic-odyssey',
    title: 'Cosmic Odyssey — 3D Space Exploration',
    shortTitle: 'Cosmic Odyssey',
    description:
      'Cinematic, scroll-driven 3D space voyage through rotating Earth, Whirlpool Galaxy, four interactive worlds, and NASA spacewalk storytelling.',
    longDescription:
      'Five-chapter interactive deep-space experience built with React 19, TypeScript, Three.js, GSAP ScrollTrigger, Lenis smooth scroll, and synthesized Web Audio soundscapes. Features custom GLSL planetary atmospheres, selectable 3D worlds with astronomical archives, guided autopilot, and full keyboard accessibility.',
    technologies: ['React 19', 'TypeScript', 'Three.js', 'GSAP', 'Lenis', 'Web Audio API'],
    githubUrl: 'https://github.com/risterz/cosmic-odyssey',
    liveUrl: 'https://cosmic-odyssey.pages.dev',
    category: '3D Space Experience',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/cosmic-odyssey-hero.png',
    images: [
      '/images/projects/cosmic-odyssey-hero.png',
      '/images/projects/cosmic-odyssey-weightless.png',
    ],
    accentColor: '#3B82F6',
  },
  {
    id: 'brawl-arena',
    title: 'Brawl Arena — 3D 3v3 Multiplayer Brawler',
    shortTitle: 'Brawl Arena',
    description:
      'Fast-paced 3D 3v3 real-time multiplayer arena brawler with 7 rigged GLB brawlers, Gem Grab & Brawl Ball modes, A* bot AI, and Cloudflare Durable Objects.',
    longDescription:
      'Full-stack 3D browser brawler built with Three.js, TypeScript workspaces, and Cloudflare Workers + SQLite Durable Objects. Features 7 custom-rigged 3D brawlers with smooth skeletal animations and emissive shaders, 3 symmetric arenas with destructible cover, WebSocket room lobbies, offline A* bot play, and cross-platform PC + mobile twin-stick controls.',
    technologies: ['TypeScript', 'Three.js', 'Cloudflare Workers', 'Durable Objects', 'Vite'],
    githubUrl: 'https://github.com/risterz/brawl-arena',
    liveUrl: 'https://brawl-arena.harisharraz02.workers.dev',
    category: '3D Multiplayer Game',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/brawl-arena-lobby.png',
    images: ['/images/projects/brawl-arena-lobby.png', '/images/projects/brawl-arena-match.png'],
    accentColor: '#8B4DFF',
  },
  {
    id: 'donutverse',
    title: 'DONUTVERSE — Artisan 3D Donut Storefront',
    shortTitle: 'DONUTVERSE',
    description:
      'Editorial artisan donut storefront with a procedural Three.js 3D glaze studio, live flavor switching, and slide-over shopping bag.',
    longDescription:
      'Tactile bakery storefront crafted with React 18, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and Framer Motion. Features a real-time procedural Three.js brioche donut with canvas crumb bump maps, seeded sprinkles, orbit/cursor tilt, filterable 6-flavor menu, and SWEET15 promo checkout.',
    technologies: ['React', 'TypeScript', 'Three.js', 'R3F', 'GSAP', 'Tailwind CSS'],
    githubUrl: 'https://github.com/risterz/donutverse',
    liveUrl: 'https://donutverse.pages.dev',
    category: '3D & E-Commerce',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/donutverse.png',
    images: ['/images/projects/donutverse.png'],
    accentColor: '#D92B4B',
  },
  {
    id: 'keythock',
    title: 'KeyThock 3D — Mechanical Keyboard Simulator',
    shortTitle: 'KeyThock 3D',
    description:
      'Interactive 3D mechanical keyboard customizer, exploded teardown viewer, and procedural Web Audio switch acoustic simulator.',
    longDescription:
      'Built with React Three Fiber, Three.js, and synthesized Web Audio API acoustics. Lets enthusiasts swap form factors (60% to 80% TKL), test switches (Holy Panda, Gateron Yellow, Cherry MX Blue, Topre), toggle tape/PE foam mods, and type live with animated 3D keycaps.',
    technologies: ['React', 'TypeScript', 'Three.js', 'R3F', 'Web Audio API'],
    githubUrl: 'https://github.com/risterz/keythock',
    liveUrl: 'https://keythock.pages.dev',
    category: '3D Interactive',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/keythock.png',
    images: ['/images/projects/keythock.png'],
    accentColor: '#2355F5',
  },
  {
    id: 'roomforge-3d',
    title: 'RoomForge 3D — Browser Interior Planner',
    shortTitle: 'RoomForge 3D',
    description:
      'Private, 100% client-side 3D interior room planner with free orbit, top-down 2D plan toggle, and procedural furniture catalog.',
    longDescription:
      'Fast browser-based interior studio built with React 19, TypeScript, and React Three Fiber. Arrange procedural seating, desks, lighting, and decor, customize room finishes and lighting moods, and save workspace layouts locally with zero backend accounts.',
    technologies: ['React 19', 'TypeScript', 'Three.js', 'R3F', 'Vite'],
    githubUrl: 'https://github.com/risterz/RoomForge-3D',
    liveUrl: 'https://roomforge-3d.pages.dev',
    category: '3D Tool',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/roomforge-3d.png',
    images: ['/images/projects/roomforge-3d.png'],
    accentColor: '#E07A47',
  },
  {
    id: 'uno-card-game',
    title: 'UNO Online — Multiplayer Card Game',
    shortTitle: 'UNO Online',
    description:
      'Real-time online multiplayer & AI UNO game featuring Classic and 54-card Halloween Collector decks backed by Node.js + Socket.IO.',
    longDescription:
      'Full-stack multiplayer web game featuring authoritative Socket.IO room lobbies, 20-second turn timers, smart AI bots, custom background music, and two full illustrated card decks deployed across Cloudflare Pages and Render.',
    technologies: ['React 19', 'TypeScript', 'Node.js', 'Socket.IO', 'Motion'],
    githubUrl: 'https://github.com/risterz/uno-card-game',
    liveUrl: 'https://uno-card-game-335.pages.dev',
    category: 'Full Stack & Game',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Oct 2026',
    image: '/images/projects/uno-main.png',
    images: ['/images/projects/uno-main.png', '/images/projects/uno-victory.png'],
    accentColor: '#EF4B34',
  },
  {
    id: 'windows98-emulator',
    title: 'Windows 98 Web OS & Retro Games',
    shortTitle: 'Windows 98 OS',
    description:
      'Nostalgic Windows 98 desktop environment in the browser with draggable windows, Start Menu, Paint, and playable Snake, Minesweeper & Solitaire.',
    longDescription:
      'Pixel-accurate recreation of the classic Windows 98 operating system built with Next.js, React, and TypeScript. Includes working multi-window focus/minimize/maximize, classic system utilities, and retro games.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/risterz/windows98-emulator',
    liveUrl: 'https://windows98-emulator.pages.dev',
    category: 'Web Application',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Oct 2026',
    image: '/images/projects/win98-main.png',
    images: [
      '/images/projects/win98-main.png',
      '/images/projects/win98-minesweeper.png',
      '/images/projects/win98-allwindows.png',
    ],
    accentColor: '#008080',
  },
  {
    id: 'papercraft-pdf',
    title: 'Papercraft PDF — Privacy-First PDF Suite',
    shortTitle: 'Papercraft PDF',
    description:
      '100% in-browser, zero-upload PDF workshop with bold Neobrutalism UI for merging, splitting, converting, stamping, and encrypting PDFs.',
    longDescription:
      'Zero-trust client-side document suite executing purely in browser memory using PDF-Lib, PDF.js, JSZip, and HTML5 Canvas. Merge, split, convert images, watermark, compress, and password-protect PDFs without uploading sensitive files.',
    technologies: ['React 19', 'TypeScript', 'PDF-Lib', 'PDF.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/risterz/papercraft-pdf',
    liveUrl: 'https://papercraft-pdf.pages.dev',
    category: 'Productivity Tool',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Oct 2026',
    image: '/images/projects/papercraft-pdf.png',
    images: ['/images/projects/papercraft-pdf.png'],
    accentColor: '#F9DA19',
  },
  {
    id: 'ember-olive',
    title: 'Ember & Olive — Wood-Fired Gastronomy',
    shortTitle: 'Ember & Olive',
    description:
      'Cinematic Mediterranean restaurant showcase with GSAP ScrollTrigger choreography, Lenis smooth scroll, and interactive sommelier menu drawer.',
    longDescription:
      'Editorial culinary web experience built with React 19, TypeScript, Tailwind CSS v4, Lenis, and GSAP ScrollTrigger. Features atmospheric photography, warm parallax storytelling, chef spotlight, and tasting menu pairings.',
    technologies: ['React 19', 'TypeScript', 'GSAP', 'Lenis', 'Tailwind CSS'],
    githubUrl: 'https://github.com/risterz/ember-olive',
    liveUrl: 'https://ember-olive-6v6.pages.dev',
    category: 'Editorial Web',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/ember-olive.png',
    images: ['/images/projects/ember-olive.png'],
    accentColor: '#B85D3B',
  },
  {
    id: 'hiv-atlas',
    title: 'HIV Atlas — 3D Virion Explorer & Guide',
    shortTitle: 'HIV Atlas 3D',
    description:
      'Plain-language, stigma-free HIV science guide paired with a structure-informed interactive 3D HIV-1 virion cutaway explorer.',
    longDescription:
      'Combines six evidence-based educational chapters, interactive prevention and testing tools, and a real-time Three.js cutaway HIV-1 virion model where users inspect envelope trimers and the conical p24 capsid core.',
    technologies: ['React 19', 'Three.js', 'Vite', 'jsPDF'],
    githubUrl: 'https://github.com/risterz/hiv-atlas',
    liveUrl: 'https://hiv-atlas.pages.dev',
    category: '3D Science & EdTech',
    status: 'completed',
    featured: true,
    driveInFeatured: true,
    period: 'Nov 2026',
    image: '/images/projects/hiv-atlas.png',
    images: ['/images/projects/hiv-atlas.png'],
    accentColor: '#C84B31',
  },

  // Additional Projects (shown in Quick View Drawer)
  {
    id: 'freefetch',
    title: 'FreeFetch — Desktop Media Downloader',
    shortTitle: 'FreeFetch',
    description:
      'Clean-room desktop media downloader engineered with Tauri v2, Rust, React, and FFmpeg for high-speed concurrent downloads.',
    longDescription:
      'Native desktop application combining a Rust/Tauri v2 backend with a responsive React/Tailwind UI. Supports batch queue management, automatic FFmpeg transcoding, and download history analytics.',
    technologies: ['Tauri v2', 'Rust', 'React', 'TypeScript', 'FFmpeg'],
    githubUrl: 'https://github.com/risterz/FreeFetch',
    liveUrl: 'https://github.com/risterz/FreeFetch/releases',
    category: 'Desktop & Systems',
    status: 'completed',
    featured: false,
    period: 'Oct 2026',
    image: '/images/projects/freefetch-main.png',
    images: [
      '/images/projects/freefetch-main.png',
      '/images/projects/freefetch-batch.png',
      '/images/projects/freefetch-history.png',
    ],
  },
  {
    id: 'pixelvault',
    title: 'PixelVault / StegoBox — AES-256 Steganography',
    shortTitle: 'PixelVault',
    description:
      'Client-side image steganography with PBKDF2 + AES-256-GCM encryption (LSB & Append modes) plus Python desktop edition.',
    longDescription:
      'Hide encrypted secrets inside PNG/JPG/WebP images directly in the browser with WebCrypto API and Canvas pixel manipulation—zero server uploads. Companion to the Python CustomTkinter StegoBox desktop suite.',
    technologies: ['Next.js', 'WebCrypto API', 'AES-256-GCM', 'Python'],
    githubUrl: 'https://github.com/risterz/pixelvault',
    liveUrl: 'https://pixelvault-30v.pages.dev',
    category: 'Cybersecurity',
    status: 'completed',
    featured: false,
    period: 'Oct 2026',
    image: '/images/projects/pixelvault.png',
    images: ['/images/projects/pixelvault.png', '/images/projects/stegobox-main.png'],
  },
  {
    id: 'neomarket',
    title: 'NEOMARKET — Editorial E-Commerce Storefront',
    shortTitle: 'NEOMARKET',
    description:
      'Bold dark-and-lime e-commerce storefront template with instant search, variants, wishlist, promo codes, and local order history.',
    longDescription:
      'Responsive storefront built with React 19 and Vite 6 featuring live category filtering, shareable product detail routes, persistent wishlist/cart, and demo checkout validation.',
    technologies: ['React 19', 'Vite 6', 'CSS', 'Lucide Icons'],
    githubUrl: 'https://github.com/risterz/neomarket',
    liveUrl: 'https://neomarket-1v5.pages.dev',
    category: 'E-Commerce',
    status: 'completed',
    featured: false,
    period: 'Nov 2026',
    image: '/images/projects/neomarket.png',
    images: ['/images/projects/neomarket.png'],
  },
  {
    id: 'mp4-to-mp3-converter',
    title: 'SonicShift — Client-Side MP4 to MP3 Converter',
    shortTitle: 'SonicShift',
    description:
      '100% private in-browser MP4 to MP3 audio extractor powered by FFmpeg WebAssembly with studio bitrate controls.',
    longDescription:
      'Converts video files to MP3 locally inside browser Web Workers using ffmpeg.wasm with selectable bitrates and zero server uploads.',
    technologies: ['React 19', 'TypeScript', 'FFmpeg.wasm', 'Tailwind CSS'],
    githubUrl: 'https://github.com/risterz/mp4-to-mp3-converter',
    liveUrl: 'https://sonicshift-mp3.pages.dev',
    category: 'Media Tool',
    status: 'completed',
    featured: false,
    period: 'Nov 2026',
    image: '/images/projects/mp4-to-mp3-converter.png',
    images: ['/images/projects/mp4-to-mp3-converter.png'],
  },
  {
    id: 'shuffle-puzzle',
    title: 'Shuffle — Sliding Puzzle + Cloudflare D1 Leaderboard',
    shortTitle: 'Shuffle Puzzle',
    description:
      'Responsive 3x3 to 5x5 sliding puzzle game hosted on Cloudflare Workers with a live Cloudflare D1 ranked leaderboard.',
    longDescription:
      'Zero-dependency vanilla JavaScript puzzle supporting number and custom-photo modes, saved sessions, light/dark themes, and an edge Cloudflare Worker + D1 global leaderboard.',
    technologies: ['JavaScript', 'Cloudflare Workers', 'Cloudflare D1'],
    githubUrl: 'https://github.com/risterz/shuffle-puzzle',
    liveUrl: 'https://shuffle-puzzle.harisharraz02.workers.dev/',
    category: 'Web Game',
    status: 'completed',
    featured: false,
    period: 'Nov 2026',
    image: '/images/projects/shuffle-puzzle.png',
    images: ['/images/projects/shuffle-puzzle.png'],
  },
  {
    id: 'gemini-ai',
    title: 'Gemini Web Interface — Stateless AI Studio',
    shortTitle: 'Gemini UI',
    description:
      'Neobrutalist stateless web interface for Google Gemini AI with multimodal vision chat and image studio workflows.',
    longDescription:
      'Built with Python, Flask, Gunicorn, and vanilla JavaScript featuring responsive neobrutalist UI, image uploads, and prompt enhancement.',
    technologies: ['Python', 'Flask', 'JavaScript', 'Gemini API'],
    githubUrl: 'https://github.com/risterz/gemini-web-ui',
    liveUrl: 'https://gemini-crack.onrender.com',
    category: 'AI Web App',
    status: 'completed',
    featured: false,
    period: 'Dec 2025',
    image: '/images/projects/gemini-studio.png',
    images: ['/images/projects/gemini-studio.png'],
  },
]
