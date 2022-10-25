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

export default class Palette {
    static getColors() {
        return colors
    }
}
