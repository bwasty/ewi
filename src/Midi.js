import React from 'react'
import WebMidi from 'webmidi/webmidi.min'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

export function setupMidi(app) {
  window.WebMidi = WebMidi
  WebMidi.enable(function (err) {
    if (err) {
      console.error("WebMidi could not be enabled.", err);
      return
    }

    addListeners(app)

    WebMidi.addListener('connected', (e) => {
      addListeners(app)
    })

    WebMidi.addListener('disconnected', (e) => {
      app.forceUpdate()
    })
  })
}

function addListeners(app) {
  for (let input of WebMidi.inputs) {
    input.removeListener('noteon')
    input.addListener('noteon', "all", (e) => {
      let note = e.note.name.toLowerCase()
      app.handleNoteChange(note, e.note.octave)
    })
  }

  app.forceUpdate() // to update webmidi status display
}

export function WebMidiStatus(props) {
  let statusColor = 'red'
  let statusTooltip = 'WebMidi could not be enabled. Try with Chrome?'
  if (WebMidi.enabled) {
    if (WebMidi.inputs.length) {
      statusColor = 'lime'
      statusTooltip = 'WebMidi enabled. Inputs: ' + WebMidi.inputs.map((input) => input.name).join(', ')
    }
    else {
      statusColor = 'orange'
      statusTooltip = 'WebMidi is enabled, but no inputs were found'
    }
  }
  return (
    <OverlayTrigger placement="bottom" overlay={ <Tooltip id="tooltip">{statusTooltip}</Tooltip> }>
      <span style={{float: 'right', marginTop: '10px'}} >
        WebMidi:&nbsp;
        <span style={{ color: statusColor, fontSize: 'large' }}>&#9679;</span>
      </span>
    </OverlayTrigger>
  )
}
