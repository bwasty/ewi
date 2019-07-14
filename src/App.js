/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { Button, Glyphicon, Tooltip, OverlayTrigger, Badge, Panel } from 'react-bootstrap'
import _ from 'lodash'

import './App.css';

import { Fingering, allCombinations, STANDARD_FINGERINGS_BY_NOTE } from './Fingering'
import FingeringChart from './FingeringChart'
import { SHARP, FLAT, sharpen, flatten, adjustOctave, prettyAccidental } from './Util'

import { setupMidi, WebMidiStatus } from './Midi'

const DEFAULT_BITMASK = 0b0010000000000 // C

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      fingerings: [new Fingering(DEFAULT_BITMASK)],
      lastHoveredFingering: 0,
      selectedFingering: 0,
      diffMode: true // TODO!!: button to toggle
    }
    this.fingeringsByPitch = allCombinations(this.state.fingerings[0])

    setupMidi(this)
  }
  componentDidMount() {
    window.onpopstate = (e) => {
      this.updateFromUrl()
    }

    this.updateFromUrl()
  }
  updateFromUrl() {
    let query = window.location.search
    if (_.startsWith(query, '?f=')) {
      let [fingerings, rollers] = query.slice(1).split('&')
      rollers = rollers
        .slice(2)
        .split(',')
        .map(Number)
      fingerings = fingerings
        .slice(2)
        .split(',')
        .map(Number)
        .map((bitmask, i) => new Fingering(bitmask, rollers[i]))
      this.updateDiffs(fingerings)
      let selectedFingering = this.state.fingerings.length > fingerings.length ?
        fingerings.length - 1 : this.state.selectedFingering
      this.setState({
        fingerings: fingerings,
        selectedFingering: selectedFingering,
        lastHoveredFingering: selectedFingering
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let queryString = '?f=' + this.state.fingerings.map(f => f.id).join() +
      '&r=' +  this.state.fingerings.map(f => f.roller).join()


    if (queryString !== window.location.search) {
      window.history.pushState({}, '', queryString)
    }
  }
  handleKeyClick = (key, index) => {
    this.setState((prev, props) => {
      prev.fingerings[index][key].toggle()
      this.updateDiffs(prev.fingerings)
      return {
        fingerings: prev.fingerings,
      }
    })
  }
  handleRollerClick = (roller, index) => {
    this.setState((prev, props) => {
      prev.fingerings[index].roller = roller
      this.updateDiffs(prev.fingerings)
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
    this.updateDiffs(fingerings)
    this.setState({
      fingerings: fingerings
    })
  }
  handlePlusButtonClick = (e) => {
    e.preventDefault()
    let fingerings = this.state.fingerings.slice()
    let lastFingering = fingerings[fingerings.length - 1]
    fingerings.push(new Fingering(lastFingering.bitmask, lastFingering.roller, lastFingering.flat))
    this.setState({
      fingerings: fingerings,
      selectedFingering: fingerings.length - 1,
    })
  }
  handleMouseOverFingering = (index) => {
    this.setState({
      lastHoveredFingering: index
    })
  }
  handleMouseLeaveFingering = (index) => {
    this.setState({
      lastHoveredFingering: this.state.selectedFingering
    })
  }
  handleSelectFingering = (index) => {
    this.setState({
      selectedFingering: index
    })
  }
  handleSelectAlternateFingering = (bitmask) => {
    this.setState((prev, props) => {
      prev.fingerings[this.state.selectedFingering] = new Fingering(bitmask)
      this.updateDiffs(prev.fingerings)
      return {
        fingerings: prev.fingerings,
      }
    })
  }
  updateDiffs(fingerings) {
    if (!this.state.diffMode)
      return

    for (let i = 1; i < fingerings.length; i++) {
      fingerings[i].applyDiff(fingerings[i - 1])
    }
  }
  render() {
    return (
      <div className="App">
        <h3>EWI Fingering Tool</h3>
        <a href="https://github.com/bwasty/ewi" style={{ fontSize: 'small' }}>GitHub</a>
        <WebMidiStatus />
        <Panel>
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
                  handleMouseOver={this.handleMouseOverFingering}
                  handleMouseLeave={this.handleMouseLeaveFingering}
                  selectChart={this.handleSelectFingering}
                  selected={this.state.selectedFingering === i}
                  showNote={true}
                  />
              )
            })
          }
          <NoteButtonBar handleNoteChange={this.handleNoteChange} handlePitchChange={this.handlePitchChange} />
          <div className='plus-button'>
            <a href="#" onClick={this.handlePlusButtonClick}><Glyphicon glyph="plus" /></a>
          </div>

        </Panel>
        <Panel>
        <AlternativeFingerings
          fingering={this.state.fingerings[this.state.lastHoveredFingering]}
          previousFingering={this.state.fingerings[this.state.lastHoveredFingering - 1]}
          fingeringsByPitch={this.fingeringsByPitch}
          showAll={this.state.showAll}
          handleSelectAlternateChart={this.handleSelectAlternateFingering} />
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
    if ((this.state.octave > -2 || diff > 0) && (this.state.octave < 4 || diff < 0))
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
        <div style={{height: '18px'}} />
        <NoteButton note='f'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noFlat  />
        <NoteButton note='e'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noSharp />
        <NoteButton note='d'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange}         />
        <NoteButton note='c'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noFlat  />
        <NoteButton note='B'  octave={this.state.octave} handleNoteChange={this.props.handleNoteChange} noSharp />
        <div style={{ height: '18px' }} />
        <OverlayTrigger placement="right" delay={500} overlay={<Tooltip id="tooltip">Octave up</Tooltip>}>
          <Button bsSize="xsmall" onClick={() => this.changeOctave(1)}><Glyphicon glyph="triangle-top" /></Button>
        </OverlayTrigger>
        <OverlayTrigger placement="right" delay={500} overlay={<Tooltip id="tooltip">Octave down</Tooltip>}>
          <Button bsSize="xsmall" onClick={() => this.changeOctave(-1)}><Glyphicon glyph="triangle-bottom" /></Button>
        </OverlayTrigger>
      </div>
    )
  }
}

function NoteButton(props) {
  return (
    <div className="note-button">
      <Button bsSize="xsmall" onClick={() => props.handleNoteChange(props.note, props.octave)}>
        {adjustOctave(props.note, props.octave)}
      </Button>
      {!props.noSharp &&
        <Button bsSize="xsmall" onClick={() => props.handleNoteChange(sharpen(props.note), props.octave)}>{SHARP}</Button>}
      {!props.noFlat &&
        <Button bsSize="xsmall" onClick={() => props.handleNoteChange(flatten(props.note), props.octave)}>{FLAT}</Button>}
    </div>
  )
}

class AlternativeFingerings extends Component {
  constructor() {
    super()
    this.state = {
      showAll: false,
      showDiffs: true,
    }
  }
  noteModifier(fingering) {
    let pitch = fingering.pitch
    if (pitch < 4)
      return '(low)'
    else if (pitch < 10)
      return ''
    else
      return '(high)'
  }
  render() {
    const defaultNumberFingerings = 17
    let allAlternatives = this.props.fingeringsByPitch[this.props.fingering.pitch]
    let alternatives = allAlternatives

    if (this.state.showDiffs && this.props.previousFingering) {
      alternatives.forEach(fingering => fingering.applyDiff(this.props.previousFingering, false))
      alternatives = _.sortBy(alternatives, fingering => fingering.distance(this.props.previousFingering))
    }

    if (!this.state.showAll)
      alternatives = alternatives.slice(0, defaultNumberFingerings)
    alternatives = alternatives
      .map(fingering => <FingeringChart
                          key={fingering.id}
                          height="180px"
                          fingering={fingering}
                          readonly={true}
                          showNote={false}
                          selectable={true}
                          selected={fingering.id === this.props.fingering.id}
                          selectChart={this.props.handleSelectAlternateChart}/>)

    return (
      // TODO!!: more -> more+less button
      <div id='alternative-fingerings'>
        <h4>
          Alternate Fingerings for &nbsp;
          <b>{prettyAccidental(adjustOctave(this.props.fingering.note, this.props.fingering.roller))}</b>
          &nbsp;<span style={{ fontSize: 'x-small' }}>{this.noteModifier(this.props.fingering)}</span>
          &nbsp;&nbsp;
          <Badge>{this.props.fingeringsByPitch[this.props.fingering.pitch].length }</Badge>
        </h4>
        {alternatives}
        {!this.state.showAll && defaultNumberFingerings < allAlternatives.length &&
          <Button bsSize="small" onClick={() => this.setState({ showAll: true })}>&bull;&bull;&bull;</Button>}
      </div>
    )
  }
}
