import { useRef, useEffect } from 'react';


export default function Slider(props) {
    const sliderEL = useRef(null);
    const dividerEL = useRef(null);

    function handleMove() {
        updateClip()
    }

    function getPosition () {
        var rangeValue = sliderEL.current.value
        var offset = (0.5 - rangeValue) * 42// (this.options.thumbSize) = 42
        return props.map.getSize()[0] * rangeValue + offset
    }

    function updateClip() {
        var dividerX = getPosition()
        dividerEL.current.style.left = dividerX + 'px'
    }

    useEffect(() => {
        sliderEL.current.value = 0.5
    },[])

    
    return(
        <div className="leaflet-sbs">
            <div className="leaflet-sbs-divider" ref={dividerEL}></div>
            <input className="leaflet-sbs-range" type="range" min="0" max="1" step="any" ref={sliderEL} onChange={handleMove}/>
        </div>
    );
}