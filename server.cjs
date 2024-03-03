const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const app = express();
const Title_list = require('./singers.cjs');
require('dotenv').config();





app.get('/runTest', async (req, res) => {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://accounts.spotify.com/en/login');
        // await driver.findElement(By.id('login-username')).sendKeys(id);
        // await driver.findElement(By.id('login-password')).sendKeys(pass);
        // await driver.findElement(By.id('login-button')).click();
        await driver.wait(async function() {
            const url = await driver.getCurrentUrl();
            return url.includes('https://accounts.spotify.com/en/status');
        }, 10000);
        let nextButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div[2]/div/div/button[2]')), 5000);
        await nextButton.click();

        // await driver.sleep(2000);
        let add_playlist = await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/div/div[2]/div[1]/nav/div[2]/div[1]/div[1]/header/div/span/button')),5000);
        await add_playlist.click();
        await driver.sleep(2000);
        await driver.findElement(By.xpath('//*[@id="context-menu"]/ul/li[1]/button')).click();
        await driver.sleep(2000);
        
        let likedSongs = await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/div/div[2]/div[1]/nav/div[2]/div[1]/div[2]/div[4]/div/div/div/div[2]/ul/div/div[2]/li/div/div[1]')), 5000);    
        await likedSongs.click();
        
        const songs = await driver.wait(until.elementLocated(By.xpath('//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[2]/main/section/div[1]/div[5]/div/span')),5000).getText();
        const n=songs.split(' ')[0];

        for(let i=0;i<n;i++){
            const song_div = await driver.wait(until.elementLocated(By.xpath(`//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[2]/main/section/div[4]/div/div[2]/div[2]/div[${i+1}]/div/div[2]/div/span/div`)),5000).getText();
            console.log(song_div);
            let singers = song_div.split(',');
            
            console.log(singers);
            if(i>2){
                const song_div_element = await driver.wait(until.elementLocated(By.xpath(`//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[2]/main/section/div[4]/div/div[2]/div[2]/div[${i-1}]`)),5000);
                driver.executeScript("arguments[0].scrollIntoView();", song_div_element);
            }
            if(singers.some(item => Title_list.includes(item))){
                let option_button = await driver.wait(until.elementLocated(By.xpath(`//*[@id="main"]/div/div[2]/div[3]/div[1]/div[2]/div[2]/div/div/div[2]/main/section/div[4]/div/div[2]/div[2]/div[${i+1}]/div/div[5]/button[2]`)), 5000);
                await option_button.click();
                await driver.sleep(2000);
                let playlist = await driver.wait(until.elementLocated(By.xpath('//*[@id="context-menu"]/ul/li[1]/button')), 5000);
                await playlist.click();
                await driver.sleep(2000);
                let button = await driver.executeScript('return document.querySelector("#context-menu").querySelectorAll("button[tabindex=\'-1\']")[3];');
                await driver.wait(until.elementIsVisible(button), 2000);
                await button.click();
                await driver.sleep(2000);
            }
            
        }


    }catch (error) {
        console.error(error);
        res.status(500).send({ error: error.toString() });
    }
     finally {
        // await driver.quit();
    }

});

app.listen(2000, () => console.log('Server running on port 2000'));