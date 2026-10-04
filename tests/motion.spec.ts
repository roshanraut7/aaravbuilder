import { test, expect } from "@playwright/test";

test("motion visibly runs, pauses, persists and can be replayed", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".hero-rotating")).toHaveCount(0);
  expect(
    await marquee.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Play animations", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Replay intro animation" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator(".hero-line-inner").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".hero-rotating")).toBeVisible();
});

test("system reduced motion stays still until explicitly enabled", async ({
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
  await page
    .getByRole("button", { name: "Play animations", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("service-marquee");
});
