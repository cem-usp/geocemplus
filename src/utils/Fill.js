import * as ss from 'simple-statistics'

const colors = {
    'GREEN': {
        5: ['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'],
        6: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#2ca25f', '#006d2c'],
        7: ['#edf8fb', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#005824']
    },
    'RED': {
        5: ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'],
        6: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000'],
        7: ['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000']
    },
    'BLUE': {
        5: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],
        6: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#2b8cbe', '#045a8d'],
        7: ['#f1eef6', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#034e7b']
    },
}

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
        return colors[this.palette][this.n_classes][this.getQuantileRank(value)]
    }
}

