import React, { Component } from 'react'
import { Button, Glyphicon, Tooltip, OverlayTrigger, Badge, Panel } from 'react-bootstrap'

import './App.css';

import {Fingering, allCombinations, STANDARD_FINGERINGS_BY_NOTE} from './Fingering'
import FingeringChart from './FingeringChart'
import {SHARP, FLAT, sharpen, flatten, adjustOctave} from './Util'

const DEFAULT_BITMASK = 0b0010000000000 // C

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      fingerings: [new Fingering(DEFAULT_BITMASK)],
      lastHoveredFingering: 0,
      selectedFingering: 0
    }
    this.fingeringsByPitch = allCombinations(this.state.fingerings[0])
  }
  handleKeyClick = (key, index) => {
    this.setState((prev, props) => {
      prev.fingerings[index][key].toggle()
      return {
        fingerings: prev.fingerings,
      }
    })
  }
  handleRollerClick = (roller, index) => {
    this.setState((prev, props) => {
      prev.fingerings[index].roller = roller
      return {
        fingerings: prev.fingerings,
      }
    })
  }
  handleNoteChange = (note, octave) => {
    let flat = note.charAt(1) === 'b'
    let fingerings = this.state.fingerings.slice()
    fingerings[this.state.selectedFingering] = new Fingering(
      STANDARD_FINGERINGS_BY_NOTE[note], octave, flat)
    this.setState({
      fingerings: fingerings
    })
  }
  handlePlusButtonClick = (e) => {
    e.preventDefault()
    let fingerings = this.state.fingerings.slice()
    fingerings.push(new Fingering(0))
    this.setState({
      fingerings: fingerings
    })
  }
  handleHover = (index) => {
    this.setState({
      lastHoveredFingering: index
    })
  }
  handleSelectChart = (index) => {
    this.setState({
      selectedFingering: index
    })
  }
  render() {
    return (
      <div className="App">
        <h3>EWI Fingering Tool</h3>
        <a href="https://github.com/bwasty/ewi" style={{ fontSize: 'small'}}>GitHub</a>
        <Panel>
          <NoteButtonBar handleNoteChange={this.handleNoteChange} handlePitchChange={this.handlePitchChange} />
          {
            this.state.fingerings.map((fingering, i) => {
              return (
                <FingeringChart 
                  key={i}
                  index={i}
                  height="280px"
                  fingering={fingering} 
                  handleKeyClick={this.handleKeyClick} 
                  handleRollerClick={this.handleRollerClick} 
                  handleHover={this.handleHover}
                  selectChart={this.handleSelectChart}
                  selected={ this.state.selectedFingering === i } 
                  showNote={true}
                />
              )
            })
          }
          <div className='plus-button'>
            <a href="#" onClick={ this.handlePlusButtonClick }><Glyphicon glyph="plus" /></a>
          </div>
          
        </Panel>
        <Panel>
        <AlternativeFingerings 
          fingering={this.state.fingerings[this.state.lastHoveredFingering]} 
          fingeringsByPitch={this.fingeringsByPitch} 
          showAll={this.state.showAll} />
        </Panel>         
      </div>
    )
  }
}

class NoteButtonBar extends Component {
  constructor() {
    super()
    this.state = {
      octave: 0
    }
  }
  changeOctave = (diff) => {
    if ((this.state.octave > -3 || diff > 0) && (this.state.octave < 3 || diff < 0))
      this.setState({ octave: this.state.octave + diff })
  }
  render() {
    return (
      <div className="note-buttons">
        <NoteButton note="d'" octave={this.state.octave} handleNoteChange={this.props.handleNoteChange}         />
        <NoteButton note="c'" octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noFlat  />
        <NoteButton note='b'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noSharp />
        <NoteButton note='a'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange}         />
        <NoteButton note='g'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange}         />
        <div style={{height: '12px'}} />
        <NoteButton note='f'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noFlat  />
        <NoteButton note='e'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noSharp />
        <NoteButton note='d'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange}         />
        <NoteButton note='c'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noFlat  />
        <NoteButton note='B'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noSharp />
        <div style={{height: '12px'}} />
        <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave up</Tooltip> }>
          <Button bsSize="xsmall" onClick={ () => this.changeOctave(1) }><Glyphicon glyph="triangle-top" /></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="right" delay={500} overlay={ <Tooltip id="tooltip">Octave down</Tooltip> }>
          <Button bsSize="xsmall" onClick={ () => this.changeOctave(-1) }><Glyphicon glyph="triangle-bottom" /></Button>
        </OverlayTrigger>
      </div>
    )
  }
}

function NoteButton(props) {
  return (
    <div className="note-button">
      <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(props.note, props.octave) }>
        {adjustOctave(props.note, props.octave)}
      </Button>
      { !props.noSharp && 
        <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(sharpen(props.note), props.octave) }>{SHARP}</Button> }
      { !props.noFlat && 
        <Button bsSize="xsmall" onClick={ () => props.handleNoteChange(flatten(props.note), props.octave) }>{FLAT}</Button> }
    </div>
  )
}

class AlternativeFingerings extends Component {
  constructor() {
    super()
    this.state = {
      showAll: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.fingering.id !== nextProps.fingering.id)
      this.setState({showAll: false})
  }
  render() {
    const defaultNumberFingerings = 15
    let allAlternatives = this.props.fingeringsByPitch[this.props.fingering.pitch]
    let alternatives = allAlternatives
    if (!this.state.showAll)
      alternatives = alternatives.slice(0, defaultNumberFingerings)
    alternatives = alternatives
      .filter(fingering => fingering.id !== this.props.fingering.id)
      .map(fingering => <FingeringChart 
                          key={fingering.id}
                          height="180px"
                          fingering={fingering} 
                          readonly={true} 
                          showNote={false} />)

    return (
      <div id='alternative-fingerings'>
        <h4>
          Alternative fingerings &nbsp;
          <Badge>{ this.props.fingeringsByPitch[this.props.fingering.pitch].length - 1 }</Badge>
        </h4>
        { alternatives }
        { !this.state.showAll && defaultNumberFingerings < allAlternatives.length && 
          <Button bsSize="small" onClick={ () => this.setState({showAll: true}) }>•••</Button> }
      </div>
    )
  }
}
