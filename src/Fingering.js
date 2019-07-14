import _ from 'lodash'
import { bitCount, showFlat } from './Util'

const NUM_KEYS = 13

export class Fingering {
  basePitch = 13 // C# 
  
  lh1     = new Key(12, this, () =>                                        -2     )
  bis     = new Key(11, this, () => this.lh1.pressed && this.lh2.pressed ?  0 : -1)
  lh2     = new Key(10, this, () => this.lh1.pressed                     ? -2 : -1)
  lh3     = new Key( 9, this, () =>                                        -2)
  
  lpinky1 = new Key( 8, this, () =>                                         1     )
  lpinky2 = new Key( 7, this, () =>                                        -1     )
  
  rside   = new Key( 6, this, () => !this.lpinky1.pressed                ? +1 :  0)
  rh1     = new Key( 5, this, () => !this.lh3.pressed                    ? -1 : -2)
  rh2     = new Key( 4, this, () =>                                        -1     )
  rh3     = new Key( 3, this, () =>                                        -2     )
  
  rpinky1 = new Key( 2, this, () =>                                         1     )
  rpinky2 = new Key( 1, this, () =>                                        -1     )
  rpinky3 = new Key( 0, this, () =>                                        -2     )

  roller = 0 // default (middle) octave. Range: -2 to 4
  
  keys = [
    this.lh1, this.bis, this.lh2, this.lh3, this.lpinky1, this.lpinky2,
    this.rside, this.rh1, this.rh2, this.rh3, this.rpinky1, this.rpinky2, this.rpinky3
  ]
  
  constructor(bitmask = 0, roller = 0, flat = false) {
    this.bitmask = bitmask
    this.roller = roller
    this.flat = flat
    this._pitch = null

    this.rollerDiff = 0

    if (!bitmask)
      return

    this.keys
      .filter(k => (bitmask & (1 << k.index)) !== 0)
      .forEach(k => k.press(false))
  }
  
  get id() {
    return this.bitmask
  }

  get bitmaskString() {
    return this.bitmask.toString(2)
  }
  
  get pitch() {
    if (this._pitch === null) {
      this._pitch = this.basePitch + this.keys
        .filter(key => key._pressed)
        .map(key => key.pitch)
        .reduce((prev, cur) => prev + cur, 0)
    }

    return this._pitch
  }
  
  get note() {
    let note;
    switch (this.pitch) {
      case -2: note = 'A#' ; break;
      case -1: note = 'B'  ; break;
      case  0: note = 'c'  ; break;
      case  1: note = 'c#' ; break;
      case  2: note = 'd'  ; break;
      case  3: note = 'd#' ; break;
      case  4: note = 'e'  ; break;
      case  5: note = 'f'  ; break;
      case  6: note = 'f#' ; break;
      case  7: note = 'g'  ; break;
      case  8: note = 'g#' ; break;
      case  9: note = 'a'  ; break;
      case 10: note = 'a#' ; break;
      case 11: note = 'b'  ; break;
      case 12: note = "c'" ; break;
      case 13: note = "c#'"; break;
      case 14: note = "d'" ; break;
      case 15: note = "d#'"; break;
      default: 
        console.error('Invalid pitch')
    }
    if (this.flat)
      note = showFlat(note)

    return note
  }
  
  distance(other) {
    return bitCount(this.bitmask ^ other.bitmask)
  }

  updateBitmask(index, pressed) {
    let pos = 1 << index
    if (Boolean(this.bitmask & pos) !== pressed) {
      this.bitmask = this.bitmask ^ pos
      this._pitch = null
    }
  }

  applyDiff(previousFingering, includeRoller=true) {
    for(let i = 0; i < this.keys.length; i++) {
      if (this.keys[i]._pressed && !previousFingering.keys[i].pressed)
        this.keys[i].diff = 1
      else if (!this.keys[i]._pressed && previousFingering.keys[i].pressed)
        this.keys[i].diff = -1
      else 
        this.keys[i].diff = 0
    }

    if (includeRoller)
      this.rollerDiff = this.roller - previousFingering.roller
  }
  
  get pressedKeys() { return this.keys.filter(k => k._pressed) }
  
  get redundant() { return this.keys.some(k => k.redundant) }
  
  get hasNeutralizingKeys() {
    let pressed = this.pressedKeys
    let hasKeyWithPitch = x => pressed.some(k => k.pitch === x)
    return hasKeyWithPitch(1) && hasKeyWithPitch(-1)
  }
  
  get allRightPinkyKeysPressed() {
    // NOTE: subset of hasNeutralizingKeys
    return this.rpinky1._pressed && this.rpinky2._pressed && this.rpinky3._pressed
  }

  get badBisKeyUsage() {
    return this.bis._pressed && !(this.lh1._pressed || this.lh2._pressed)
  }
}

class Key {
  constructor(index, fingering, pitch, pressed = false) {
    this.index = index
    this.fingering = fingering
    this._pitch = pitch
    this._pressed = pressed
    this.diff = 0
  }

  get pitch() { return this._pitch() }

  get pressed() { return this._pressed }

  get redundant() { return this.pitch === 0 && this._pressed }

  press(updateFingering=true) {
    this._pressed = true
    if (updateFingering)
      this.fingering.updateBitmask(this.index, true)
  }

  unpress() {
    this._pressed = false
    this.fingering.updateBitmask(this.index, false)
  }

  toggle() {
    this._pressed = !this._pressed
    this.fingering.updateBitmask(this.index, this._pressed)
  }
}


export function allCombinations() {
  // console.time('allCombinations()')

  let numCombinations = 2 ** NUM_KEYS;
  let fingerings = _.times(numCombinations, bitmask => new Fingering(bitmask))

  fingerings = fingerings.filter(fingering => !fingering.redundant)
  fingerings = fingerings.filter(fingering => !fingering.allRightPinkyKeysPressed)
  fingerings = fingerings.filter(fingering => !fingering.hasNeutralizingKeys)
  fingerings = fingerings.filter(fingering => !fingering.badBisKeyUsage)

  console.log('combinations: ', fingerings.length)

  let fingeringsByPitch = _.groupBy(fingerings, fingering => fingering.pitch)

  for (let pitch in fingeringsByPitch) {
    if (!fingeringsByPitch.hasOwnProperty(pitch))
      continue
    
    // reverse to make fingerings that use more 'upper' keys appear first
    fingeringsByPitch[pitch].reverse()

    // sort by number of pressed keys 
    fingeringsByPitch[pitch] = _.sortBy(fingeringsByPitch[pitch], fingering => fingering.pressedKeys.length)
  }

  //  console.timeEnd('allCombinations()')
  return fingeringsByPitch
}

// Standard fingerings as found in the EWI 5000 User Guide page 39
const STANDARD_FINGERINGS_EWI = [
  0b1011010111011, // A#
  0b1011010111001, // B
  0b1011000111001, // c
  0b1011100111001, // c#
  0b1011000111000, // d
  0b1011000111100, // d#
  0b1011000110000, // e
  0b1011000100000, // f
  0b1011000010000, // f#
  0b1011000000000, // g
  0b1011100000000, // g#
  0b1010000000000, // a
  0b1010001000000, // a#
  0b1100000000000, // a# (alt.)
  0b1000000000000, // b
  0b0010000000000, // c'
  0b0000000000000, // c#'
  0b0000100000000, // d'
  0b0000100000100, // d#' (not in manual, but there's only one possibility)
]

export const STANDARD_FINGERINGS_BY_NOTE = {
  "A#" : STANDARD_FINGERINGS_EWI[ 0], "Bb" : STANDARD_FINGERINGS_EWI[0],
  "B"  : STANDARD_FINGERINGS_EWI[ 1], "Cb" : STANDARD_FINGERINGS_EWI[1],
  "c"  : STANDARD_FINGERINGS_EWI[ 2], "B#" : STANDARD_FINGERINGS_EWI[2],
  "c#" : STANDARD_FINGERINGS_EWI[ 3], "db" : STANDARD_FINGERINGS_EWI[3],
  "d"  : STANDARD_FINGERINGS_EWI[ 4], 
  "d#" : STANDARD_FINGERINGS_EWI[ 5], "eb" : STANDARD_FINGERINGS_EWI[5],
  "e"  : STANDARD_FINGERINGS_EWI[ 6], "fb" : STANDARD_FINGERINGS_EWI[6],
  "f"  : STANDARD_FINGERINGS_EWI[ 7], "e#" : STANDARD_FINGERINGS_EWI[7],
  "f#" : STANDARD_FINGERINGS_EWI[ 8], "gb" : STANDARD_FINGERINGS_EWI[8],
  "g"  : STANDARD_FINGERINGS_EWI[ 9], 
  "g#" : STANDARD_FINGERINGS_EWI[10], "ab" : STANDARD_FINGERINGS_EWI[10],
  "a"  : STANDARD_FINGERINGS_EWI[11], 
  "a#" : STANDARD_FINGERINGS_EWI[12], "bb" : STANDARD_FINGERINGS_EWI[12],
  "a#_": STANDARD_FINGERINGS_EWI[13], "bb_": STANDARD_FINGERINGS_EWI[13], // TODO: ?
  "b"  : STANDARD_FINGERINGS_EWI[14], "cb" : STANDARD_FINGERINGS_EWI[14],
  "c'" : STANDARD_FINGERINGS_EWI[15], "b#'": STANDARD_FINGERINGS_EWI[15],
  "c#'": STANDARD_FINGERINGS_EWI[16], "db'": STANDARD_FINGERINGS_EWI[16],
  "d'" : STANDARD_FINGERINGS_EWI[17],
  "d#'" : STANDARD_FINGERINGS_EWI[18],
}

export function isStandardFingering(fingering) {
  return STANDARD_FINGERINGS_EWI.indexOf(fingering.bitmask) !== -1
}

class AllFingerings {
  // static fingeringsByPitch = allCombinations()

  static getAlternatives(pitch, includeDifferentRoller=false) {
    
  }
}