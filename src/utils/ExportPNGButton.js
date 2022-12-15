import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import html2canvas from 'html2canvas';

export default function ExportPNGButton(props) {
    const button = useRef(null);
    const map = props.map
    const legend = map.getViewport().querySelectorAll('.ol-legend')[0]

    function handleClick() {
        map.once('rendercomplete', function () {
            const mapCanvas = document.createElement('canvas');
            const size = map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            const mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
              map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
              function (canvas) {
                if (canvas.width > 0) {
                  mapContext.drawImage(canvas, 0, 0);
                }
              }
            );
            mapContext.globalAlpha = 1;
            mapContext.setTransform(1, 0, 0, 1, 0, 0);
            
            if(legend) {
                html2canvas().then(canvas => {
                    const legendX = (mapContext.canvas.width - canvas.width)
                    const legendY = (mapContext.canvas.height - canvas.height)
                    mapContext.drawImage(canvas, legendX, legendY);
                });
            } else {
                const link = document.getElementById('image-download');
                link.href = mapCanvas.toDataURL();
                link.click();
            }

          });
          map.renderSync();
    }

    return (
        <div>
            <Button variant="outlined" endIcon={<PhotoSizeSelectActualOutlinedIcon />} sx={{height: '100%'}}
                ref={button}
                onClick={handleClick} >
                Export
            </Button>
            <a id="image-download" download="map.png"></a>
        </div>
  )
}