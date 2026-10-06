import { test, expect } from "@playwright/test";

test("motion runs automatically without visible motion controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // A preference saved by the removed control must not silently disable motion.
  await page.addInitScript(() =>
    localStorage.setItem("aarav-motion", "reduced"),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  const marquee = page.locator(".marquee-track");
  const first = await marquee.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => marquee.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(first);
  const initialWord = await page
    .locator(".hero-rotating .text-rotate-sr-only")
    .textContent();
  await expect(
    page.locator(".hero-rotating .text-rotate-sr-only"),
  ).not.toHaveText(initialWord!, { timeout: 5500 });
  await expect(
    page.getByRole("button", { name: /animations|replay/i }),
  ).toHaveCount(0);
  await expect(page.locator(".hero-line-inner").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".hero-rotating")).toBeVisible();
});

test("animation follows changes to the system reduced-motion preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("service-marquee");
});
