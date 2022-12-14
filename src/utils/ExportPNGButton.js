import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import html2canvas from 'html2canvas';

export default function ExportPNGButton(props) {
    const button = useRef(null);
    const map = props.map
    
    function handleClick() {
      const legend = map.getViewport().querySelectorAll('.ol-legend')[0]
      const title = map.getViewport().querySelectorAll('.ol-title')[0]
        map.once('rendercomplete', async function () {
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
            
            if (legend !== undefined) {
              const legendCanvas = await html2canvas(legend)
              const legendX = (mapContext.canvas.width - legendCanvas.width)
              const legendY = (mapContext.canvas.height - legendCanvas.height)
              mapContext.drawImage(legendCanvas, legendX, legendY);
            }

            if (title !== undefined) {
              console.log(title)
              const titleCanvas = await html2canvas(title)
              const titleX = (mapContext.canvas.width - titleCanvas.width)
              const titleY = 0
              mapContext.drawImage(titleCanvas, titleX, titleY);
            }
            
            const link = document.getElementById('image-download');
            link.href = mapCanvas.toDataURL();
            link.click();

        });
        
        map.renderSync();
    }

    return (
        <div>
            <Button variant="outlined" endIcon={<PhotoSizeSelectActualOutlinedIcon />} sx={{height: '100%'}}
                ref={button}
                onClick={handleClick} >
                Exportar
            </Button>
            <a id="image-download" download="map.png"></a>
        </div>
  )
}