import { useRef, useEffect, useLayoutEffect} from 'react';


export default function Slider(props) {
    const dividerEL = useRef(null);

    function getPosition () {
        const offset = (0.5 - props.sliderEL.current.value) * 42// (this.options.thumbSize) = 42
        return props.map.getSize()[0] * props.sliderEL.current.value + offset
    }

    const handleRange = (e) => {
        dividerEL.current.style.left = getPosition() + 'px'
        props.map.render()
        // console.log(e.target.value)
    }

    useEffect(() => {
        props.sliderEL.current.value = 0.5
    }, [])
    
    return(
        <div className="leaflet-sbs">
            <div className="leaflet-sbs-divider" ref={dividerEL}></div>
            <input className="leaflet-sbs-range" type="range" min="0" max="1" step="any" ref={props.sliderEL} 
            onChange={handleRange}/>
        </div>
    );
}