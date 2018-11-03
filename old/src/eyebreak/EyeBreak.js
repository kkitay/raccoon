import React from 'react';
import Tray from '../common/Tray';
import Typewriter from '../common/Typewriter';
import './EyeBreak.css';

const { remote, ipcRenderer } = window.require('electron');
const thisWindow = remote.getCurrentWindow();

export default class EyeBreak extends React.Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  stopBreak = () => {
    thisWindow.hide();
  };

  skipBreak = () => {
    ipcRenderer.send('skipbreak');
    this.stopBreak();
  };

  componentDidMount() {
    // listen for open
    ipcRenderer.on('openTray', (e, duration) => {
      // set a timer to close automatically
      setTimeout(this.stopBreak, duration);
    });

    // listen for skipping break (ESC key)
    ipcRenderer.on('skipbreak', (e, duration) => {
      this.stopBreak();
    });
  }

  render() {
    return (
      <Tray
        render={tray => {
          return (
            tray.startTyping && (
              <Typewriter name="eyebreak" className="EyeBreak">
                <h1>It's break time!</h1>
                <p>
                  Shake out your hands and try to focus on something in the
                  distance for 20 seconds. It'll prevent RSI and eye strain. But
                  what do I really know, I'm a raccoon.
                </p>
                <p>
                  Press ESC to&nbsp;
                  <button onClick={this.skipBreak}>skip break</button>
                </p>
              </Typewriter>
            )
          );
        }}
      />
    );
  }
}
