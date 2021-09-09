const OS = require('os');
const FS = require('fs-extra');
const Alertify = require('alertifyjs');
const Kill = require('kill-port');

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

const ErrorCheckService = (
  setStartBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setStartInterfaceText: React.Dispatch<React.SetStateAction<string>>,
  setStopBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setInterfaceConnected: React.Dispatch<React.SetStateAction<string>>
) => {
  const errorFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`);

  // Create file if one does not exist
  FS.ensureFile(errorFilePath);

  const resetFormButtons = () => {
    setStartBTNDisabled(false);
    setStopBTNDisabled(true);
    setStartInterfaceText('Start Interface');
    setInterfaceConnected('Disconnected');
    Kill('3001', 'tcp')
      .catch((err: any) => { /* createAlert('Error', `${err}` ) */ })
  }

  let checkingErrors = setInterval(() => {
    FS.ensureFile(errorFilePath);
    FS.readFile(errorFilePath, 'utf8', (err: string, data: string) => {
      if(err) { /* console.log(err) */ }
      if(data && data.length > 0) {
        if(data.indexOf("TypeError: Cannot read property 'replace' of undefined") !== -1) {
          clearInterval(checkingErrors);
          resetFormButtons();
          createAlert('Notice', 'Unable to locate bot by provided name. Check settings and try again.');
        }
      }
    });
  }, 2000)
}

// Helper function for creating alerts
const createAlert = (title: string, message: string) => {
  Alertify.alert(title, message, () => { /* do nothing */ })
}

export default ErrorCheckService;