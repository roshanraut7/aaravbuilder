"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useMotionPreference } from "./motion-preference";
import "lenis/dist/lenis.css";

export default function MotionProvider() {
  const { enabled } = useMotionPreference();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.dataset.motion = enabled ? "full" : "reduced";
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -90 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    let intro: gsap.core.Timeline;
    const context = gsap.context(() => {
      intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(
          ".hero-line-inner",
          { yPercent: 115, rotate: 3, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1.05, stagger: 0.14 },
          0.12,
        )
        .fromTo(
          ".hero-copy > .eyebrow, .hero-copy > p, .hero-actions, .hero-bottom",
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.12 },
          0.55,
        )
        .fromTo(
          ".hero-visual",
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.35, ease: "power4.inOut" },
          0,
        )
        .fromTo(
          ".hero-seal",
          { scale: 0.4, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.5)" },
          1.05,
        );
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        // Keep controls stationary when users scroll directly to a filter.
        if (el.querySelector("button, input, select, textarea")) return;
        gsap.from(el, {
          y: el.closest(".section-heading") ? 20 : 55,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-image-reveal]").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(12% 0 12% 0)",
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        const image = el.querySelector("img");
        if (image)
          gsap.from(image, {
            scale: 1.18,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
      });
      gsap.to(".hero-image", {
        yPercent: 12,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.from(".service-icon", {
        rotate: -25,
        scale: 0.6,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%",
          once: true,
        },
      });
      gsap.fromTo(
        ".about-symbol",
        { rotate: -12, y: 55 },
        {
          rotate: 8,
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          },
        },
      );
      gsap.fromTo(
        ".process-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: ".process-grid",
            start: "top 85%",
            end: "bottom 45%",
            scrub: 0.8,
          },
        },
      );
      gsap.to(".scroll-progress", {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.15 },
      });
    });
    const replay = () => {
      lenis.scrollTo(0, { immediate: true });
      intro.restart();
    };
    window.addEventListener("aarav:replay-intro", replay);
    const refresh = () => ScrollTrigger.refresh();
    const resizeObserver = new ResizeObserver(refresh);
    const main = document.querySelector("main");
    if (main) resizeObserver.observe(main);
    const refreshFrame = requestAnimationFrame(refresh);

    // Move the artwork, keeping its clickable parent stationary.
    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const card = (event.target as Element).closest<HTMLElement>(
        ".project-card",
      );
      const artwork = card?.querySelector<HTMLElement>(".project-image");
      if (!artwork || !card) return;
      const rect = card.getBoundingClientRect();
      gsap.to(artwork, {
        rotationY: ((event.clientX - rect.left) / rect.width - 0.5) * 9,
        rotationX: -((event.clientY - rect.top) / rect.height - 0.5) * 7,
        duration: 0.45,
        overwrite: "auto",
        transformPerspective: 1000,
      });
    };
    const pointerOut = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>(
        ".project-card",
      );
      if (
        !card ||
        (event.relatedTarget instanceof Node &&
          card.contains(event.relatedTarget))
      )
        return;
      const artwork = card.querySelector(".project-image");
      if (artwork)
        gsap.to(artwork, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.6,
          overwrite: "auto",
        });
    };
    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerout", pointerOut);
    return () => {
      cancelAnimationFrame(refreshFrame);
      resizeObserver.disconnect();
      window.removeEventListener("aarav:replay-intro", replay);
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerout", pointerOut);
      gsap.killTweensOf(".project-image");
      gsap.set(".project-image", { clearProps: "transform" });
      context.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);
  return <div className="scroll-progress" aria-hidden="true" />;
}
