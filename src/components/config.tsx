import React, { useState, useEffect, SetStateAction, SyntheticEvent } from 'react'
import DOMPurify from 'dompurify'
import FS from 'fs-extra'
import OS from 'os'
import Alertify from 'alertifyjs'
import UseSound from 'use-sound'
import Styled, { keyframes } from 'styled-components'
import GlobalStyle from '../styles/globalStyles.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faKey, faIdCard, faTv, faRobot } from '@fortawesome/free-solid-svg-icons'

// Sounds
import SelectA from '../sounds/SelectA.mp3';

// Styles from Alertify
import 'alertifyjs/build/css/alertify.css'

const Config = (props: { updateActiveComponent: (arg0: string) => void }):JSX.Element => {
  const [RUsername, setRUsername] = useState('Your email or phone number')
  const [RPassword, setRPassword] = useState('Password')
  const [RToken, setRToken] = useState('Discord bot token')
  const [RChannel, setRChannel] = useState('Discord channel')
  const [RName, setRName] = useState('Discord bot name')
  const [ConfigFileExists, setConfigFileExists] = useState(false)
  const [ConfigFileContents] = useState({})
  const [ConfigBTNDisabled, setConfigBTNDisabled] = useState(false)

  // Sounds
  const [play, { stop }] = UseSound(SelectA)

  useEffect(() => {
    ensureFileExists(setConfigFileExists, documentsPath)
    readConfigFile(
      ConfigFileExists,
      ConfigFileContents,
      setRUsername,
      setRPassword,
      setRToken,
      setRChannel,
      setRName,
      documentsPath)
  }, [])

  return (
    <Container>
      <GlobalStyle />
      <ConfigForm>
        <ConfigFormGroup>
          <ConfigLabel>
            <FSpan onClick={(e) => {play();createAlert('Replika Email/Phone', 'This field is for your <b>Replika.AI account email address or phone</b>. Get one from <b>replika.ai</b> or by creating one using the app.')}}>
              <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
            </FSpan>
          </ConfigLabel>

          <ConfigInput
            type='text'
            onFocus={() => { if (RUsername === 'Your email or phone number') { setRUsername('') } } }
            onBlur={() => { if (RUsername === '') { setRUsername('Your email or phone number') } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRUsername(e.target.value) } }
            value={RUsername}
            placeholder={RUsername}>
          </ConfigInput>
        </ConfigFormGroup>

        <ConfigFormGroup>
          <ConfigLabel>
          <FSpan onClick={() => {play();createAlert('Replika Password', 'This field is for your <b>replika.ai account password</b>. Create one at <b>replika.ai</b> or in the app.')}}>
              <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
            </FSpan>
          </ConfigLabel>

          <ConfigInput
            type='password'
            onFocus={() => { if (RPassword === 'Password') { setRPassword('') } } }
            onBlur={() => { if (RPassword === '') { setRPassword('Password') } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRPassword(e.target.value) } }
            value={RPassword}
            placeholder={RPassword}>
          </ConfigInput>
        </ConfigFormGroup>

        <ConfigFormGroup>
          <ConfigLabel>
          <FSpan onClick={() => {play();createAlert('Discord Bot Token', 'This is the <b>Discord Bot Token</b> that gets created for you when you make a bot with Discord. <b>You can locate your bot once created at https://discord.com/developers/applications</b> . For information & instructions on creating your own bot on discord please visit (enter youtube URL here).')}}>
              <FontAwesomeIcon icon={faIdCard}></FontAwesomeIcon>
            </FSpan>
          </ConfigLabel>

          <ConfigInput
            type='password'
            onFocus={() => { if (RToken === 'Discord bot token') { setRToken('') } } }
            onBlur={() => { if (RToken === '') { setRToken('Discord bot token') } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRToken(e.target.value) } }
            value={RToken}
            placeholder={RToken}>
          </ConfigInput>
        </ConfigFormGroup>

        <ConfigFormGroup>
          <ConfigLabel>
          <FSpan onClick={() => {play();createAlert('Discord Channel', 'This field is for the <b>Discord channel</b> you would like to limit conversation to. <i>You should use ALL if you would like to not limit conversations to any particular channel</i>.')}}>
              <FontAwesomeIcon icon={faTv}></FontAwesomeIcon>
            </FSpan>
          </ConfigLabel>

          <ConfigInput
            onFocus={() => { if (RChannel === 'Discord channel') { setRChannel('') } } }
            onBlur={() => { if (RChannel === '') { setRChannel('Discord channel') } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRChannel(e.target.value) } }
            value={RChannel}
            placeholder={RChannel}>
          </ConfigInput>
        </ConfigFormGroup>

        <ConfigFormGroup>
          <ConfigLabel>
          <FSpan onClick={() => {play();createAlert('Discord Bot Name', 'This field is for the <b>Replika Bot Name</b> created on the Discord developer portal. This is used to listen for conversation targeting your replika bot.')}}>
              <FontAwesomeIcon icon={faRobot}></FontAwesomeIcon>
            </FSpan>
          </ConfigLabel>

          <ConfigInput
            onFocus={() => { if (RName === 'Discord bot name') { setRName('') } } }
            onBlur={() => { if (RName === '') { setRName('Discord bot name') } }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRName(e.target.value) } }
            value={RName}
            placeholder={RName}>
          </ConfigInput>
        </ConfigFormGroup>

        <ConfigFormGroup
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              setConfigBTNDisabled(true);
              saveConfigFile(RUsername, RPassword, RToken, RChannel, RName, documentsPath, props.updateActiveComponent, setConfigBTNDisabled)
            }}>
          <ConfigButton>Save Configuration</ConfigButton>
        </ConfigFormGroup>

        <ConfigFormGroup
          onClick={(e: SyntheticEvent) => { e.preventDefault(); props.updateActiveComponent('Dashboard') }}
          style={{ paddingTop: '0', position: 'relative', top: '-2%' }} >
          <ConfigButtonReturn disabled={ConfigBTNDisabled}>Return To Dashboard</ConfigButtonReturn>
        </ConfigFormGroup>
      </ConfigForm>
    </Container>
  )
}

/** ************** COMPONENT LOGIC */
const documentsPath = String(`${OS.homedir()}/Documents/Replika Discord Interface/Configuration/Config.json`)
const ensureFileExists = (setConfigFileExists: React.Dispatch<React.SetStateAction<boolean>>, path: string) => {
  FS.ensureFile(path)
    .then(() => {
      setConfigFileExists(true)
    })
    .catch(err => {
      setConfigFileExists(false)
      createAlert('Error', err)
    })
}

// Reads configuration file when navigating to configuration
const readConfigFile = (
  ConfigExists: boolean,
  ConfigState: Record<string, unknown>,
  ImportUsername: React.Dispatch<React.SetStateAction<string>>,
  ImportPassword: React.Dispatch<React.SetStateAction<string>>,
  ImportToken: React.Dispatch<React.SetStateAction<string>>,
  ImportChannel: React.Dispatch<React.SetStateAction<string>>,
  ImportName: React.Dispatch<React.SetStateAction<string>>,
  path: string) => {
  if (ConfigState) {
    FS.readJson(path)
      .then(packageObj => {
        ImportUsername(DOMPurify.sanitize(String(packageObj.ReplikaEmailOrPhone)))
        ImportPassword(DOMPurify.sanitize(String(packageObj.ReplikaPassword)))
        ImportToken(DOMPurify.sanitize(String(packageObj.DiscordBotToken)))
        ImportChannel(DOMPurify.sanitize(String(packageObj.DiscordChannel)))
        ImportName(DOMPurify.sanitize(String(packageObj.DiscordBotName)))
      })
      .catch(err => {
        createAlert('Alert', 'No config exists. Defaults will be used.')
        createDefaultConfig(documentsPath)
      })
  } else {
    createAlert('Error', 'There was an issue locating the configuration file')
  }
}

// Responsible for generalized alerts
const createAlert = (title: string, message: string) => {
  Alertify.alert(title, message, (e: React.ChangeEvent<HTMLInputElement>) => {})
}

const successfullySavedAlert = (title: string, message: string, setConfigBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>, activePage: (arg0: string) => void) => {
  Alertify.alert(title, message, () => {}).set({
    onshow: null,
    onclose: null
    /* () => {
      activePage('Configuration');
    } */
  })
  setConfigBTNDisabled(false)
}

// Creates default configuration file
const createDefaultConfig = (path: string) => {
  FS.outputJson(path, {
    ReplikaEmailOrPhone: 'Your email or phone number',
    ReplikaPassword: 'Password',
    DiscordBotToken: 'Discord bot token',
    DiscordChannel: 'Discord channel',
    DiscordBotName: 'Discord bot name'
  })
    .then(() => {
      // Do nothing
    })
    .catch(err => {
      createAlert('Error', `There was a problem creating a default configuration file. ${err}`)
    })
}

const saveConfigFile = (
    RUsername: string,
    RPassword: string,
    RToken: string,
    RChannel: string,
    RName: string,
    path: string,
    activePage: (arg0: string) => void,
    setConfigBTNDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
  FS.outputJson(path, {
    ReplikaEmailOrPhone: RUsername,
    ReplikaPassword: RPassword,
    DiscordBotToken: RToken,
    DiscordChannel: RChannel,
    DiscordBotName: RName
  })
    .then(() => {
      successfullySavedAlert('Notification', 'Successfully Saved Config!', setConfigBTNDisabled, activePage)
    })
    .catch((err) => {
      createAlert('Error', `There was a problem updating the configuration. ${err}`)
    })
}

/** ************** ANIMATIONS */
const underline = keyframes`
  0%: {border-top-left-radius: 10px; border-top-right-radius: 10px;}
  100% {border-bottom: 2px solid rgba(30, 30, 30, 1.0);}
`

/** ************** STYLES */
const Container = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  -webkit-app-region: no-drag;
`

const ConfigForm = Styled.form`
  display: flex;
  flex-direction: column;
  height: 70%;
  width: 70%;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-right: 5%;
  @media (min-width: 1px) and (max-width: 575px) {
    width: 95%;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 100% !important;
  };
  @media (min-width: 768px) and (max-width: 1199px) {
    width: 70% !important;
  };
  @media (min-width: 1200px) {
    width: 40%
  };
  @media (min-width: 768px) and (max-width: 991px) {
    width: 50%;
  };
`

const ConfigFormGroup = Styled.div`
  display: flex;
  flex-direction: row;
  width: 70%;
  height: 3rem;
  margin: 0;
  padding: 2%;
  border-radius: 5px;
`

const ConfigLabel = Styled.label`
  font-family: 'RobotoCondensedRegular', sans-serif;
  color: #f1f1f1;
  height: 100%;
  width: 20%;
  margin: auto;
  display: flex;
  position: relative;
  top: 5%;
  @media (min-width: 1px) and (max-width: 575px) {
    display: none;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 30%;
  };
`

const ConfigInput = Styled.input`
  font-family: 'RobotoCondensedRegular', sans-serif;
  color: #333;
  height: 100%;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  border: 2px solid #666;
  font-size: 1.2rem;
  outline: none;
  text-align: center;
  -webkit-app-region: no-drag;
  &:focus {
    border: 2px solid transparent;
    border-radius: 0;
    transition: all 0.3s ease-out;
    animation-name: ${underline};
    animation-duration: 0.3s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  };
  &:hover {
    cursor: pointer;
    border: 2px solid #6699ff;
    box-shadow: 3px 3px 7px rgba(50, 50, 50, 0.5);
  };
  &:focus {
    box-shadow: none;
    background-color: #f1f1f1;
    border-bottom: 1px solid #f1f1f1 !important;
    transition-duration: 0.3s;
    border-radius: 5px;
  }
  @media (min-width: 1px) and (max-width: 575px) {
    width: 95%;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 70%;
  };
`

const ConfigButton = Styled.button`
  font-family: 'RobotoCondensedRegular', sans-serif;
  color: #f1f1f1;
  height: 100%;
  width: 80%;
  margin: auto 0 auto 20%;
  border-radius: 5px;
  border: 2px solid #666;
  font-size: 1.2rem;
  text-align: center;
  background-color: #005a8d;
  -webkit-app-region: no-drag;
  &:hover {
    cursor: pointer;
    background-color: #00395a;
    cursor: pointer;
    transition-duration: 0.3s;
    box-shadow: 0px 0px 20px rgba(150, 150, 150, 0.5);
  };
  &:active {
    background-color: #002849;
  };
  @media (min-width: 1px) and (max-width: 575px) {
    width: 95%;
    margin: auto 0 auto 2%;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 95%;
    margin: auto 0 auto 30%;
  };
`

const ConfigButtonReturn = Styled.button`
  font-family: 'RobotoCondensedRegular', sans-serif;
  color: #f1f1f1;
  height: 100%;
  width: 80%;
  margin: auto 0 auto 20%;
  border-radius: 5px;
  border: 2px solid #666;
  font-size: 1.2rem;
  text-align: center;
  background-color: #333;
  -webkit-app-region: no-drag;
  &:hover {
    cursor: pointer;
    background-color: #222;
    transition-duration: 0.3s;
    box-shadow: 0px 0px 20px rgba(150, 150, 150, 0.5);
  };
  @media (min-width: 1px) and (max-width: 575px) {
    width: 95%;
    background-color: red;
    margin: auto 0 auto 2%;
  };
  @media (min-width: 576px) and (max-width: 767px) {
    width: 95%;
    margin: auto 0 auto 30%;
  };
`
const FSpan = Styled.span`
  background-color: #222;
  padding: 10%;
  border-radius: 100%;
  font-size: 1.5rem;
  width: 30px;
  margin-left: 30%;
  margin-top: auto;
  margin-bottom: auto;
  border: 1px solid #999;
  -webkit-app-region: no-drag;
  &:hover {
    background-color: #222;
    border: 1px solid #6699ff;
    cursor: help;
  };
  &:active {
    background-color: #111;
    padding: 9%;
    box-shadow: 0px 0px 15px #111;
  }
`

export default Config
