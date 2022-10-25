import * as ss from 'simple-statistics'
import Palette from './Palette'

export class Fill {

    constructor (arr_values, method, palette, n_classes) {
        //sort array of attribute values
        this.arr_values = arr_values.sort(function(a, b){return b-a});
        this.method = method
        this.palette = palette
        this.n_classes = n_classes

        this.setQuantiles()
    }

    updateParameters(arr_values, method, palette, n_classes) {
        if(arr_values !== null) {
            this.arr_values = arr_values
        }

        if(method !== null) {
            this.method = method
        }

        if(palette !== null) {
            this.palette = palette
        }

        if(n_classes !== null) {
            this.n_classes = n_classes
        }

        this.setQuantiles()
    }
    
    //function to quantilize
    setQuantiles() {
        let quantiles = []
        const inc = 1 / this.n_classes
        for (let i = 0; i < this.n_classes; i++) {
            quantiles.push(ss.quantile(this.arr_values, (inc * i)))
        }
            
        this.quantiles = quantiles
    }

    getQuantileRank(value) {
        return (this.quantiles[this.quantiles.length - 1] < value) ? (this.n_classes -1) : 
            this.quantiles.findIndex((quantile) => quantile >= value)
    }

    getColor(value) {
        return Palette.getColors()[this.palette][this.n_classes][this.getQuantileRank(value)]
    }
}

