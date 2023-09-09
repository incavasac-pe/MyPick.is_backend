const express = require("express");
 
const router = express.Router();
const puppeteer = require('puppeteer');

router.get("/scrapping", async function (req, res) {
	const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://developer.chrome.com/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Type into search box
  await page.type('.search-box__input', 'automate beyond recorder');

  // Wait and click on first result
  const searchResultSelector = '.search-box__link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
})
router.get('/list_products', async (req, res) => {
  // Configuración de Puppeteer
 
  

         //launch browser in headless mode
   const browser = await pt.launch()
   //browser new page
   const page = await browser.newPage()
   //launch URL
   await page.goto('https://www.amazon.com/s?k=Adidas+racer+tr21')
   //identify element
   const f = await page.$("[class='a-offscreen']")
   //obtain text
   const text = await (await f.getProperty('textContent')).jsonValue() 
   
   console.log("El precio del productos es is: " + text)
});
module.exports = router;