import * as ss from 'simple-statistics'

import Palette from './Palette'

export class Fill {

    updateParameters(arr_values, method, scheme, palette, n_classes) {
        if(arr_values !== null){ 
            //Only numbers
            arr_values = arr_values.filter(Number);
            //Ordena Vetor
            this.arr_values = arr_values.sort(function(a, b){return a-b})
        }

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
        //Remove first (min) element
        steps.shift()
        this.steps = steps        
    }
    
    //function to quantilize
    setQuantilesBreaks() {
        let steps = []
        const inc = 1 / this.n_classes
        for (let i = 1; i < this.n_classes + 1; i++) {
            const step = ss.quantileSorted(this.arr_values, (inc * i))
            steps.push(step)
        }
        this.steps = steps
    }

    getRank(value) {
        return (this.steps[this.steps.length - 1] <= value) ? (this.n_classes - 1) : 
            this.steps.findIndex((step) => step >= value)
    }

    getColor(value) {
        return (value !== null) ? Palette.getColors()[this.scheme][this.palette][this.n_classes][this.getRank(value)] : 'rgba(128, 128, 128, 0.7)'
    }

    findStartValue(rank) {
        const index = (rank > 0) ? this.arr_values.findIndex((value) => value > this.steps[rank - 1]) : 0
        return this.arr_values[index]
    }

    getColors() {
        const nclasses = this.n_classes
        const colors = []
        for (let i = (this.n_classes - 1); i >= 0; i--) {
            const color = Palette.getColors()[this.scheme][this.palette][this.n_classes][i]
            colors.push({color: color, interval: {
                start: this.findStartValue(i),
                end: this.steps[i] 
                }
            })
        }
        return colors
    }
}

