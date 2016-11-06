import WebMidi from 'webmidi/webmidi.min'

export function setupMidi(app) {
  WebMidi.enable(function (err) {
    if (err) {
      console.error("WebMidi could not be enabled.", err);
      return
    }

    for (let input of WebMidi.inputs) {
      input.addListener('noteon', "all", (e) => {
        let note = e.note.name.toLowerCase()
        app.handleNoteChange(note, e.note.octave)
      })
    }
  })
}
