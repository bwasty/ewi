import React, { Component } from 'react';
import './App.css';

import {Fingering, allCombinations} from './Fingering'
import FingeringChart from './FingeringChart'

const DEFAULT_BITMASK = 0b0010000000000

class App extends Component {
  constructor() {
    super()
    this.state = {
      fingering: new Fingering(DEFAULT_BITMASK)
    }
    this.fingeringsByPitch = allCombinations(this.state.fingering)
  }
  handleKeyClick = (key) => {
    this.setState((prev, props) => {
      prev.fingering[key].toggle()
      return {fingering: prev.fingering}
    })
  }
  render() {
    let fingering = this.state.fingering
    return (
      <div className="App">
        <h3>EWI Fingering Tool</h3>
        <a href="https://github.com/bwasty/ewi" style={{ fontSize: 'small'}}>GitHub</a>
        <br />
        <div style={{height: '280px'}}>
          <FingeringChart fingering={fingering} handleKeyClick={this.handleKeyClick} />
        </div>
        <p />
        Note: {fingering.note}
        <p />
        Alternate fingerings: { this.fingeringsByPitch[fingering.pitch].length - 1 } <br />
        Top ones: <br />
        { 
          this.fingeringsByPitch[fingering.pitch].slice(0, 15).map(ewi => {
            return ( 
              <div key={ewi.id} className="alternate-fingering">
                <FingeringChart fingering={ewi} readonly={true} />
              </div>
            ) 
          })
        }
        <p />

      </div>
    )
  }
}

export default App
