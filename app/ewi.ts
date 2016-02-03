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
    
    constructor(bitmask?: number) {
        if (!bitmask)
            return
        
        this.keys
            .filter(k => (bitmask & (2 ** k.index)) !== 0)
            .forEach(k => k.press())
        
    }
    
    get pitch() {
        return this.basePitch + this.keys
            .filter(key => key.pressed)
            .map(key => key.pitch)
            .reduce((prev, cur) => prev + cur, 0)
    }
    
    get note() {
        let pitch = this.pitch % 12
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
        }
    }
    
    distance(other: Ewi) {
        // TODO: key-wise difference
    }
    
    get pressedKeys() {
        return this.keys.filter(k => k.pressed)
    }
    
    get redundant(): boolean {
        return this.keys.some(k => k.redundant)
    }
    
    get hasNeutralizingKeys(): boolean {
        let pressed = this.pressedKeys
        let hasKeyWithPitch = x => pressed.some(k => k.pitch == x)
        return hasKeyWithPitch(1) && hasKeyWithPitch(-1)
    }
    
    get allRightPinkyKeysPressed(): boolean {
        return this.rpinky1.pressed && this.rpinky2.pressed && this.rpinky3.pressed
    }
}

class Key {
    constructor(public index, private _pitch: () => number, public pressed=false) {}
    
    get pitch(): number {
        return this._pitch()
    }
    
    get redundant(): boolean {
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


function allCombinations(ewi) {
    // TODO: compute all combinations    

    // TODO: filter out equivalent combinations that are supersets of others (...when bis/rside are inactive)
}
