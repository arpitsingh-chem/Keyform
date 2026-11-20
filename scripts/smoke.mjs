/**
 * Browser smoke check.
 *
 * Runs the real production/dev server UI in Chromium, walks the core flows and
 * records what actually happened. It is deliberately explicit about failures:
 * every step is reported, and console/page errors fail the run.
 *
 * Usage: node scripts/smoke.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://127.0.0.1:5173';
const results = [];
const consoleErrors = [];
const shots = 'qa/screenshots';

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}


const seenOnce = new Set();
function recordOnFirst(key, name, ok) {
  if (seenOnce.has(String(key))) return;
  seenOnce.add(String(key));
  record(name, ok);
}

async function expectedByPromptCollected(page, map) {
  for (let step = 0; step < 20; step += 1) {
    if ((await page.getByText(/Session complete/i).count()) > 0) return;
    await page.locator('.feedback').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    const prompt = (await page.locator('.question-text').innerText()).trim();
    const field = page.getByLabel(/Type the correct answer|Type the letter/i);
    if (!(await field.evaluate((el) => el.readOnly))) {
      await field.fill('zzz');
      await field.press('Enter');
      await page.locator('.feedback').waitFor();
    }
    const expected = (await page.locator('.answer-line strong').innerText()).trim();
    map.set(prompt, expected);
    await page.getByRole('button', { name: /Next question|Finish session/ }).click();
    await page.waitForTimeout(80);
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', (error) => consoleErrors.push(String(error)));

await mkdir(shots, { recursive: true });

try {
  /* ---- introduction ---- */
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  record('introduction renders', await page.getByRole('heading', { level: 1 }).isVisible());
  record(
    'skip link present',
    (await page.getByRole('link', { name: 'Skip to content' }).count()) === 1,
  );
  record(
    'sample status disclosed',
    (await page.getByText(/None is an official question/i).count()) > 0,
  );
  await page.screenshot({ path: `${shots}/01-introduction-1440.png`, fullPage: true });

  /* ---- dashboard ---- */
  await page.getByRole('link', { name: /Open the workspace/i }).click();
  await page.waitForURL(/workspace/);
  record('dashboard route', page.url().includes('/workspace'));
  record(
    'headline metrics visible',
    (await page.getByText('Answered').first().isVisible()) &&
      (await page.getByText('Accuracy').first().isVisible()),
  );

  /* ---- practice: wrong answer, empty answer, correct answer ---- */
  await page.goto(`${base}/#/practice/CDS/vocabulary`, { waitUntil: 'networkidle' });
  const input = page.getByLabel(/Type the correct answer|Type the letter/i);
  await input.waitFor();
  record('answer input focused', await input.evaluate((el) => el === document.activeElement));

  await page.getByRole('button', { name: 'Submit answer' }).click();
  record(
    'empty submission is refused',
    (await page.getByRole('alert').count()) === 1,
  );

  await input.fill('definitely not the answer');
  await input.press('Enter');
  const feedback = page.locator('.feedback');
  await feedback.waitFor();
  record('wrong answer gives feedback', (await feedback.innerText()).includes('Not quite'));
  record('reason shown', (await feedback.innerText()).includes('does not match'));
  record(
    'answer is locked after submission',
    await page.getByLabel(/Type the correct answer|Type the letter/i).evaluate((el) => el.readOnly),
  );

  // Session 1: answer every question wrongly and record prompt -> expected answer.
  const expectedByPrompt = new Map();
  await expectedByPromptCollected(page, expectedByPrompt);
  record('session 1 completed', (await page.getByText(/Session complete/i).count()) > 0);

  // Session 2: answer the same bank correctly using different case and spacing.
  await page.getByRole('button', { name: 'New session' }).click();
  await page.locator('.feedback').waitFor({ state: 'detached' });
  let correctCount = 0;
  for (let step = 0; step < expectedByPrompt.size; step += 1) {
    await page.locator('.feedback').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    const prompt = (await page.locator('.question-text').innerText()).trim();
    const expected = expectedByPrompt.get(prompt);
    if (!expected) {
      record('session 2 question matched session 1', false, prompt.slice(0, 60));
      break;
    }
    const field = page.getByLabel(/Type the correct answer|Type the letter/i);
    recordOnFirst(step, 'next question resets the field', (await field.inputValue()) === '');
    await field.fill(`   ${expected.toUpperCase()}   `);
    await field.press('Enter');
    await page.locator('.feedback').waitFor();
    if ((await page.locator('.feedback').innerText()).includes('Correct')) correctCount += 1;
    await page.getByRole('button', { name: /Next question|Finish session/ }).click();
  }
  record(
    'case and whitespace tolerated on every item',
    correctCount === expectedByPrompt.size,
    `${correctCount}/${expectedByPrompt.size} accepted`,
  );

  /* ---- progress persistence ---- */
  await page.goto(`${base}/#/analytics`, { waitUntil: 'networkidle' });
  const attemptsMetric = await page.locator('.metric-value').first().innerText();
  record('attempts recorded in analytics', Number(attemptsMetric) >= 2, `value=${attemptsMetric}`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const afterReload = await page.locator('.metric-value').first().innerText();
  record(
    'attempts survive a reload (device storage)',
    afterReload === attemptsMetric,
    `before=${attemptsMetric} after=${afterReload}`,
  );

  /* ---- misc pages ---- */
  for (const [path, needle] of [
    ['/previous-years', 'Previous years and syllabus sources'],
    ['/exams', 'Exam tracks'],
    ['/grammar', 'Grammar and usage'],
    ['/vocabulary', 'Vocabulary'],
    ['/revision', 'Revision'],
    ['/mocks', 'Timed runs with deferred scoring'],
    ['/settings', 'Settings'],
  ]) {
    await page.goto(`${base}/#${path}`, { waitUntil: 'networkidle' });
    record(`${path} renders`, await page.getByRole('heading', { name: needle, exact: false }).first().isVisible());
  }

  /* ---- mock run: confirm dialog, omitted vs incorrect ---- */
  await page.goto(`${base}/#/mocks/CDS`, { waitUntil: 'networkidle' });
  record('mock timer visible', (await page.getByRole('timer').count()) === 1);
  const mockInput = page.getByLabel(/Type the correct answer|Type the letter/i);
  await mockInput.fill('placeholder answer');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Submit run' }).click();
  await page.getByText(/omitted/).first().waitFor();
  record('mock results separate omitted', (await page.getByText(/omitted/).count()) > 0);

  /* ---- dark theme ---- */
  await page.goto(`${base}/#/settings`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Dark' }).click();
  record(
    'dark theme applied',
    (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark',
  );
  await page.goto(`${base}/#/workspace`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${shots}/02-dashboard-dark-1440.png`, fullPage: true });
  await page.goto(`${base}/#/settings`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Light' }).click();

  /* ---- backup export / restore ---- */
  await page.goto(`${base}/#/settings`, { waitUntil: 'networkidle' });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download backup' }).click();
  const download = await downloadPromise;
  const nameOk = /^keyform-backup-\d{4}-\d{2}-\d{2}\.json$/.test(download.suggestedFilename());
  record('backup downloads with a dated name', nameOk, download.suggestedFilename());
  const backupPath = await download.path();
  const backup = JSON.parse(await readFile(backupPath, 'utf8'));
  record(
    'backup file is a valid Keyform backup',
    backup.format === 'keyform-backup' &&
      Array.isArray(backup.attempts) &&
      backup.attempts.length > 0 &&
      Array.isArray(backup.bookmarks),
    `${backup.attempts.length} attempts`,
  );

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('input[type="file"]').setInputFiles(backupPath);
  await page.getByText(/Backup restored/).first().waitFor({ timeout: 5000 });
  record('backup restores into the app', true);

  /* ---- hide-options recall mode ---- */
  await page.getByRole('checkbox').check();
  await page.goto(`${base}/#/practice/AFCAT/idioms`, { waitUntil: 'networkidle' });
  await page.getByText(/Options hidden/i).waitFor({ timeout: 5000 });
  record('options hidden when recall mode is on', (await page.locator('.options').count()) === 0);
  const hiddenInput = page.getByLabel(/Type the correct answer|Type the letter/i);
  await hiddenInput.fill('zzz');
  await hiddenInput.press('Enter');
  await page.locator('.options').first().waitFor({ timeout: 5000 });
  record('options revealed after submitting', (await page.locator('.option').count()) === 4);
  await page.goto(`${base}/#/settings`, { waitUntil: 'networkidle' });
  await page.getByRole('checkbox').uncheck();

  /* ---- mobile viewport ---- */
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 360, height: 780 });
  await mobile.goto(`${base}/#/workspace`, { waitUntil: 'networkidle' });
  const scrollWidth = await mobile.evaluate(() => document.documentElement.scrollWidth);
  record('no horizontal overflow at 360px', scrollWidth <= 361, `scrollWidth=${scrollWidth}`);
  record('mobile menu button present', await mobile.getByRole('button', { name: /Menu|Close/ }).isVisible());
  await mobile.screenshot({ path: `${shots}/03-dashboard-360.png`, fullPage: true });
  await mobile.goto(`${base}/#/practice/NDA/grammar`, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: `${shots}/04-practice-360.png`, fullPage: true });

  /* ---- 768 and 1920 ---- */
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${base}/#/workspace`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${shots}/05-dashboard-768.png`, fullPage: true });
  const tabletOverflow = await page.evaluate(() => document.documentElement.scrollWidth);
  record('no horizontal overflow at 768px', tabletOverflow <= 769, `scrollWidth=${tabletOverflow}`);

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${base}/#/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${shots}/06-introduction-1920.png`, fullPage: true });

  /* ---- unknown route ---- */
  await page.goto(`${base}/#/not-a-real-page`, { waitUntil: 'networkidle' });
  record('unknown route shows recovery', (await page.getByText('404').count()) > 0);

  record('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
} catch (error) {
  record('smoke run completed', false, String(error).slice(0, 300));
  await page.screenshot({ path: `${shots}/failure.png`, fullPage: true });
} finally {
  await browser.close();
}

const failed = results.filter((result) => !result.ok);
const report = {
  generatedAt: new Date().toISOString(),
  base,
  viewportChecks: ['1440x1000', '768x1024', '360x780', '1920x1080'],
  passed: results.length - failed.length,
  failed: failed.length,
  results,
  consoleErrors,
};
await writeFile('qa/smoke-report.json', JSON.stringify(report, null, 2));
console.log(`\n${report.passed} passed, ${report.failed} failed`);
process.exit(failed.length === 0 ? 0 : 1);
