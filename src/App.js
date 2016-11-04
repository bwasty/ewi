import React, { Component } from 'react'
import { Button, Glyphicon, Tooltip, OverlayTrigger} from 'react-bootstrap'

import './App.css';

import {Fingering, allCombinations, STANDARD_FINGERINGS_BY_NOTE} from './Fingering'
import FingeringChart from './FingeringChart'
import {SHARP, FLAT, sharpen, flatten} from './Util'

const DEFAULT_BITMASK = 0b0010000000000 // C

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
    this.setState({
      fingering: new Fingering(STANDARD_FINGERINGS_BY_NOTE[note])
    })
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
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange("d'") }>d'</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange("c'") }>c'</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('b') }>b</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('a') }>a</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('g') }>g</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('f') }>f</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('e') }>e</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('d') }>d</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('c') }>c</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange('B') }>B</Button>
      <NoteButton note='c' handleNoteChange={props.handleNoteChange} />
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

function NoteButton(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(props.note) }>{props.note}</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(sharpen(props.note)) }>{SHARP}</Button>
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(flatten(props.note)) }>{FLAT}</Button>
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
