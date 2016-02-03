import {Component} from 'angular2/core'
import {Ewi, allCombinations} from './ewi'


@Component({
    selector: 'ewi-app',
    template: `
        <h2>EWI Fingering Tool</h2>
        <pre>
            {{render()}}
        </pre>
    `
})
export class AppComponent { 
    ewi = new Ewi(0b1111111110111)
    
    constructor() {
        allCombinations(this.ewi)
    }
    
    render() {
        
        return `
            lh1: ${this.ewi.lh1.pressed}
            bis: ${this.ewi.bis.pressed}
            lh2: ${this.ewi.lh2.pressed}
            lh3: ${this.ewi.lh3.pressed}
            lpinky1: ${this.ewi.lpinky1.pressed}
            lpinky2: ${this.ewi.lpinky2.pressed}
            rside: ${this.ewi.rside.pressed}
            rh1: ${this.ewi.rh1.pressed}
            rh2: ${this.ewi.rh2.pressed}
            rh3: ${this.ewi.rh3.pressed}
            rpinky1: ${this.ewi.rpinky1.pressed}
            rpinky2: ${this.ewi.rpinky2.pressed}
            rpinky3: ${this.ewi.rpinky3.pressed}

            ${this.ewi.note}
            ${this.ewi.id}
        `
    }
}
