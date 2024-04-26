import { useRef, useEffect, useLayoutEffect} from 'react';


export default function Slider(props) {
    const dividerEL = useRef(null);

    function getPosition () {
        var offset = (0.5 - props.rangeValue) * 42// (this.options.thumbSize) = 42
        return props.map.getSize()[0] * props.rangeValue + offset
    }

    const handleRange = (e) => {
        props.setRange(e.target.value)
    }

    useEffect(() => {
        props.changeDX(getPosition())
        dividerEL.current.style.left = props.dividerX + 'px'
        props.map.render()
    }, [props.rangeValue])
    
    return(
        <div className="leaflet-sbs">
            <div className="leaflet-sbs-divider" ref={dividerEL}></div>
            <input className="leaflet-sbs-range" value={props.rangeValue} type="range" min="0" max="1" step="any" ref={props.sliderEL} 
            onChange={handleRange}/>
        </div>
    );
}