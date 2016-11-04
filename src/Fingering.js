import _ from 'lodash'
import { bitCount } from './Util'

export class Fingering {
    basePitch = 13 // C# 
    
    lh1     = new Key(12, () =>                                        -2     )
    bis     = new Key(11, () => this.lh1.pressed && this.lh2.pressed ?  0 : -1)
    lh2     = new Key(10, () => this.lh1.pressed                     ? -2 : -1)
    lh3     = new Key( 9, () =>                                        -2)
    
    lpinky1 = new Key( 8, () =>                                         1     )
    lpinky2 = new Key( 7, () =>                                        -1     )
    
    rside   = new Key( 6, () => !this.lpinky1.pressed                ? +1 :  0)
    rh1     = new Key( 5, () => !this.lh3.pressed                    ? -1 : -2)
    rh2     = new Key( 4, () =>                                        -1     )
    rh3     = new Key( 3, () =>                                        -2     )
    
    rpinky1 = new Key( 2, () =>                                         1     )
    rpinky2 = new Key( 1, () =>                                        -1     )
    rpinky3 = new Key( 0, () =>                                        -2     )

    roller = 0 // default (middle) octave. Range: -3 to 3
    
    keys = [
        this.lh1, this.bis, this.lh2, this.lh3, this.lpinky1, this.lpinky2,
        this.rside, this.rh1, this.rh2, this.rh3, this.rpinky1, this.rpinky2, this.rpinky3
    ]
    
    constructor(bitmask=0, roller=0) {
        this.bitmask = bitmask
        this.roller = roller
        
        if (!bitmask)
            return

        this.keys
            .filter(k => (bitmask & (2 ** k.index)) !== 0)
            .forEach(k => k.press())
    }
    
    get id() {
        return this.bitmask
    }

    get bitmaskString() {
      return this.bitmask.toString(2)
    }
    
    get pitch() {
        return this.basePitch + this.keys
            .filter(key => key.pressed)
            .map(key => key.pitch)
            .reduce((prev, cur) => prev + cur, 0)
    }
    
    get note() {
        switch (this.pitch) {
            case -2: return 'A#'
            case -1: return 'B'
            case  0: return 'c'
            case  1: return 'c#'
            case  2: return 'd'
            case  3: return 'd#'
            case  4: return 'e'
            case  5: return 'f'
            case  6: return 'f#'
            case  7: return 'g'
            case  8: return 'g#'
            case  9: return 'a'
            case 10: return 'a#'
            case 11: return 'b'
            case 12: return "c'"
            case 13: return "c#'"
            case 14: return "d'"
            case 15: return "d#'"
            default: 
              console.error('Invalid pitch')
        }
    }
    
    distance(other) {
        return bitCount(this.bitmask ^ other.bitmask)
    }
    
    get pressedKeys() {
        return this.keys.filter(k => k.pressed)
    }
    
    get redundant() {
        return this.keys.some(k => k.redundant)
    }
    
    get hasNeutralizingKeys() {
        let pressed = this.pressedKeys
        let hasKeyWithPitch = x => pressed.some(k => k.pitch === x)
        return hasKeyWithPitch(1) && hasKeyWithPitch(-1)
    }
    
    get allRightPinkyKeysPressed() {
        // NOTE: subset of hasNeutralizingKeys
        return this.rpinky1.pressed && this.rpinky2.pressed && this.rpinky3.pressed
    }
}

class Key {
    constructor(index, pitch, pressed=false) {
        this.index = index
        this._pitch = pitch
        this.pressed = pressed

    }
    
    get pitch() {
        return this._pitch()
    }
    
    get redundant() {
        return this.pitch === 0 && this.pressed
    }
    
    // TODO!!: what about bitmask of parent Fingering? (press, unpress, toggle)
    press() {
        this.pressed = true
    }
    
    unpress() {
        this.pressed = false
    }

    toggle() {
      this.pressed = !this.pressed
    }
}


// function midiToPitch() {
     
// }


export function allCombinations(ewi) {
    // console.time('compute all combinations')
    
    let numCombinations = 2 ** ewi.keys.length;
    let fingerings = _.times(numCombinations, bitmask => new Fingering(bitmask))
    
    // console.timeEnd('compute all combinations')
    // console.log('combinations: ', fingerings.length)
   
    // console.time('filter out redundant')
    fingerings = fingerings.filter(ewi => !ewi.redundant)
    // console.timeEnd('filter out redundant')
    // console.log('combinations: ', fingerings.length)
    
    // console.time('filter out allRightPinkyKeysPressed')
    fingerings = fingerings.filter(ewi => !ewi.allRightPinkyKeysPressed)
    // console.timeEnd('filter out allRightPinkyKeysPressed')
    // console.log('combinations: ', fingerings.length)
    
    // console.time('filter out neutralizing keys')
    fingerings = fingerings.filter(ewi => !ewi.hasNeutralizingKeys)
    // console.timeEnd('filter out neutralizing keys')
    // console.log('combinations: ', fingerings.length)
    
    // console.time('group by pitch')
    let fingeringsByPitch = _.groupBy(fingerings, ewi => ewi.pitch)
    // console.log(fingeringsByPitch)
    // console.timeEnd('group by pitch')
    
    for (let pitch in fingeringsByPitch) {
        if (!fingeringsByPitch.hasOwnProperty(pitch))
            continue
        fingeringsByPitch[pitch] = _.sortBy(fingeringsByPitch[pitch], fingering => fingering.pressedKeys.length)
        
        // console.log(fingeringsByPitch[pitch][0].note)
        // console.log(fingeringsByPitch[pitch].slice(0,5).map(ewi => `${ewi.id}, ${ewi.pressedKeys.length}]`))
    }
    
   // TODO!: further/different sort criteria...
   // - distance to default fingering (smaller = better)
   // - number of 'gaps' between pressed keys?? (smaller = better)
   // - penalty for bis key?
   
   
   return fingeringsByPitch
}

// Standard fingerings as found in the EWI 5000 User Guide page 39
// TODO: verify correctness
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
]

export const STANDARD_FINGERINGS_BY_NOTE = {
  // TODO!: flat variations...
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
}

export function isStandardFingering(fingering) {
  return STANDARD_FINGERINGS_EWI.indexOf(fingering.bitmask) !== -1
}
