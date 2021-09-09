import FS from 'fs-extra'
import OS from 'os'
import kill from 'kill-port'
import Alertify from 'alertifyjs'

const ErrorFileCleanup = () => {
  try {
    const errorLogPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/ErrorLog.json`)
    const loginErrorLogPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/LoginErrors.txt`)
    const pathList = [errorLogPath, loginErrorLogPath];

    // Remove each file
    pathList.forEach((path) => {
      FS.remove(path)
        .then((
        ) => {})
        .catch((err) => {createAlert('Error', `${err}`)})
    })

    // Remove running server instances on port number 3001
    kill('3001', 'tcp').then(() => { })

  } catch(err) {createAlert('Error', `${err}`)}
}

// Helper function for creating alerts
const createAlert = (title: string, message: string) => {
  Alertify.alert(title, message, () => { /* do nothing */ })
}

export default ErrorFileCleanup