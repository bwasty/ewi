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
  handleNoteChange = (note) => {
    // TODO!
    console.log(note)
  }
  handlePitchChange = (pitch) => {
    // pitch: relative, in semitones
    // TODO!
    console.log(pitch)
  }
  render() {
    let fingering = this.state.fingering
    return (
      <div className="App">
        <h3>EWI Fingering Tool</h3>
        <a href="https://github.com/bwasty/ewi" style={{ fontSize: 'small'}}>GitHub</a>
        <br />
        <ButtonBar handleNoteChange={this.handleNoteChange} handlePitchChange={this.handlePitchChange} />
        <FingeringChart 
          height="280px"
          fingering={fingering} 
          handleKeyClick={this.handleKeyClick} 
          showNote={true}
        />
        <p />
        <AlternativeFingerings fingering={fingering} fingeringsByPitch={this.fingeringsByPitch} />
      </div>
    )
  }
}

function ButtonBar(props) {
  return (
    <div className="note-buttons">
      <Button bsSize="xsmall" onClick={ () => props.handlePitchChange(1) }>{SHARP}</Button>
      <Button bsSize="xsmall" onClick={ () => props.handlePitchChange(-1) }>{FLAT}</Button>
      <p />
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange("c'") }>C</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('b') }>B</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('a') }>A</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('g') }>G</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('f') }>F</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('e') }>E</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('d') }>D</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('c') }>C</Button>
      <p />
      <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave up</Tooltip> }>
        <Button bsSize="xsmall" onClick={ () => props.handlePitchChange(12) }><Glyphicon glyph="triangle-top" /></Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave down</Tooltip> }>
        <Button bsSize="xsmall" onClick={ () => props.handlePitchChange(-12) }><Glyphicon glyph="triangle-bottom" /></Button>
      </OverlayTrigger>
    </div>
  )
}

function AlternativeFingerings(props) {
  return (
    <div>
      Alternate fingerings: { props.fingeringsByPitch[props.fingering.pitch].length - 1 } <br />
      Top ones: <br />
      { 
        props.fingeringsByPitch[props.fingering.pitch].slice(0, 15).map(ewi => {
          return ( 
              <FingeringChart 
                key={ewi.id}
                height="180px"
                fingering={ewi} 
                readonly={true} 
                showNote={false} />
          ) 
        })
      }
    </div>
  )
}
