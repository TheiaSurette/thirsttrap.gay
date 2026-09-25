import { test, expect } from '@playwright/test';

test('featured event, ordinary scroll, pause control, and old event links', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'After Hours', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Get tickets', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Past party', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Pause background motion' }).click();
  await expect(
    page.getByRole('button', { name: 'Resume background motion' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page
    .getByRole('link', { name: /Spill the Tea/ })
    .scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: /Spill the Tea/ })).toBeVisible();
  await page.goto('/events/past-party');
  await expect(page.getByRole('status')).toContainText('This event has ended');
  await expect(
    page.getByRole('link', { name: 'Tickets', exact: true }),
  ).toHaveCount(0);
  await page.goto('/events/draft-party');
  await expect(page.getByText('This page could not be found.')).toBeVisible();
});

test('empty and one-event states do not show placeholder cards', async ({
  page,
}) => {
  await page.goto('/?fixture=empty');
  await expect(
    page.getByRole('heading', { name: 'The next party is in the works.' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'More upcoming events' }),
  ).toHaveCount(0);
  await page.goto('/?fixture=one');
  await expect(
    page.getByRole('heading', { name: 'After Hours' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'More upcoming events' }),
  ).toHaveCount(0);
});

for (const scenario of ['portrait', 'landscape', 'long']) {
  test(`${scenario} artwork preserves proportions and fits the viewport`, async ({
    page,
  }) => {
    await page.goto(`/?fixture=${scenario}`);
    const flyer = page.getByRole('img', { name: `${scenario} test flyer` });
    await expect(flyer).toBeVisible();
    const dimensions = await flyer.evaluate((image) => {
      const node = image as HTMLImageElement;
      return {
        fit: getComputedStyle(node).objectFit,
        naturalWidth: node.naturalWidth,
        naturalHeight: node.naturalHeight,
      };
    });
    expect(dimensions.fit).toBe('contain');
    expect(dimensions.naturalWidth).toBeGreaterThan(0);
    expect(dimensions.naturalHeight).toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.querySelector('main')!.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

async function introduction(
  page: import('@playwright/test').Page,
  contact = '@local-test',
) {
  await page.goto('/get-involved');
  await page
    .getByLabel('Name, stage name, or business name *', { exact: true })
    .fill('Local test applicant');
  await page
    .getByLabel('How can we contact you? *', { exact: true })
    .fill(contact);
}

test('validation, selected role groups, and back/edit preserve answers', async ({
  page,
}) => {
  await page.goto('/get-involved');
  await page.getByRole('button', { name: 'Continue →' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'A few things need your attention.',
  );
  await expect(
    page.getByLabel('Name, stage name, or business name *', { exact: true }),
  ).toHaveAttribute('aria-invalid', 'true');
  await introduction(page);
  for (const role of ['DJ', 'Drag performer', 'Vendor', 'Volunteer'])
    await page.getByRole('checkbox', { name: role, exact: true }).check();
  await page.getByRole('button', { name: 'Continue →' }).click();
  await page
    .getByLabel('Music and specialties *', { exact: true })
    .fill('House');
  await page.getByLabel('Performance style *', { exact: true }).fill('Comedy');
  await page
    .getByLabel('Products you make or sell *', { exact: true })
    .fill('Art');
  await page
    .getByLabel('Experience or interests *', { exact: true })
    .fill('Happy to learn');
  await page.getByRole('checkbox', { name: 'Other', exact: true }).check();
  await page
    .getByRole('button', { name: 'Send application', exact: true })
    .click();
  await expect(
    page.getByLabel('Tell us about your other preference *', { exact: true }),
  ).toHaveAttribute('aria-invalid', 'true');
  await page
    .getByLabel('Tell us about your other preference *', { exact: true })
    .fill('Photography');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(
    page.getByLabel('Name, stage name, or business name *', { exact: true }),
  ).toHaveValue('Local test applicant');
  await page.getByRole('checkbox', { name: 'DJ', exact: true }).uncheck();
  await page.getByRole('button', { name: 'Continue →' }).click();
  await expect(
    page.getByLabel('Music and specialties *', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByLabel('Experience or interests *', { exact: true }),
  ).toHaveValue('Happy to learn');
  await page
    .getByRole('button', { name: 'Send application', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Application received.' }),
  ).toBeVisible();
});

test('retry preserves the same answers and then confirms delivery', async ({
  page,
}) => {
  await introduction(page, '@retry');
  await page.getByRole('checkbox', { name: 'Volunteer', exact: true }).check();
  await page.getByRole('button', { name: 'Continue →' }).click();
  await page
    .getByLabel('Experience or interests *', { exact: true })
    .fill('New to events');
  await page.getByRole('checkbox', { name: 'Door', exact: true }).check();
  await page
    .getByRole('button', { name: 'Send application', exact: true })
    .click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'We could not confirm delivery',
  );
  await expect(
    page.getByLabel('Experience or interests *', { exact: true }),
  ).toHaveValue('New to events');
  await expect(
    page.getByLabel('Experience or interests *', { exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('button', { name: 'Retry delivery', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Application received.' }),
  ).toBeVisible();
});

test('reduced motion is static and essential events render without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('button', { name: 'Pause background motion' }),
  ).toBeHidden();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
  await context.close();
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto('/');
  await expect(
    staticPage.getByRole('heading', { name: 'After Hours' }),
  ).toBeVisible();
  await expect(
    staticPage.getByRole('link', { name: 'Get tickets', exact: true }),
  ).toBeVisible();
  await noScript.close();
});
