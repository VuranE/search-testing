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


        const filterButton = page.locator('li:has-text("Filtri"), li:has-text("Filteri")');
        if(await filterButton.isVisible()){
           await filterButton.click();
        }
        
        const minManufacturedYear = page.locator("#yearManufactured\\[min\\]");
    
        await minManufacturedYear.selectOption(site.yearFrom);

        const maxManufacturedYear = page.locator("#yearManufactured\\[max\\]");
        await maxManufacturedYear.selectOption(site.yearTo);

        const mileageMin = page.locator("#mileage\\[max\\]");
        await mileageMin.fill(site.distanceTo);

        const submitButton = page.locator('#submitButton');
        await submitButton.click();


        const items = page.locator('.EntityList-items li');
        const count = await items.count();
        await expect(count).toBeGreaterThan(0);
    });
}
