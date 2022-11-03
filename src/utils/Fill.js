import * as ss from 'simple-statistics'

import Palette from './Palette'

export class Fill {

    updateParameters(arr_values, method, scheme, palette, n_classes) {
        if(arr_values !== null) this.arr_values = arr_values.sort(function(a, b){return b-a})

        if(method !== null) this.method = method

        if(scheme !== null) this.scheme = scheme

        if(palette !== null) this.palette = palette

        if(n_classes !== null) this.n_classes = n_classes
        
        this.setRanges()
    }

    //function to set ranges according to method
    setRanges() {
        switch(this.method) {
            case 'quantile':
                this.setQuantilesBreaks()
                break
            case 'jenks':
                this.setJenksBreaks()
                break
            default:
                this.setQuantilesBreaks()

        }
    }

    //function to generate natural breaks (Jenks)
    setJenksBreaks() {
        const steps = ss.jenks(this.arr_values, this.n_classes)

        this.steps = steps        
    }
    
    //function to quantilize
    setQuantilesBreaks() {
        let steps = []
        const inc = 1 / this.n_classes
        for (let i = 0; i < this.n_classes; i++) {
            steps.push(ss.quantile(this.arr_values, (inc * i)))
        }
            
        this.steps = steps
    }

    getRank(value) {
        return (this.steps[this.steps.length - 1] < value) ? (this.n_classes - 1) : 
            this.steps.findIndex((step) => step >= value)
    }

    getColor(value) {
        return Palette.getColors()[this.scheme][this.palette][this.n_classes][this.getRank(value)]
    }
}

