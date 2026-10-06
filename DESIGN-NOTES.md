# Aarav redesign

## Reference analysis

The supplied construction reference uses warm cream surfaces, charcoal service and gallery sections, burnt-orange uppercase headings, large construction photos, brush-like edges, compact service cards, and a warm call-to-action panel.

[ArtSewa](https://www.artsewa.com/) was inspected in a live desktop browser. Its distinguishing details include oversized continuously moving type, masked entrance transitions, oversized background lettering, rotating decorative elements, and scroll-triggered copy reveals. The previous Aarav implementation had a static hero and service strip; most of its motion was below the fold and easy to miss.

## Implemented direction

- Rebuilt the page around the construction reference's image-led layout. The latest revision uses white sections, warm ivory accents, and orange highlights throughout; the former charcoal sections have been removed.
- Barlow Condensed headings and Manrope body text, self-hosted with Next.js fonts.
- Construction-photo hero with a brush-like boundary, sequential masked text entrance, image wipe, rotating seal, and floating note.
- React Bits RotatingText cycles through projects, spaces, websites, and possibilities.
- Continuously moving service marquee, plus Lenis / GSAP scroll animation.
- Image reveals, scroll-linked typography movement, reading progress, process progress, and pointer-responsive gallery artwork.
- Five service cards, an about section, benefits, a dedicated web/app showcase, process, filterable masonry gallery with a lightbox, FAQs, and an enquiry form.
- Animations run automatically and follow the system reduced-motion preference. The visible Motion and Replay buttons and their persistent overrides were removed at the user's request.
- Service cards use white surfaces, rounded image frames, subtle warm shadows, and orange accents. The gallery, digital showcase, footer, and contact form share the light palette with readable text and borders.

## Content choices

The gallery is marked as reference imagery and concepts. Business statistics, employee names, and testimonials were not invented. Enquiries remain downloadable briefs with optional email handoff configured through `NEXT_PUBLIC_CONTACT_EMAIL`.

## Source credits

- React Bits [RotatingText](https://reactbits.dev/text-animations/rotating-text) and [BlurText](https://reactbits.dev/text-animations/blur-text), David Haz. License in `licenses/react-bits.md`.
- Framing photograph: [Troy Mortier on Unsplash](https://unsplash.com/photos/a-house-under-construction-in-the-middle-of-a-field-FW1XhtGsdBA).
- Other locally stored Unsplash images: architecture, construction planning, interiors, workspaces, web development, mobile device, and residence. Interface mockups are original HTML/CSS.
