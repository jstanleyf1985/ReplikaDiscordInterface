import React from 'react'
import Electron from 'electron'
import Styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faWindowMinimize, faWindowMaximize } from '@fortawesome/free-solid-svg-icons'

const AppControls = (): JSX.Element => {
  return (
    <AppControlsBarWrapper>
      <AppControlsBar>
        <AppControlsBTN icon={faWindowMinimize} onClick={() => Electron.remote.getCurrentWindow().minimize()}/>
        <AppControlsBTN icon={faWindowMaximize} onClick={() => Electron.remote.getCurrentWindow().maximize()}/>
        <AppControlsBTN icon={faTimes} onClick={() => Electron.remote.getCurrentWindow().close()}/>
      </AppControlsBar>
    </AppControlsBarWrapper>
  )
}

const AppControlsBarWrapper = Styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 6%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  overflow-hidden;
  border-bottom: 1px solid rgba(100, 100, 100, 0.4);
  &:hover {
    cursor: pointer;
  }
`

const AppControlsBar = Styled.div`
  margin: 0;
  padding: 0;
  height: 5%;
  background-color: transparent;
  width: 15%;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  -webkit-app-region: no-drag;
  align-self: flex-end;
  &:hover {
    cursor: pointer;
  };
  @media (min-width: 1px) and (max-width: 575px) {
    width: 40%;
  };
`

const AppControlsBTN = Styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  color: #cacaca;
  padding: 0.5%;
  margin: 0 0.5%;
  &:hover {
    color: #ffffff;
  }
`
export default AppControls
