import React, { useEffect, useRef } from "react";
import {Viewer} from 'mapillary-js';

export default function ViewerComponent(props) {
	const containerRef = useRef()

  useEffect(() => {
      const viewer = new Viewer({
        accessToken: 'MLY|9006973349373388|91a175c294e87cd0e18a346877811833',
        container: containerRef.current,
        imageId: '479847819734993',
        component: {cover: false},
      })


      return () => {
        viewer.remove()
      }

  },[])

  return (
    <div ref={containerRef} style={{width: '100%', height: '800px'}} />
  );
}