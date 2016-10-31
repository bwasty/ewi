import React, { Component } from 'react';
import './App.css';

import {Ewi, allCombinations} from './ewi'

const DEFAULT_BITMASK = '0011111110111'

class App extends Component {
  constructor() {
    super()
    this.state = {
      ewi: new Ewi(parseInt(DEFAULT_BITMASK, 2))
    }
    this.fingeringsByPitch = allCombinations(this.state.ewi)
  }
  changeBitmask(bitmask) {
    this.setState({ ewi: new Ewi(parseInt(bitmask, 2)) })
  }
  render() {
    let ewi = this.state.ewi
    return (
      <div className="App">
        <h2>EWI Fingering Tool</h2>
        <input type="text" defaultValue={DEFAULT_BITMASK} onChange={(e) => this.changeBitmask(e.target.value)}/>
        <pre>{`
            lh1: ${ewi.lh1.pressed}
            bis: ${ewi.bis.pressed}
            lh2: ${ewi.lh2.pressed}
            lh3: ${ewi.lh3.pressed}
            lpinky1: ${ewi.lpinky1.pressed}
            lpinky2: ${ewi.lpinky2.pressed}
            rside: ${ewi.rside.pressed}
            rh1: ${ewi.rh1.pressed}
            rh2: ${ewi.rh2.pressed}
            rh3: ${ewi.rh3.pressed}
            rpinky1: ${ewi.rpinky1.pressed}
            rpinky2: ${ewi.rpinky2.pressed}
            rpinky3: ${ewi.rpinky3.pressed}

            Note: ${ewi.note}
            Bitmask: ${ewi.id}
            `}
        </pre>
        Alternate fingerings: { this.fingeringsByPitch[ewi.pitch].length - 1 } <br />
        Top 10: <br />
        { this.fingeringsByPitch[ewi.pitch].slice(0, 10).map(ewi => <div key={ewi.id}>{ewi.id}</div>) }
      </div>
    )
  }
}

export default App
