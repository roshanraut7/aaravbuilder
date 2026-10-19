"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const greetings = [
  { text: "Hello", lang: "en" },
  { text: "नमस्ते", lang: "ne" },
  { text: "Hola", lang: "es" },
  { text: "Bonjour", lang: "fr" },
  { text: "Ciao", lang: "it" },
  { text: "Konnichiwa", lang: "ja" },
  { text: "Salaam", lang: "ar" },
  { text: "Hallo", lang: "de" },
  { text: "Olá", lang: "pt" },
  { text: "Annyeong", lang: "ko" },
];

export default function Preloader() {
  const [wordIndex, setWordIndex] = useState(0);
  const [showBrand, setShowBrand] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.add("intro-active");
    return () => document.documentElement.classList.remove("intro-active");
  }, [mounted]);

  useEffect(() => {
    if (!visible) return;

    const duration = showBrand
      ? reducedMotion
        ? 350
        : 950
      : reducedMotion
        ? 350
        : wordIndex === 0
          ? 1000
          : 150;
    const timer = window.setTimeout(() => {
      if (showBrand) {
        setVisible(false);
        return;
      }
      if (reducedMotion) {
        setShowBrand(true);
        return;
      }
      if (wordIndex === greetings.length - 1) {
        setShowBrand(true);
        return;
      }
      setWordIndex((current) => current + 1);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [reducedMotion, showBrand, visible, wordIndex]);

  if (!mounted) return null;

  return (
    <AnimatePresence onExitComplete={() => setMounted(false)}>
      {visible && (
        <motion.div
          className="preloader"
          role="status"
          aria-label="Welcome to Aarav Builder and IT Solution"
          exit={{ y: "-100vh" }}
          transition={{
            duration: reducedMotion ? 0.01 : 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div className="preloader-surface" />
          <motion.div
            className="preloader-greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reducedMotion ? 0 : 0.5,
              duration: reducedMotion ? 0 : 0.25,
            }}
          >
            {showBrand ? (
              <motion.div
                className="preloader-brand"
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
              >
                <strong>AARAV</strong>
                <span>BUILDER &amp; IT SOLUTION</span>
                <i aria-hidden="true" />
              </motion.div>
            ) : (
              <span className="preloader-word" lang={greetings[wordIndex].lang}>
                {greetings[wordIndex].text}
              </span>
            )}
          </motion.div>
          <svg
            className="preloader-curve"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 0H1440V22Q720 120 0 22Z" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Preloader };
