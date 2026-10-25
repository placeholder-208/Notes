import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // External CDN failures must not prevent reading or chapter navigation.
  await page.route('https://**/*', (route) => route.abort());
  await page.route('**/assets/js/firebase-config.json', (route) => route.fulfill({
    contentType: 'application/json', body: '{"enabled":false}',
  }));
});

test('all ten notes are listed and folders work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/Notes/');
  await expect(page.locator('.note-item a')).toHaveCount(10);
  const folder = page.locator('details').first();
  await expect(folder).toHaveAttribute('open', '');
  await folder.locator('summary').click();
  await expect(folder).not.toHaveAttribute('open', '');
  await page.goto('http://127.0.0.1:4173/Notes/notes/my-notes/UsingVScode.html');
  expect(await page.locator('#note-content > h2').count()).toBeGreaterThan(1);
  await expect(page.locator('#note-content > h2').first()).toBeVisible();
  await expect(page.locator('#note-content > h2').last()).toBeVisible();
  await context.close();
});

test('Firebase SDK failure leaves chapter navigation working', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/assets/js/firebase-config.json', (route) => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ apiKey: 'example', authDomain: 'example.firebaseapp.com', projectId: 'example', appId: 'example' }),
  }));
  await page.goto('notes/my-notes/UsingVScode.html');
  await expect(page.locator('#user-status')).toHaveText('评论暂不可用');
  await page.locator('#toc > ul > li > a').nth(1).click();
  await expect(page.locator('#chapter-1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('chapter links, original anchors and browser history work without Firebase or CDNs', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('notes/my-notes/UsingVScode.html');
  await expect(page.locator('.chapter:visible')).toHaveCount(1);
  const links = page.locator('#toc > ul > li > a');
  await links.nth(1).click();
  await expect(page).toHaveURL(/#chapter-1$/);
  await expect(page.locator('#chapter-1')).toBeVisible();
  const subLink = page.locator('#toc li.active .sub-toc a').first();
  const anchor = await subLink.getAttribute('href');
  await subLink.click();
  await expect(page).toHaveURL(new RegExp(`${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  await page.reload();
  await expect(page.locator('#chapter-1')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#chapter-1')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#chapter-0')).toBeVisible();
  await expect(page.locator('#user-status')).toHaveText('评论未启用');
  expect(errors).toEqual([]);
});

test('mobile navigation retains current chapter and adapts when resized', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('notes/my-notes/UsingVScode.html#chapter-2');
  await expect(page.locator('#chapter-2')).toBeVisible();
  const first = page.locator('#toc > ul > li').first();
  await expect(first).toBeHidden();
  const toggle = page.getByRole('button', { name: '展开目录' });
  await toggle.click();
  await expect(first).toBeVisible();
  await page.getByRole('button', { name: '收起目录' }).click();
  await expect(first).toBeHidden();
  await expect(page.locator('#toc > ul > li').nth(2)).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(first).toBeVisible();
  await expect(page.locator('.nav-controls')).toBeHidden();
  await expect(page.locator('.desktop-back a')).toHaveAttribute('href', '/Notes/');
});
