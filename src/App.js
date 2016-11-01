import React, { Component } from 'react';
import './App.css';

import {Ewi, allCombinations} from './ewi'
import FingeringChart from './FingeringChart'

const DEFAULT_BITMASK = '1011000111001'

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
        <input type="text" defaultValue={DEFAULT_BITMASK} onChange={(e) => this.changeBitmask(e.target.value)}/>
        <div style={{height: '300px'}}>
          <FingeringChart fingering={ewi} handleKeyClick={this.handleKeyClick} />
        </div>
        <p />
        Note: {ewi.note}
        <br />
        Bitmask: {ewi.id}
        <p />
        Alternate fingerings: { this.fingeringsByPitch[ewi.pitch].length - 1 } <br />
        Top 10: <br />
        { this.fingeringsByPitch[ewi.pitch].slice(0, 10).map(ewi => <div key={ewi.id}>{ewi.id}</div>) }
        <p />

      </div>
    )
  }
}

export default App
