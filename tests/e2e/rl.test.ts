import { test, expect } from "@playwright/test";

test("sample", async ({ page, baseURL }) => {
  await page.goto(baseURL + "");
  await page.click("text=View sample");
  const description = page.locator("[data-test-id=description]");
  await expect(description).toContainText("On 12/8/2016, comagoosie");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("text=Convert Replay to JSON"),
  ]);

  expect(download.suggestedFilename()).toMatch(/^sample\.\w+\.json$/);
});

test("sample file", async ({ page, baseURL }) => {
  await page.goto(baseURL + "");
  await page.setInputFiles('input[type="file"]', "dev/sample.replay");
  const description = page.locator("[data-test-id=description]");
  await expect(description).toContainText("On 12/8/2016, comagoosie");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click("text=Convert Replay to JSON"),
  ]);

  expect(download.suggestedFilename()).toEqual("sample.json");
});
