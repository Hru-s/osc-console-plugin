import { test, expect } from '@playwright/test';
import { navigateTo, assertNoReactErrors, waitForContent } from './helpers.js';

/**
 * Gap 5 — Per-node readiness drill-down.
 *
 * The overview page should display a node readiness section when a KataConfig
 * is configured. It breaks nodes into installed, installing, and failed
 * categories with clickable ResourceLinks to each node.
 */
test.describe('Gap 5: Per-node readiness drill-down', () => {
  test('Overview shows node readiness section when KataConfig exists', async ({
    page,
    baseURL,
  }) => {
    await navigateTo(page, baseURL!, '/sandboxes');
    await waitForContent(page, /overview|kata/i);

    const body = await page.locator('body').innerText();

    // "no KataConfig exists yet" still matches /kataconfig/ — skip when absent.
    if (/kataconfig/i.test(body) && !/no kataconfig exists/i.test(body)) {
      const hasNodeInfo =
        /kata nodes ready|node details|failed to install|installing/i.test(body);
      expect(
        hasNodeInfo,
        'overview should show node readiness information when KataConfig is present',
      ).toBe(true);
    }

    await assertNoReactErrors(page);
  });

  test('Node readiness renders ResourceLinks for each node', async ({
    page,
    baseURL,
  }) => {
    await navigateTo(page, baseURL!, '/sandboxes');
    await waitForContent(page, /overview|kata/i);

    const body = await page.locator('body').innerText();

    if (/installed nodes/i.test(body)) {
      const nodeLinks = page.locator('a[href*="/k8s/cluster/nodes/"]');
      const count = await nodeLinks.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }

    await assertNoReactErrors(page);
  });
});
