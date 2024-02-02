import React, { useEffect, useRef } from "react";
import {Viewer} from 'mapillary-js';

export default function ViewerComponent(props) {
	const containerRef = useRef()

  useEffect(() => {
            
    const viewer = new Viewer({
      accessToken: 'MLY|9006973349373388|91a175c294e87cd0e18a346877811833',
      container: containerRef.current,
      component: {cover: false},
    })

    props.changeViewer(viewer)

    return () => {
      if(viewer !== null)
        viewer.remove()
    }

  },[])

  return (
    <div ref={containerRef} style={{width:props.dividerX + "px" , height: '800px'}} />
  );
}