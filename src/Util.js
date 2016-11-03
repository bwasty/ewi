import _ from 'lodash'

export function bitCount(i) {
  // Counts the number of set bits in i (Hamming Weight)
  // taken from http://stackoverflow.com/questions/109023/how-to-count-the-number-of-set-bits-in-a-32-bit-integer
  i -= (i >> 1) & 0x55555555;
  i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
  return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
}


export function adjustOctave(note, roller) {
  // Takes a note string in "Helmholtz pitch notation" adapts it to the given roller position
  // The input is expected to be based on the default roller position (0)
  if (roller === 0)
    return note

  // special handling for notes above/below the "main" octave
  let octave = roller
  let letter = note.charAt(0)
  if (letter.toUpperCase() === letter) {
    octave -= 1
    note = _.lowerFirst(note)
  }
  else if (note.charAt(note.length - 1) === "'") {
    octave += 1
    note = note.slice(0, note.length - 1)
  }

  if (octave < 0) {
    note = _.upperFirst(note)
    note += ",".repeat(Math.abs(octave) - 1)
  }
  else if (octave > 0) {
    note += "'".repeat(octave)
  }

  return note
}
