import _ from 'lodash'

export const SHARP = '\u266F' // MUSIC SHARP SIGN
export const FLAT = '\u266D'; // MUSIC FLAT SIGN

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
        // TODO: take Octave into account
        let pitch = this.pitch % 12
        if (pitch < 0)
            pitch += 12
        switch (pitch) {
            case 0: return 'C'
            case 1: return 'C' + SHARP
            case 2: return 'D'
            case 3: return 'D' + SHARP
            case 4: return 'E'
            case 5: return 'F'
            case 6: return 'F' + SHARP
            case 7: return 'G'
            case 8: return 'G' + SHARP
            case 9: return 'A'
            case 10: return 'A' + SHARP
            case 11: return 'B'
            default: return pitch.toString()
        }
    }
    
    distance(other) {
        let xor = this.bitmask ^ other.bitmask
        return _.sum(xor.toString(2).split('').map(Number))
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

export function defaultFingeringsEwi() {
    // Standard fingerings as found in the EWI 5000 User Guide page 39
    // TODO: verify correctness
    return [
      0b1011010111011, // A#
      0b1011010111001, // B
      0b1011000111001, // C
      0b1011100111001, // C#
      0b1011000111000, // D
      0b1011000111100, // D#
      0b1011000110000, // E
      0b1011000100000, // F
      0b1011000010000, // F#
      0b1011000000000, // G
      0b1011100000000, // G#
      0b1010000000000, // A
      0b1010001000000, // A#
      0b1100000000000, // A# (alt.)
      0b1000000000000, // B
      0b0010000000000, // C
      0b0000000000000, // C#
      0b0000100000000, // D
    ]
}