export default function Slider(props) {
    return(
        <div className="leaflet-sbs">
            <div className="leaflet-sbs-divider"></div>
            <input className="leaflet-sbs-range" type="range" min="0" max="1" step="any" />
        </div>
    );
}