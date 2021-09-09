import Alertify from 'alertifyjs'
import React from 'react'
import kill from 'kill-port'
import OS from 'os'
import FS from 'fs-extra'

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

const stopInterface = (
  setStartBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setStartInterfaceText: React.Dispatch<React.SetStateAction<string>>,
  setStopBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setInterfaceConnected: React.Dispatch<React.SetStateAction<string>>
) => {
  const errorLogPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`);

  try {
    setStartBTNDisabled(false);
    setStopBTNDisabled(true);
    setStartInterfaceText('Start Interface');
    setInterfaceConnected('Disconnected')
    kill('3001', 'tcp')
      .then(() => {  })
      .catch((err: any) => { createAlert('Error', `${err}`)})
  } catch(err) { createGeneralErrorMSG(err, errorLogPath) }
}

// Helper function for creating alerts
const createAlert = (title: string, message: string) => {
  Alertify.alert(title, message, () => { /* do nothing */ })
}

// Helper Function for creating general error log entries
const createGeneralErrorMSG = (err: unknown, path: string) => {
  FS.appendFile(path, `${err}\r${new Date(+ new Date())}\r--------\r\r`); // Checked
}

export default stopInterface