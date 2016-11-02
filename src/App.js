import React, { Component } from 'react'
import { Button, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap'

import './App.css';

import {Fingering, allCombinations, SHARP, FLAT} from './Fingering'
import FingeringChart from './FingeringChart'

const DEFAULT_BITMASK = 0b0010000000000

export default class App extends Component {
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
        <ButtonBar />
        <div style={{height: '280px', display: 'inline-block'}}>
          <FingeringChart 
            height="280px"
            fingering={fingering} 
            handleKeyClick={this.handleKeyClick} 
            showNote={true}
          />
        </div>
        <p />
        Alternate fingerings: { this.fingeringsByPitch[fingering.pitch].length - 1 } <br />
        Top ones: <br />
        { 
          this.fingeringsByPitch[fingering.pitch].slice(0, 15).map(ewi => {
            return ( 
              <div key={ewi.id} className="alternate-fingering">
                <FingeringChart 
                  height="180px"
                  fingering={ewi} 
                  readonly={true} 
                  showNote={false}
                />
              </div>
            ) 
          })
        }
        <p />

      </div>
    )
  }
}

function ButtonBar(props) {
  return (
    <div className="note-buttons">
      <Button bsSize="xsmall">{SHARP}</Button>
      <Button bsSize="xsmall">{FLAT}</Button>
      <p />
      <Button bsSize="xsmall">C</Button>
      <Button bsSize="xsmall">B</Button>
      <Button bsSize="xsmall">A</Button>
      <Button bsSize="xsmall">G</Button>
      <Button bsSize="xsmall">F</Button>
      <Button bsSize="xsmall">E</Button>
      <Button bsSize="xsmall">D</Button>
      <Button bsSize="xsmall">C</Button>
      <p />
      <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave up</Tooltip> }>
        <Button bsSize="xsmall"><Glyphicon glyph="triangle-top" /></Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave down</Tooltip> }>
        <Button bsSize="xsmall"><Glyphicon glyph="triangle-bottom" /></Button>
      </OverlayTrigger>
    </div>
  )
}
