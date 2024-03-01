import { useRef, useEffect, useLayoutEffect } from 'react';


export default function Slider(props) {
    const sliderEL = useRef(null);
    const dividerEL = useRef(null);

    function getPosition () {
        var rangeValue = sliderEL.current.value
        var offset = (0.5 - rangeValue) * 42// (this.options.thumbSize) = 42
        return props.map.getSize()[0] * rangeValue + offset
    }

    function updateClip() {
        props.changeDX(getPosition())
    }

    useEffect(() => {
        dividerEL.current.style.left = props.dividerX + 'px'
        props.viewer.resize()
    }, [props.dividerX])

    useEffect(() => {
        sliderEL.current.value = 0.5 //initial value
        updateClip()
    }, [])
    
    return(
        <div className="leaflet-sbs">
            <div className="leaflet-sbs-divider" ref={dividerEL}></div>
            <input className="leaflet-sbs-range" type="range" min="0" max="1" step="any" ref={sliderEL} onChange={updateClip}/>
        </div>
    );
}