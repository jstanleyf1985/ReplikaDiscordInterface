import FS from 'fs-extra'
import OS from 'os'
import Alertify from 'alertifyjs'
import React from 'react'
import kill from 'kill-port'
import { exec } from 'child_process'
import ErrorCheckService from './errorCheckService';

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

const handleLaunchInterface = (
        setStartBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
        setStartInterfaceText: React.Dispatch<React.SetStateAction<string>>,
        setStopBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>,
        setInterfaceConnected: React.Dispatch<React.SetStateAction<string>>,
        configValid: string
        ) => {
      
      const errorLogPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`)
      const errorFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LoginErrors.txt`);
      const loginSuccessFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LoginSuccess.txt`)
      const testFilePath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/test.txt`)
    try {
      // Only launch is config is valid
      if(configValid !== 'Invalid') {
        let LoginReadErrorExist = {state: false, message: ''}; // Set initial error state for login file read errors
        let LoginErrorExist = {state: false, message: ''}; // Set initial error state for login errors detected
        let connectionTestCounter = 0; // Set initial counter value for connection check attempt count

        // Start server if it is not running
        const launchServer = exec('node server.js', function (error, stdout, stderr) {
          if (error) {
            if((error.toString()).indexOf('EADDRINUSE') !== -1) { /* console.log(error) */ }
          }

          console.log(stdout);
          console.log(stderr);
        });

        launchServer.on('exit', () => { /* do nothing when complete */ })

        // Trigger server to launch replika-discord interface
        window.fetch('http://localhost:3001/replikadata')
        .then((response) => {
          // Check response for OK status
          !response.ok ? createGeneralErrorMSG('Error in retreiving data on fetch', errorLogPath) : response;
        })
        .catch(err => {createGeneralErrorMSG(err, errorLogPath)})

        // Set startBTN and stopBTN states based on whether or not the server is running / in progress
        // Set initial state as startBTN as disabled and stop as enable
        setStartBTNDisabled(true);
        setStartInterfaceText('Connecting');
        setStopBTNDisabled(false);
        
        // Firstly remove error file before creating checks
        FS.removeSync(errorFilePath);
        FS.removeSync(loginSuccessFilePath);
        FS.ensureFileSync(errorFilePath);
        FS.ensureFileSync(loginSuccessFilePath);

        // Check the error logs to determine if errors were generated
        let checkForErrors = () => {
          // If errors were found, display them and reset buttons to allow user to try again
          // Set initial "checking" state when attempting to connect
          FS.readFile(errorFilePath, 'utf8', (err, data) => {
            if(err) {createGeneralErrorMSG(err, errorLogPath)}
            if(data && data.length > 0) {
              LoginErrorExist.state = true;
              LoginErrorExist.message = data.toString(); /* Handle error via loop break based on variable */
            } else {
              // Run success second, to make sure no errors were found before setting error state
              // If not in an else statement, this would be overwritten if success was found within the same iteration
              FS.readFile(loginSuccessFilePath, 'utf8', (err, data) => {
                if(err) {createGeneralErrorMSG(err, errorLogPath)}
                if(data && data.length > 0) {
                  LoginErrorExist.state = false;
                  LoginErrorExist.message = 'Success';
                }
              })
            }
          })
        }

        const resetFormButtons = () => {
          setStartBTNDisabled(false);
          setStopBTNDisabled(true);
          setStartInterfaceText('Start Interface');
          kill('3001', 'tcp')
          .catch((err: any) => { createAlert('Error', `${err}`)})
        }

        let checkConnectionStatus = setInterval(() => {
          // Firstly check for errors as LoginReadError and LoginErrorExist depend on it
          checkForErrors();

          // Check if success message was created firstly, if so do not throw error messages or reset buttons
          if(LoginErrorExist.state) {
            clearInterval(checkConnectionStatus);
            createAlert('Error', `${LoginErrorExist.message}`);
            resetFormButtons();
          }

          if(LoginErrorExist.state == false && LoginErrorExist.message.indexOf('Success') !== -1) {
            clearInterval(checkConnectionStatus);
            connectionTestCounter = 99; // End loop as successful when incremented later down the logic
          }

          if(LoginReadErrorExist.state) {
            clearInterval(checkConnectionStatus);
            createAlert('Error', `${LoginReadErrorExist.message}`);
            resetFormButtons();
          }

          connectionTestCounter++;

          if(connectionTestCounter > 99) {
            setStartInterfaceText('Connected');
            setInterfaceConnected('Connected');
            clearInterval(checkConnectionStatus);
          }
        }, 1000)

        // Lastly run a looping check for errors - specifically invalid bot names
        ErrorCheckService(setStartBTNDisabled,setStartInterfaceText,setStopBTNDisabled,setInterfaceConnected);
      } else { createAlert('Notification', 'You must have a <b>valid (non-default)</b> configuration before starting the interface. Select configuration, fill out your information and save.')}
    } catch(err) {createGeneralErrorMSG(err, errorLogPath)}
  }

  // Helper Function for creating general error log entries
  const createGeneralErrorMSG = (err: unknown, path: string) => {
    FS.appendFile(path, `${err}\r${new Date(+ new Date())}\r--------\r\r`); // Checked
  }

  // Helper function for creating alerts
  const createAlert = (title: string, message: string) => {
    Alertify.alert(title, message, () => { /* do nothing */ })
    .set({
      onshow: null,
      onclose: null
      })
    }

  export default handleLaunchInterface