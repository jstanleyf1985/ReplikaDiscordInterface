import React, { useState, useEffect } from 'react'
import OS from 'os'
import FS from 'fs-extra'
import Styled from 'styled-components'
import Alertify from 'alertifyjs'
import AppControls from './appcontrols'
import GlobalStyle from '../styles/globalStyles.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faStopCircle, faCogs } from '@fortawesome/free-solid-svg-icons'
import ReplikaInterface from './replikaInterface'
import launchInterface from './launchInterface'
import stopInterface from './stopInterface'
import ErrorFileCleanup from './errorFileCleanup'

import Config from './config'

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

// run once
ErrorFileCleanup()

const Dashboard = ():JSX.Element => {
  const [activeComponent, setActiveComponent] = useState('Dashboard')
  const [connectedStatus, setConnectedStatus] = useState('Disconnected')
  const [interfaceRunning, setInterfaceRunnning] = useState('Disconnected')
  const [interfaceConnected, setInterfaceConnected] = useState('Disconnected')
  const [configValid, setConfigValid] = useState('Invalid')
  const [stopBTNDisabled, setStopBTNDisabled] = useState(true)
  const [startBTNDisabled, setStartBTNDisabled] = useState(false)
  const [startInterfaceText, setStartInterfaceText] = useState('Start Interface')

  useEffect(() => {
    validateConfig(documentsPath, setConfigValid)
  }, [activeComponent])

  /** ************** Logic & Handlers */
  const handleActiveComponent = (newValue: string) => {
    // Run errorFileCleanupOnce upon launch
    ErrorFileCleanup()

    window.fetch('http://localhost:3001', { headers: { 'Access-Control-Allow-Origin': '*' }})
    .then(response => response.json())
    .then(data => {})
    .catch(err => 
      stopInterface(
        setStartBTNDisabled,
        setStartInterfaceText,
        setStopBTNDisabled,
        setInterfaceConnected
      ))
    setActiveComponent(`${newValue}`)
  }

  return (
    <InterfaceWrapper>
      <GlobalStyle />
      <AppControls />

      {
        activeComponent === 'Dashboard'
          ? <InterfaceForm>
            <ReplikaInterface />
            <InterfaceTitle>Replika Discord Interface</InterfaceTitle>
            <InterfaceStartBTN 
              borderStyle={interfaceConnected}
              onClick={(e) => {
                e.preventDefault();
                setStopBTNDisabled(false);
                launchInterface(
                  setStartBTNDisabled,
                  setStartInterfaceText,
                  setStopBTNDisabled,
                  setInterfaceConnected,
                  configValid
                )}}>
              <InterfaceFASpan>
                <InterfaceIconsDark icon={faPlayCircle} />
              </InterfaceFASpan>
              <InterfaceTextSpan>{startInterfaceText}</InterfaceTextSpan>
            </InterfaceStartBTN>
            <InterfaceStopBTN
              borderStyle={interfaceRunning}
              disabled={stopBTNDisabled}
              onClick={(e) => {
                e.preventDefault();
                stopInterface(
                  setStartBTNDisabled,
                  setStartInterfaceText,
                  setStopBTNDisabled,
                  setInterfaceConnected
                )
              }}>
              <InterfaceFASpan>
                <InterfaceIconsDark icon={faStopCircle} />
              </InterfaceFASpan>
              <InterfaceTextSpan>Stop Interface</InterfaceTextSpan>
            </InterfaceStopBTN>
            <InterfaceConfigBTN onClick={() => { handleActiveComponent('Configuration') }} borderStyle={configValid}>
              <InterfaceFASpan>
                <InterfaceIconsLight icon={faCogs} />
              </InterfaceFASpan>
              <InterfaceTextSpan>Configuration</InterfaceTextSpan>
            </InterfaceConfigBTN>
          </InterfaceForm>
          : null}

      {
        activeComponent === 'Configuration'
          ? <Config
            updateActiveComponent={(component: string) => { setActiveComponent(component) } }/> : null}
    </InterfaceWrapper>
  )
}

/** ************** COMPONENT LOGIC */
const documentsPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/Config.json`)
const validateConfig = (path: string, handleConfigValid: React.Dispatch<React.SetStateAction<string>>) => {
  FS.readJson(path)
    .then(packageObj => {
      let defaultsExist = 0
      const packageValues = []
      const defaultValues = ['Your email or phone number', 'Password', 'Discord bot token', 'Discord channel']

      packageValues.push(packageObj.ReplikaEmailOrPhone)
      packageValues.push(packageObj.ReplikaPassword)
      packageValues.push(packageObj.DiscordBotToken)
      packageValues.push(packageObj.DiscordChannel)

      // For each array item, check if it exists in defaultValues array, if any do, reject as invalid due to it containing default values
      for (let i = 0; i < packageValues.length; i++) {
        if (defaultValues.indexOf(packageValues[i]) !== -1) { defaultsExist++ }
      }

      // If defaults exist, leave red CSS border, else mark as green via updating state
      defaultsExist > 0 ? handleConfigValid('Invalid') : handleConfigValid('Valid')
    })
    .catch(err => {
      // Create default configuration if none is found
      FS.ensureFile(path)
        .then(() => { /* do nothing */ })
        .catch((err) => {
          createAlert('Error', `${err}`);
        })
    })
}

// Responsible for generalized alerts
const createAlert = (title: string, message: string) => {
  Alertify.alert(title, message, (e: React.ChangeEvent<HTMLInputElement>) => {})
}

/** ************** STYLES */
const InterfaceWrapper = Styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0;
  min-height: 100%;
  align-content: center;
  align-items: center;
  justify-content: center;
  @media (min-width: 1px) and (max-width: 575px) {
    margin-top: 0%;
    padding-top: 0%;
  }
`

const InterfaceTitle = Styled.h1`
  display: flex;
  flex-direction: column;
  height: 5%;
  width: 90%;
  padding: 0;
  min-height: 5%;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #f1f1f1;
  border-bottom: 1px solid grey;
  padding-bottom: 1%;
  font-smooth: always;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: auto;
  @media (min-width: 1px) and (max-width: 575px) {
    margin-top: 0%;
    padding-top: 0%;
  }
`

const InterfaceForm = Styled.form`
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 800px;
  height: 70%;
  align-items: center;
  justify-content: center;
  flex-grow: 10;
  @media (min-width: 1px) and (max-width: 575px) {
    width: 95%;
    justify-content: start;
    padding-top: 20%;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 80%;
  };
  @media (min-width: 768px) and (max-width: 1199px) {
    width: 60%
  };
  @media (min-width: 1200px) {
    width: 40%
  };
  @media (min-width: 768px) and (max-width: 991px) {
    width: 50%;
  };
`

const InterfaceStartBTN = Styled.button`
  width: 90%;
  background-color: #f1f1f1;
  color: #333;
  border-radius: 0.2rem;
  height: 10%;
  font-size: 1rem;
  border: 1px solid #333;
  margin: 1% auto;
  display: flex;
  justify-content: center;
  -webkit-app-region: no-drag;
  border-left: 10px solid ${(props: {borderStyle: string}) => props.borderStyle === 'Disconnected' ? '#600' : '#060'} !important;
  &:hover {
    background-color: #cfcfcf;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 0px 0px 10px rgba(150, 150, 150, 0.5);
  };
  &:active {
    background-color: #afafaf;
  }
  @media (min-width: 1px) and (max-width: 575px) {
    margin-top: 0;
  };
  @media (min-height: 1px) and (max-height: 500px) {
    height: 50px;
  }
`

const InterfaceStopBTN = Styled.button`
  width: 90%;
  background-color: #f1f1f1;
  color: #333;
  border-radius: 0.2rem;
  height: 10%;
  font-size: 1rem;
  border: 1px solid #333;
  margin: 1% auto;
  display: flex;
  justify-content: center;
  -webkit-app-region: no-drag;
  border-left: 10px solid ${(props: {borderStyle: string}) => props.borderStyle === 'Disconnected' ? '#600' : '#060'} !important;
  &:hover {
    background-color: #cfcfcf;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 0px 0px 10px rgba(150, 150, 150, 0.5);
  };
  &:active {
    background-color: #afafaf;
  }
  @media (min-height: 1px) and (max-height: 500px) {
    height: 50px;
  }
`

const InterfaceConfigBTN = Styled.button`
  width: 90%;
  background-color: #005a8d;
  color: #f1f1f1;
  border-radius: 0.2rem;
  height: 10%;
  font-size: 1.2rem;
  border: 1px solid #333;
  margin: 1% auto;
  display: flex;
  justify-content: center;
  display: flex;
  flex-direction: row;
  -webkit-app-region: no-drag;
  border-left: 10px solid ${(props: {borderStyle: string}) => props.borderStyle === 'Invalid' ? '#600' : '#060'} !important;
  &:hover {
    background-color: #00395a;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 0px 0px 10px rgba(150, 150, 150, 0.5);
  };
  &:active {
    background-color: #002849;
  }
  @media (min-height: 1px) and (max-height: 500px) {
    height: 50px;
  }
`

const InterfaceFASpan = Styled.span`
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  width: 30%;
  @media (min-width: 1px) and (max-width: 575px) {
    width: 40%
    justify-content: end;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 35%
    justify-content: star;
  };
  @media (min-width: 768px) and (max-width: 1199px) {
    width: 45%
    justify-content: start;
    position: relative;
    right: 5%;
  };
  @media (min-width: 1200px) {
    width: 50%
    justify-content: start;
    position: relative;
    right: 10%;
  };
`

const InterfaceTextSpan = Styled.span`
  text-align: center;
  font-size: 1.5rem;
  display: flex;
  width: 50%;
  &:hover {
    cursor: pointer;
  };
  @media (min-width: 1px) and (max-width: 575px) {
    width: 60%;
    justify-content: start;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 65%;
    justify-content: start;
  };
  @media (min-width: 768px) and (max-width: 1199px) {
    width: 55%;
    justify-content: start;
  };
  @media (min-width: 1200px)  {
    width: 50%;
    justify-content: start;
  };
`

const InterfaceIconsDark = Styled(FontAwesomeIcon)`
  display: flex;
  color: #222 !important;
`
const InterfaceIconsLight = Styled(FontAwesomeIcon)`
  display: flex;
  color: #f1f1f1 !important;
`

export default Dashboard
