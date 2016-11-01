import React, { Component } from 'react';
import './App.css';

import {Ewi, allCombinations} from './ewi'
import FingeringChart from './FingeringChart'

const DEFAULT_BITMASK = '0010000000000'

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
  handleKeyClick = (key) => {
    this.setState((prev, props) => {
      prev.ewi[key].toggle()
      return {ewi: prev.ewi}
    })
  }
  render() {
    let ewi = this.state.ewi
    return (
      <div className="App">
        <h3>EWI Fingering Tool</h3>
        <a href="https://github.com/bwasty/ewi" style={{ fontSize: 'small'}}>GitHub</a>
        <br />
        <div style={{height: '300px'}}>
          <FingeringChart fingering={ewi} handleKeyClick={this.handleKeyClick} />
        </div>
        <p />
        Note: {ewi.note}
        <p />
        Alternate fingerings: { this.fingeringsByPitch[ewi.pitch].length - 1 } <br />
        Top ones: <br />
        { 
          this.fingeringsByPitch[ewi.pitch].slice(0, 20).map(ewi => {
            return ( 
              <div key={ewi.id} className="alternate-fingering">
                <FingeringChart fingering={ewi} />
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
