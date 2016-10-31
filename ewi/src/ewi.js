import _ from 'lodash'

const NUM_KEYS = 13

export class Ewi {
    basePitch = 13 // C# 
    
    lh1     = new Key(12, () =>                                        -2     )
    bis     = new Key(11, () => this.lh1.pressed && this.lh2.pressed ?  0 : -1)
    lh2     = new Key(10, () => this.lh1.pressed                     ? -2 : -1)
    lh3     = new Key( 9, () =>                                        -2)
    
    lpinky1 = new Key( 8, () =>                                         1     )
    lpinky2 = new Key( 7, () =>                                        -1     )
    
    rside   = new Key( 6, () => !this.lpinky1.pressed                ? -1 :  0)
    rh1     = new Key( 5, () => !this.lh3.pressed                    ? -2 : -1)
    rh2     = new Key( 4, () =>                                        -1     )
    rh3     = new Key( 3, () =>                                        -2     )
    
    rpinky1 = new Key( 2, () =>                                         1     )
    rpinky2 = new Key( 1, () =>                                        -1     )
    rpinky3 = new Key( 0, () =>                                        -2     )
    
    keys = [
        this.lh1, this.bis, this.lh2, this.lh3, this.lpinky1, this.lpinky2,
        this.rside, this.rh1, this.rh2, this.rh3, this.rpinky1, this.rpinky2, this.rpinky3
    ]
    
    constructor(bitmask) {
        if (this.keys.length !== NUM_KEYS)
            console.error('Assert failed.')
        
        if (!bitmask)
            return
        
        this.keys
            .filter(k => (bitmask & (2 ** k.index)) !== 0)
            .forEach(k => k.press())
        
    }
    
    get id() {
        let bitmask = this.pressedKeys.reduce((bitmask, key) => bitmask + (2 ** key.index), 0).toString(2)
        _.times(NUM_KEYS - bitmask.length, () => bitmask = '0' + bitmask)
        return bitmask
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
            case 1: return 'C#'
            case 2: return 'D'
            case 3: return 'D#'
            case 4: return 'E'
            case 5: return 'F'
            case 6: return 'F#'
            case 7: return 'G'
            case 8: return 'G#'
            case 9: return 'A'
            case 10: return 'A#'
            case 11: return 'B'
            default: return pitch.toString()
        }
    }
    
    distance(other) {
        // TODO: key-wise difference
    }
    
    get pressedKeys() {
        return this.keys.filter(k => k.pressed)
    }
    
    get redundant() {
        return this.keys.some(k => k.redundant)
    }
    
    get hasNeutralizingKeys() {
        let pressed = this.pressedKeys
        let hasKeyWithPitch = x => pressed.some(k => k.pitch == x)
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
}


function midiToPitch() {
    
}


export function allCombinations(ewi) {
    console.time('compute all combinations')
    
    let numCombinations = 2 ** ewi.keys.length;
    let fingerings = _.times(numCombinations, bitmask => new Ewi(bitmask))
    
    console.timeEnd('compute all combinations')
    console.log('combinations: ', fingerings.length)
   
    console.time('filter out redundant')
    fingerings = fingerings.filter(ewi => !ewi.redundant)
    console.timeEnd('filter out redundant')
    console.log('combinations: ', fingerings.length)
    
    console.time('filter out allRightPinkyKeysPressed')
    fingerings = fingerings.filter(ewi => !ewi.allRightPinkyKeysPressed)
    console.timeEnd('filter out allRightPinkyKeysPressed')
    console.log('combinations: ', fingerings.length)
    
    console.time('filter out neutralizing keys')
    fingerings = fingerings.filter(ewi => !ewi.hasNeutralizingKeys)
    console.timeEnd('filter out neutralizing keys')
    console.log('combinations: ', fingerings.length)
    
    console.time('group by pitch')
    let fingeringsByPitch = _.groupBy(fingerings, ewi => ewi.pitch)
    console.log(fingeringsByPitch)
    console.timeEnd('group by pitch')
    
    for (let pitch in fingeringsByPitch) {
        fingeringsByPitch[pitch] = _.sortBy(fingeringsByPitch[pitch], fingering => fingering.pressedKeys.length)
        
        console.log(fingeringsByPitch[pitch][0].note)
        console.log(fingeringsByPitch[pitch].slice(0,5).map(ewi => `${ewi.id}, ${ewi.pressedKeys.length}]`))
    }
    
   // TODO!: further/different sort criteria...
   // - distance to default fingering (smaller = better)
   // - number of 'gaps' between pressed keys?? (smaller = better)
   // - penalty for bis key?
   
   
   return fingeringsByPitch
}

export function defaultFingerings() {
    // TODO
}