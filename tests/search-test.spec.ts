import { test, expect } from '@playwright/test';

const data = [
    {
        name: 'Njuskalo',
        url: 'https://www.njuskalo.hr/',
        search: 'Audi',
        category: 'Audi',
        yearManufacturedMin: 2015,
        yearManufacturedMax: 2019,
        mileageMax: 200000
    },
    {
        name: 'Bolha',
        url: 'https://www.bolha.com/',
        search: 'BMW',
        category: 'BMW',
        yearManufacturedMin: 2018,
        yearManufacturedMax: 2022,
        mileageMax: 100000
    }
]


for(const site of data){
  test(`search-test: ${site.name}`, async ({ page }) => {
    await page.goto(site.url);
    const agreeButton = page.locator('#didomi-notice-agree-button');

    if (await agreeButton.isVisible()) {
      await agreeButton.click();
    }

    const inputField = page.locator('#keywords');
    await inputField.fill(site.search);
        
    const button = page.getByRole('button', { name: 'Kategorije' });
    expect(button).toBeVisible({ timeout: 5000 });
    await button.click(); 
    await page.getByRole('option', { name: site.category, exact: true }).locator('span').click();
        
    await page.locator('[id="yearManufactured[min]"]').selectOption(site.yearManufacturedMax.toString());
    await page.locator('[id="yearManufactured[max]"]').selectOption(site.yearManufacturedMax.toString());        
    await page.locator('input[name="mileage[max]"]').fill(site.mileageMax.toString());

    const submitButton = page.locator('#submitButton');
    await submitButton.click();

    const items = page.locator('.EntityList-items li');
    const noResults = page.locator('div.brdr_top.ad_item');

    const count = await items.count();
        
    if(count == 0){
        expect(noResults).toBeVisible;
    } else {
      expect(count).toBeGreaterThan(0);
      const descriptions = await page.locator('.entity-description-main').allTextContents();
               
      for (const description of descriptions) { 
        const lines = description.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lines.length < 3) continue; //not a valid ad -> skip

        // mileage
        const mileageLine = lines[0];
        const mileageParts = mileageLine.split(',');
        
        const mileageStr = mileageParts[1].replace('km', '').trim();
        const mileage = parseInt(mileageStr, 10);

        // year
        const yearLine = lines[1];
        const yearStr = yearLine.split(':')[1].replace('.', '').trim();
        const year = parseInt(yearStr, 10);
        
        expect(mileage).toBeLessThanOrEqual(site.mileageMax);
        expect(year).toBeGreaterThanOrEqual(site.yearManufacturedMin);
        expect(year).toBeLessThanOrEqual(site.yearManufacturedMax);
      }
    }
  });
}