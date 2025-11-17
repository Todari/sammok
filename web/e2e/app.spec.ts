import { test, expect } from '@playwright/test';

test.describe('Sammok board', () => {
  test('allows selecting a hand stone and placing it on the board', async ({
    page,
  }) => {
    await page.goto('/');
    const firstCard = page.locator('section:has-text("플레이어 핸드") button').first();
    await firstCard.click();
    const targetCell = page.getByRole('gridcell').first();
    await targetCell.click();
    await expect(
      page.locator('section:has-text("로그") li').first(),
    ).toContainText('P1');
  });
});

