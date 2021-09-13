const { chromium } = require('playwright'); // Responsible for handling ReplikaWeb data retrieval
const path = require('path');
const OS = require('os');
const FS = require('fs-extra');
const Discord = require('discord.js');
const Client = new Discord.Client();
const { createGeneralErrorMSG } = require('./utilities');
const DiscordBot = require('./startDiscordBot');

const userRoutes = (app, FS) => {
  const lastMSGPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LastMSG.json`);
  const configFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/Config.json`);
  const testFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/test.txt`);
  const generalErrorFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`);
  const loginErrorFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LoginErrors.txt`);
  const loginSuccessFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LoginSuccess.txt`);
  const errorMSGArray = []; // Used to prevent infinite spamming error messages file creation by checking if the error exists before posting a new one in the error file
  const loginErrMSGArray = []; // Read above - hint, this one is used for login errors instead of general errors

  // Run continous updates, fetching data from Replika

  app.get('/replikadata', (req, res) => {
    // Read lastReplikaMSG to avoid creating duplicates of the last message in Discord
    FS.readJson(configFilePath)
    .then(data => {
      let replikaConfigData = [data.ReplikaEmailOrPhone, data.ReplikaPassword, data.DiscordBotToken, data.DiscordChannel];
      let replikaDefaultConfigChecks = [false, false, false, false];
      let replikaDefaultValues = true;
      let loginErrStrings = [
        'Sorry, there is no Replika with this email',
        'Please enter an email or a phone number',
        'Invalid password'
      ]

      data.ReplikaEmailOrPhone === 'Your email or phone number' ? replikaDefaultConfigChecks[0] = true : null;
      data.ReplikaPassword === 'Password' ? replikaDefaultConfigChecks[1] = true : null;
      data.DiscordBotToken === 'Discord bot token' ? replikaDefaultConfigChecks[2] = true : null;
      data.DiscordChannel === 'Discord channel' ? replikaDefaultConfigChecks[3] = true : null;

      replikaDefaultConfigChecks.indexOf(false) === -1 ? replikaDefaultValues = false : replikaDefaultValues = true;
      if(replikaDefaultValues == true) {
        // Default values have been changed, ready to attempt to connect
        (async () => {
          const browser = await chromium.launch({ headless: true });
          const page = await browser.newPage();

          let lastMSG = '';
          let username = String(data.ReplikaEmailOrPhone).trim();
          let password = String(data.ReplikaPassword).trim();
        
          await page.goto('https://my.replika.ai/login', {timeout: 10000})
            .catch((err) => {createLoginErrorMSG(err, loginErrorFilePath)})
          await page.click('#emailOrPhone', { timeout: 30000 })
            .catch((err) => { createLoginErrorMSG(err, loginErrorFilePath)})
          await page.keyboard.type(`${username}`);
          await page.click('[data-testid="login-next-button"]')
            .catch((err) => { createLoginErrorMSG(err, loginErrorFilePath)})
          await page.click('#login-password', { timeout: 30000 })
            .catch((err) => { createLoginErrorMSG(err, loginErrorFilePath)})
          await page.keyboard.type(`${password}`);
          await page.click('[data-testid="login-next-button"]', { timeout: 30000 })
            .catch((err) => { createLoginErrorMSG(err, loginErrorFilePath)})
          
          // This may or may not be present, depending on whether or not its the 1st time logged in for the day
          await page.click('[data-testid="gdpr-accept-button"]', { timeout: 30000 })
           .catch((err) => { createGeneralErrorMSG(err, generalErrorFilePath)})
          
          // Login to Discord using bot credentials, run this before page.click to catch errors
          Client.login(String(data.DiscordBotToken).trim())
          .then(() => {
            page.click('#send-message-textarea', { timeout: 30000 })
            .then(() => {
                // Successfully ran without errors, create a "success" text in the error file to be picked up
                // on "Success" in LoginErrors.json file, update buttons to indicate success
                FS.writeFileSync(loginSuccessFilePath, 'Success');

                // Repeat checks - looking for new messages that are not the previous message
                setInterval(() => {
                  // get list of comments created by replika
                  page.$$eval('[data-author="replika"]', elements => elements.map(el => el.textContent.trim())
                  ).then((elems) => {
                    if(lastMSG !== elems[elems.length - 1] && elems[elems.length - 1] !== '') {
                      // If the last MSG is not the same as the previous MSG, send an update to discord from replika
                      // Remove new lines, leading/trailing spaces
                      lastMSG = elems[elems.length - 1];

                      // Send messages back to discord
                      let discordIDFromURL = req.url.replace('/', '');

                      // Make sure the channel is not 'undefined' before posting
                      // This happens when the URL changes before the next interval iteration
                      if(Client.channels.cache.get(discordIDFromURL)) {
                        Client.channels.cache.get(discordIDFromURL).send(lastMSG);
                        Client.channels.cache.get(discordIDFromURL).stopTyping();
                      }
                    }
                  }).catch((err) => {createGeneralErrorMSG(err)})

                  // Listen for "Lets draw" events and press skip immediately as you cannot draw in discord
                  page.waitForSelector('button[class*="SkipButton"]', { timeout: 95 })
                  .then(() => { page.click('button[class*="SkipButton"]')})
                  .catch(err => { /* show nothing */ })
                  
                }, 100);

                DiscordBot(page, Client, req);
            }).catch((err) => { createLoginErrorMSG(err, loginErrorFilePath)})
          })
          .catch((err) => {createLoginErrorMSG(err, loginErrorFilePath)})
        })();
      }
    })
    .catch(err => {createGeneralErrorMSG(err)})
  });

  const createLoginErrorMSG = (err, filePath) => {
    let errString = err.toString();

    // This check is used to create only 1 error in the log file per error type, per program run cycle (until closed)
    // This prevents spamming error messages inside the errorlogfile and creating an excessively log error file while still providing
    // a reason for the failure / issues that can be checked
    if(loginErrMSGArray.indexOf(errString) === -1) {
      loginErrMSGArray.push(errString);

      // If timeout occurs on a selector, the previous selector experienced an issue
      let loginErrorMessageTXT = '';

      for(let x = 0; x < 1; x++) {
        // run once, - on purpose, break is the important part of this code to prevent overwriting the errormessage
        if(errString.indexOf('#emailOrPhone') !== -1) {loginErrorMessageTXT = 'There was a problem reaching the Replika website'; break;}
        if(errString.indexOf('[data-testid="login-next-button"]') !== -1) {loginErrorMessageTXT = 'There was a problem loading Replika website contents'; break;}
        if(errString.indexOf('#login-password') !== -1) {loginErrorMessageTXT = 'Invalid username/email'; break;}
        if(errString.indexOf('#send-message-textarea') !== -1) {loginErrorMessageTXT = 'Invalid password'; break;}
        if(errString.indexOf('[TOKEN_INVALID]') !== -1) {loginErrorMessageTXT = 'Invalid Discord Bot Token'; break;}
      }

      // Create error file, this will be picked up and checked on by the GUI application if not empty
      FS.outputFile(filePath, loginErrorMessageTXT)
      .catch(err => {createGeneralErrorMSG(err)})
    }
  }
}



module.exports = userRoutes;