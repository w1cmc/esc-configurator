import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import 'react-toastify/dist/ReactToastify.min.css';


import PortPicker from '../PortPicker';
import Log from '../Log';
import Statusbar from '../Statusbar';
import CookieConsent from '../CookieConsent';
import MainContent from '../MainContent';
import AppSettings from '../AppSettings';
import MelodyEditor from '../../Components/MelodyEditor';

import { useInterval } from '../../utils/helpers/React';

import changelogEntries from '../../changelog.json';
import './style.scss';

function App({
  actions,
  appSettings,
  configs,
  connected,
  escMelodies,
  escs,
  flashTargets,
  fourWay,
  hasPort,
  hasSerial,
  language,
  languages,
  onAllMotorSpeed,
  onChangePort,
  onCancelFirmwareSelection,
  onClose,
  onCloseMelodyEditor,
  onConnect,
  onCookieAccept,
  onDisconnect,
  onFlashUrl,
  onIndividualSettingsUpdate,
  onLanguageSelection,
  onLocalSubmit,
  onMelodySave,
  onOpenMelodyEditor,
  onOpenSettings,
  onSetBaudRate,
  onReadEscs,
  onResetDefaultls,
  onSaveLog,
  onSelectFirmwareForAll,
  onSetPort,
  onSettingsUpdate,
  onSingleFlash,
  onSingleMotorSpeed,
  onUpdate,
  onWriteSetup,
  open,
  packetErrors,
  portNames,
  progress,
  serial,
  serialLog,
  settings,
  showMelodyEditor,
  showSettings,
  version,
}) {
  const { t } = useTranslation('common');
  const statusbarRef = useRef();

  /* istanbul ignore next */
  useInterval(async() => {
    if(open && !actions.isReading && !fourWay) {
      if(serial.getBatteryState) {
        const batteryState = await serial.getBatteryState();
        statusbarRef.current.updateBatteryState(batteryState);
      }
    } else {
      statusbarRef.current.updateBatteryState(null);
    }
  }, 1000);

  /* istanbul ignore next */
  useInterval(async() => {
    if(serial.getUtilization) {
      const utilization = await serial.getUtilization();
      statusbarRef.current.updateUtilization(utilization);
    }
  }, 1000);

  const languageElements = languages.map((item) => (
    <option
      key={item.value}
      value={item.value}
    >
      {item.label}
    </option>
  ));

  return (
    <div className="App">
      <div id="main-wrapper">
        <div className="header-wrapper">
          <div className="headerbar">
            <div id="logo" />

            <PortPicker
              hasPort={hasPort}
              hasSerial={hasSerial}
              onChangePort={onChangePort}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onSetBaudRate={onSetBaudRate}
              onSetPort={onSetPort}
              open={open}
              ports={portNames}
            />

            <div className="language-select ">
              <div className="dropdown dropdown-dark">
                <select
                  className="dropdown-select"
                  defaultValue={language}
                  onChange={onLanguageSelection}
                >
                  {languageElements}
                </select>
              </div>

              <div className="button-dark">
                <button
                  onClick={onOpenSettings}
                  type="button"
                >
                  {t('settings')}
                </button>
              </div>

            </div>
          </div>

          <div className="clear-both" />

          <Log
            messages={serialLog}
          />
        </div>

        <MainContent
          actions={actions}
          appSettings={appSettings}
          changelogEntries={changelogEntries}
          configs={configs}
          connected={connected}
          escs={escs}
          flashTargets={flashTargets}
          fourWay={fourWay}
          onAllMotorSpeed={onAllMotorSpeed}
          onCancelFirmwareSelection={onCancelFirmwareSelection}
          onFlashUrl={onFlashUrl}
          onIndividualSettingsUpdate={onIndividualSettingsUpdate}
          onLocalSubmit={onLocalSubmit}
          onOpenMelodyEditor={onOpenMelodyEditor}
          onReadEscs={onReadEscs}
          onResetDefaultls={onResetDefaultls}
          onSaveLog={onSaveLog}
          onSelectFirmwareForAll={onSelectFirmwareForAll}
          onSettingsUpdate={onSettingsUpdate}
          onSingleFlash={onSingleFlash}
          onSingleMotorSpeed={onSingleMotorSpeed}
          onWriteSetup={onWriteSetup}
          open={open}
          progress={progress}
          settings={settings}
        />

        <Statusbar
          packetErrors={packetErrors}
          ref={statusbarRef}
          version={version}
        />
      </div>

      <CookieConsent
        onCookieAccept={onCookieAccept}
      />

      {showSettings &&
        <AppSettings
          onClose={onClose}
          onUpdate={onUpdate}
          settings={appSettings}
        />}

      {showMelodyEditor &&
        <MelodyEditor
          melodies={escMelodies}
          onClose={onCloseMelodyEditor}
          onSave={onMelodySave}
          writing={actions.isWriting}
        />}

      <ToastContainer />
    </div>
  );
}

App.defaultProps = {
  serial: {
    getBatteryState: null,
    getUtilization: null,
  },
};

App.propTypes = {
  actions: PropTypes.shape({
    isReading: PropTypes.bool.isRequired,
    isWriting: PropTypes.bool.isRequired,
  }).isRequired,
  appSettings: PropTypes.shape({}).isRequired,
  configs: PropTypes.shape({}).isRequired,
  connected: PropTypes.number.isRequired,
  escMelodies: PropTypes.arrayOf(PropTypes.string).isRequired,
  escs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  flashTargets: PropTypes.arrayOf(PropTypes.number).isRequired,
  fourWay: PropTypes.bool.isRequired,
  hasPort: PropTypes.bool.isRequired,
  hasSerial: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onAllMotorSpeed: PropTypes.func.isRequired,
  onCancelFirmwareSelection: PropTypes.func.isRequired,
  onChangePort: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCloseMelodyEditor: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onCookieAccept: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  onFlashUrl: PropTypes.func.isRequired,
  onIndividualSettingsUpdate: PropTypes.func.isRequired,
  onLanguageSelection: PropTypes.func.isRequired,
  onLocalSubmit: PropTypes.func.isRequired,
  onMelodySave: PropTypes.func.isRequired,
  onOpenMelodyEditor: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired,
  onReadEscs: PropTypes.func.isRequired,
  onResetDefaultls: PropTypes.func.isRequired,
  onSaveLog: PropTypes.func.isRequired,
  onSelectFirmwareForAll: PropTypes.func.isRequired,
  onSetBaudRate: PropTypes.func.isRequired,
  onSetPort: PropTypes.func.isRequired,
  onSettingsUpdate: PropTypes.func.isRequired,
  onSingleFlash: PropTypes.func.isRequired,
  onSingleMotorSpeed: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onWriteSetup: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  packetErrors: PropTypes.number.isRequired,
  portNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  progress: PropTypes.arrayOf(PropTypes.number).isRequired,
  serial: PropTypes.shape({
    getBatteryState:PropTypes.func,
    getUtilization:PropTypes.func,
  }),
  serialLog: PropTypes.arrayOf(PropTypes.any).isRequired,
  settings: PropTypes.shape({}).isRequired,
  showMelodyEditor: PropTypes.bool.isRequired,
  showSettings: PropTypes.bool.isRequired,
  version: PropTypes.string.isRequired,
};

export default App;
