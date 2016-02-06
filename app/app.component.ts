import {Component} from 'angular2/core'
import {NgFor} from 'angular2/common'
import {Ewi, allCombinations} from './ewi'

// import {ButtonCheckbox} from 'ng2-bootstrap/ng2-bootstrap';

            // <label class="btn btn-primary" [(ngModel)]="ewi.bis.pressed" btnCheckbox>Bis</label>
            // <label class="btn btn-primary" [(ngModel)]="ewi.lh2.pressed" btnCheckbox>LH2</label>
            
        //             <div class="btn-group-vertical">
        //     <label class="btn btn-primary" [(ngModel)]="bar"
        //             btnCheckbox>LH1</label>
        // </div>
        
        // <div class="btn-group-vertical">
        //      <label class="btn btn-primary" [(ngModel)]="bar">LH1</label>
        //  </div>
        
const DEFAULT_BITMASK = '0011111110111'

@Component({
    selector: 'ewi-app',
    template: `
        <h2>EWI Fingering Tool</h2>
        <input type="text" class="form-control" #input (keyup)="changeBitmask(input.value)"
         value=${DEFAULT_BITMASK}>

        <pre>
            {{render()}}
        </pre>
        Alternate fingerings: {{fingeringsByPitch[ewi.pitch].length - 1}} <br>
        Top 10: <br>
        <div *ngFor="#ewi of fingeringsByPitch[ewi.pitch].slice(0, 10)">{{ ewi.id }}</div>
        
        
    `,
    // directives: [ButtonCheckbox]
})
export class AppComponent { 
    ewi = new Ewi(parseInt(DEFAULT_BITMASK, 2))
    fingeringsByPitch
    
    constructor() {
        this.fingeringsByPitch = allCombinations(this.ewi)
    }
    
    changeBitmask(bitmask){
        this.ewi = new Ewi(parseInt(bitmask, 2))
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

            Note: ${this.ewi.note}
            Bitmask: ${this.ewi.id}
        `
    }
}
