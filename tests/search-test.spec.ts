import { test, expect } from '@playwright/test';

const data = [
    {
        name: 'Njuskalo',
        url: 'https://www.njuskalo.hr/',
        search: 'Audi',
        category: 'Audi',
        yearFrom: '2015',
        yearTo: '2019',
        distanceFrom: '0',
        distanceTo: '200000'
    },
    {
        name: 'Bolha',
        url: 'https://www.bolha.com/',
        search: 'BMW',
        category: 'BMW',
        yearFrom: '2018',
        yearTo: '2022',
        distanceFrom: '0',
        distanceTo: '100000'
    }
]


for(const site of data){
    test(`search-test: ${site.name}`, async ({ page }) => {
        await page.goto(site.url);

        
         const agreeButton = page.locator('#didomi-notice-agree-button');
        if (await agreeButton.isVisible({ timeout: 5000 })) {
        await agreeButton.click();
        }

        const inputField = page.locator('#keywords');

        await inputField.fill(site.search);
        
        const categoryButton = page.getByRole('button', { name: 'Kategorije' });
        await categoryButton.click();

       
const categoryOption = page.locator('li[role="option"]', { hasText: new RegExp(`^${site.category}$`) });
await categoryOption.click();

        await expect(page).toHaveURL("https://www.njuskalo.hr/auti/audi");

    });
}
