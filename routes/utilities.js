const OS = require ('os');
const FS = require('fs-extra');

// Helper Function for creating general error log entries
const createGeneralErrorMSG = (err) => {
  const errorMSGArray = [];
  const errorFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`);
  
  let errString = err.toString();
  // This check is used to create only 1 error in the log file per error type, per program run cycle (until closed)
  // This prevents spamming error messages inside the errorlogfile and creating an excessively log error file while still providing
  // a reason for the failure / issues that can be checked
  if(errorMSGArray.indexOf(errString) === -1) {
    errorMSGArray.push(errString);
    FS.appendFile(errorFilePath, `${err}\r${new Date(+ new Date())}\r--------\r\r`);
  }
}

const clickElement = (page, selector, wordToMatch) => {
  // wordToMatch is optional, used for non upvote/downvote features
  page.$$eval(`${selector}`, elements => elements.map(el => el.textContent)
  ).then((elems) => {
    page.click(`:nth-match(${selector}, ${elems.length})`, { force: true });
    page.click(`:nth-match(${selector}, ${elems.length})`, { force: true });

    switch(wordToMatch) {
      case 'None':
        break;
      case 'Love':
        page.click(`span:has-text("Love")`, { force: true });
        break;
      case 'Funny':
        page.click(`span:has-text("Funny")`, { force: true });
        break;
      case 'Meaningless':
        page.click(`span:has-text("Meaningless")`, { force: true });
        break;
      case 'Offensive':
        page.click(`span:has-text("Offensive")`, { force: true });
        break;
    }

    page.click(`#send-message-textarea`);
  }).catch(err => {createGeneralErrorMSG(err)});
}

const resetClickElement = (page) => {
  page.$$eval('[aria-pressed="true"]', elements => elements.map(el => el.textContent.trim())
  ).then((elems) => {
    page.click(`:nth-match([aria-pressed="true"], ${elems.length})`, { force: true });
    page.click(`:nth-match([aria-pressed="true"], ${elems.length})`, { force: true });
    page.click(`#send-message-textarea`);
  }).catch((err) => {createGeneralErrorMSG(err)})
}

module.exports = {
  createGeneralErrorMSG: createGeneralErrorMSG,
  clickElement: clickElement,
  resetClickElement: resetClickElement
}