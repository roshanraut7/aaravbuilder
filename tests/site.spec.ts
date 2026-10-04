import { test, expect } from "@playwright/test";

test("page renders without errors or horizontal overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "WHERE PLANS",
  );
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".hero-image")).toBeVisible();
  expect(
    await page
      .locator(".hero-image")
      .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
  ).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  // Reveal each scroll-triggered section and load offscreen images before capture.
  for (const section of await page.locator("main section").all()) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(950);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({
    path: `test-results/${testInfo.project.name}-home.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("concept filters, accessible dialog and FAQ work", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Digital", exact: true }).click();
  await expect(page.locator(".gallery-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Explore Commerce, reimagined." })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "not a completed client project",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Civil", exact: true }).click();
  await expect(page.locator(".gallery-card")).toHaveCount(4);
  await page.getByRole("button", { name: "All concepts", exact: true }).click();
  await expect(page.locator(".gallery-card")).toHaveCount(6);
  const question = page.getByRole("button", {
    name: "How much will my project cost?",
  });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-2")).toBeVisible();
});

test("service selection carries into a downloadable enquiry", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Let’s bring your idea online" })
    .click();
  await expect(
    page.getByRole("button", { name: "Website Development", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page
    .getByLabel("A little about your idea")
    .fill("A responsive website for our new business.");
  await page.getByRole("button", { name: "Prepare my enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your project brief is ready.",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download brief" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("aarav-project-enquiry.txt");
  const stream = await download.createReadStream();
  let contents = "";
  for await (const chunk of stream!) contents += chunk.toString();
  expect(contents).toContain("Service: Website Development");
  expect(contents).toContain("Test Visitor");
  await page.getByLabel("Your name").fill("Updated Visitor");
  await expect(page.locator(".brief-result")).toHaveCount(0);
});

test("mobile navigation closes after choosing a section", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only navigation");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Our expertise" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});

test("reduced-motion preference keeps content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".about-statement")).toContainText("We’re a team");
  expect(
    await page
      .locator(".about-statement span")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    ),
  ).toBe(false);
});
