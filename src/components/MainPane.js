import Map from './MapGeo'
import LayerList from './loadWFS' 

function MainPane() {
    return (
        <div>
            <LayerList />
            <Map />
        </div>
    
    );
}

export default MainPane