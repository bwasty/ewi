import React, { Component } from 'react';
import './App.css';

import {Ewi, allCombinations} from './ewi'

const DEFAULT_BITMASK = '0011111110111'

class App extends Component {
  render() {
    this.ewi = new Ewi(parseInt(DEFAULT_BITMASK, 2))
    return (
      <div className="App">
        EWI Fingering tool
        <pre>{`
            lh1: ${this.ewi.lh1.pressed}
            bis: ${this.ewi.bis.pressed}
            lh2: ${this.ewi.lh2.pressed}
            lh3: ${this.ewi.lh3.pressed}
            lpinky1: ${this.ewi.lpinky1.pressed}
            lpinky2: ${this.ewi.lpinky2.pressed}
            rside: ${this.ewi.rside.pressed}
            rh1: ${this.ewi.rh1.pressed}
            rh2: ${this.ewi.rh2.pressed}
            rh3: ${this.ewi.rh3.pressed}
            rpinky1: ${this.ewi.rpinky1.pressed}
            rpinky2: ${this.ewi.rpinky2.pressed}
            rpinky3: ${this.ewi.rpinky3.pressed}

            Note: ${this.ewi.note}
            Bitmask: ${this.ewi.id}
            `}
        </pre>
      </div>
    );
  }
}

export default App;
