# Aarav Builder & IT Solution

A responsive Next.js App Router website for civil construction, website development, and mobile applications. Construction-inspired cream, charcoal, and orange design with TypeScript, GSAP ScrollTrigger, Lenis smooth scrolling, and React Bits BlurText / RotatingText. See `DESIGN-NOTES.md` for the reference analysis and implemented changes.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Content and contact setup

- Page content, service offerings, concept previews, FAQs, and enquiry form: `src/components/aarav-site.tsx`, rendered through `src/app/page.tsx`.
- Design and responsive styles: `src/app/site.css`; motion styles: `src/app/motion.css`.
- Scroll animations: `src/components/motion-provider.tsx`.
- The bottom-right motion control pauses/resumes decorative animation. Replay returns to the hero and runs its entrance again. The site follows the system reduced-motion preference unless a visitor explicitly overrides it; that choice is stored locally.
- Copy `.env.example` to `.env.local`, set `NEXT_PUBLIC_CONTACT_EMAIL` to the real business email, and restart/rebuild. The enquiry form generates a downloadable brief and, when configured, opens the visitor's email app with that brief. It does **not** submit to a backend, database, or email delivery service.
- All project previews are explicitly labeled illustrative concepts. Replace them with actual project images and descriptions when available.
- No invented business phone number, address, client count, or testimonial is included.
- Google fonts are downloaded at build time and self-hosted by Next.js. An internet connection is needed for the initial build.

## Credits

- [React Bits BlurText](https://reactbits.dev/text-animations/blur-text) and [RotatingText](https://reactbits.dev/text-animations/rotating-text), adapted for the shared motion preference. Source: DavidHDev/react-bits. License preserved in `licenses/react-bits.md`.
- [Lenis](https://github.com/darkroomengineering/lenis) synchronized with GSAP's animation ticker.
- Architectural photography from Unsplash: `photo-1486406146926-c627a92ad1ab` and `photo-1600585154340-be6161a56a0c`. Locally stored under `public/images`.
- Interface concept previews are original HTML/CSS compositions.

## Browser verification

With Google Chrome installed, run `npm run test:e2e`. Tests cover desktop and mobile overflow, project filters and dialogs, FAQs, enquiry downloads, service selection, and the mobile menu. Alternatively, remove `channel: "chrome"` from `playwright.config.ts` and install Playwright Chromium with `npx playwright install chromium`.

Production dependency audit reports no vulnerabilities. The development lint dependency chain currently has five related high-severity audit findings from `braces`; npm's proposed fix downgrades the Next.js ESLint configuration across major versions. Keep the matching Next.js tooling and review upstream fixes before upgrading.
