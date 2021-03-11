// IMPROVE: * Refactor the selects to seperate components
//          * Check the hints outside of the component

import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

import {
  findMCU,
} from '../../utils/helpers/General';

import LabeledSelect from '../LabeledSelect';

import {
  BLHELI_TYPES,
  BLHELI_MODES,
} from '../../utils/Blheli';

import {
  BLUEJAY_TYPES,
} from '../../utils/Bluejay';

function FirmwareSelector({
  onCancel,
  escHint,
  signatureHint,
  selectedMode,
  onSubmit,
  onLocalSubmit,
  configs,
}) {
  const { t } = useTranslation('common');
  const {
    escs,
    versions,
    pwm,
  } = configs;
  const availableFirmware = Object.keys(escs);
  const firmwareOptions = availableFirmware.map((key) => (
    {
      key,
      value: key,
      name: key,
    }
  ));

  const file = useRef(null);

  const [selectedEsc, setSelectedEsc] = useState(null);
  const [type, setType] = useState(null);
  const [mode, setMode] = useState(selectedMode);
  const [force, setForce] = useState(false);

  const [selection, setSelection] = useState({
    firmware: availableFirmware[0],
    url: null,
    pwm: null,
  });

  // Make choice for preselected layout - only happens once
  useEffect(async () => {
    if(
      escs.Bluejay.layouts[BLUEJAY_TYPES.EFM8][escHint] ||
      escs.Blheli.layouts[BLHELI_TYPES.ATMEL][escHint] ||
      BLHELI_TYPES.BLHELI_S_SILABS[escHint] ||
      BLHELI_TYPES.SILABS[escHint]
    ) {
      await setSelectedEsc(escHint);
    }
  }, []);

  // Set the type = this needs to happen on every change of firmware selection
  useEffect(async () => {
    if(findMCU(signatureHint, escs.Bluejay.signatures[BLUEJAY_TYPES.EFM8]) && selection.firmware === 'Bluejay') {
      setType(BLUEJAY_TYPES.EFM8);
    } else if (findMCU(signatureHint, escs.Blheli.signatures[BLHELI_TYPES.BLHELI_S_SILABS])) {
      setType(BLHELI_TYPES.BLHELI_S_SILABS);
    } else if (findMCU(signatureHint, escs.Blheli.signatures[BLHELI_TYPES.SILABS])) {
      setType(BLHELI_TYPES.SILABS);
    } else if (findMCU(signatureHint, escs.Blheli.signatures[BLHELI_TYPES.ATMEL])) {
      setType(BLHELI_TYPES.ATMEL);
    } else {
      throw new Error('Unknown MCU signature: ' + signatureHint.toString(0x10));
    }
  }, [selection]);

  function updateFirmware(e) {
    const firmware = e.target.value;

    const newSelection = {
      firmware,
      url: null,
      pwm: null,
    };

    setSelection(newSelection);
  }

  function updateEsc(e) {
    setSelectedEsc(e.target.value);
  }

  function clickFile() {
    file.current.click();
  }

  function submitLocalFile(e) {
    e.preventDefault();
    onLocalSubmit(e, force);
  }

  function updateMode(e) {
    setMode(e.target.value);
  }

  function updateVersion(e) {
    const newSelection = Object.assign({}, selection, { url: e.target.value });
    setSelection(newSelection);
  }

  function updateForce(e) {
    setForce(e.target.checked);
  }

  function updatePwm(e) {
    const newSelection = Object.assign({}, selection, { pwm: e.target.value });
    setSelection(newSelection);
  }

  function submit(e) {
    e.preventDefault();
    const escsAll = escs[selection.firmware].layouts[type];

    const format = (str2Format, ...args) =>
      str2Format.replace(/(\{\d+\})/g, (a) => args[+(a.substr(1, a.length - 2)) || 0] );

    const formattedUrl = format(
      selection.url,
      (escsAll[selectedEsc].name.replace(/[\s-]/g, '_').toUpperCase() + (selection.pwm ? '_' + selection.pwm : '')),
      mode,
    );

    onSubmit(formattedUrl, force);
  }

  if(!type) {
    return null;
  }

  const descriptions = escs[selection.firmware].layouts[type];
  const escOptions = [];
  for (const layout in descriptions) {
    const esc = descriptions[layout];

    escOptions.push({
      key: layout,
      value: layout,
      name: esc.name,
    });
  }

  const modeOptions = [];
  for (const mode in BLHELI_MODES) {
    modeOptions.push({
      key: mode,
      value: mode,
      name: mode,
    });
  }

  const versionsSelected = versions[selection.firmware][type];
  const versionOptions = [];
  for (const version in versionsSelected) {
    const current = versionsSelected[version];
    const url = current.url;

    versionOptions.push({
      key: current.key,
      value: url,
      name: current.name
    });
  }

  const frequencies = pwm[selection.firmware];
  const frequencyOptions = frequencies.map((item) => (
    {
      key: item,
      value: item,
      name: item,
    }
  ));

  const enableFlashButton = !selection.url || (!selection.pwm && frequencies.length > 0);

  return (
    <>
      <div className="checkbox">
        <label>
          <input
            defaultValue={force}
            onChange={updateForce}
            type="checkbox"
          />

          <span>
            <span>
              Ignore inappropriate MCU and Layout?
            </span>

            <span className={force ? "red" : "hidden"}>
              (Flashing inappropriate firmware may damage your ESC, do so at your own risk)
            </span>
          </span>
        </label>
      </div>

      <div className="centerWrapper">
        <div className="gui_box grey">
          <div className="gui_box_titlebar">
            <div className="spacer_box_title">
              Select Target
            </div>
          </div>

          <div className="spacer_box">

            <LabeledSelect
              firstLabel="Select Firmware"
              label="Firmware"
              onChange={updateFirmware}
              options={firmwareOptions}
              selected={selection.firmware}
            />

            <LabeledSelect
              firstLabel="Select ESC"
              label="ESC"
              onChange={updateEsc}
              options={escOptions}
              selected={selectedEsc}
            />

            {type === BLHELI_TYPES.SILABS || type === BLHELI_TYPES.ATMEL &&
              <LabeledSelect
                firstLabel="Select Mode"
                label="Mode"
                onChange={updateMode}
                options={modeOptions}
                selected={mode}
              />}

            <LabeledSelect
              firstLabel="Select Version"
              label="Version"
              onChange={updateVersion}
              options={versionOptions}
              selected={selection.url}
            />

            {frequencies.length > 0 &&
              <LabeledSelect
                firstLabel="Select PWM Frequency"
                label="PWM Frequency"
                onChange={updatePwm}
                options={frequencyOptions}
                selected={selection.pwm}
              />}

            <div className="default-btn">
              <a
                className={enableFlashButton ? "disabled" : ""}
                href="#"
                onClick={submit}
              >
                {t('escButtonSelect')}
              </a>
            </div>

            <div className="default-btn">
              <input
                onChange={submitLocalFile}
                ref={file}
                style={{ display: 'none' }}
                type="file"
              />

              <a
                href="#"
                onClick={clickFile}
              >
                {t('escButtonSelectLocally')}
              </a>
            </div>

            <div className="default-btn">
              <a
                href="#"
                onClick={onCancel}
              >

                {t('buttonCancel')}

              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

FirmwareSelector.defaultProps = { selectedMode: null };

FirmwareSelector.propTypes = {
  configs: PropTypes.shape({
    escs: PropTypes.shape().isRequired,
    versions: PropTypes.shape().isRequired,
    pwm: PropTypes.shape().isRequired,
  }).isRequired,
  escHint: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onLocalSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selectedMode: PropTypes.string,
  signatureHint: PropTypes.number.isRequired,
};

export default FirmwareSelector;
