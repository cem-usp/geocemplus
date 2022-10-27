const colors = {
    'sequential': {
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

    },
    'diverging': {
        'BrBG': {
            5: ['#a6611a', '#dfc27d', '#f5f5f5', '#80cdc1', '#018571'],
            6: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
            7: ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e']
        },
        'PRGn': {
            5: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
            6: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
            7: ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837']
        },
        'RdYlBu': {
            5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
            6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
            7: ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4']
        },

    },
    'qualitative': {
        'Dark2': {
            5: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
            6: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
            7: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'],
        },
        'Set1': {
            5: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
            6: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
            7: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628']
        },
        'RdYlBu': {
            5: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3'],
            6: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462'],
            7: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69']
        },

    },
}

export default class Palette {

    static getColors() {
        return colors
    }
}
