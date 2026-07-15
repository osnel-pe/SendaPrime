import { useRef, useEffect } from "react";

import { cargarOpenCV } from "../utils/opencv/cargarOpenCV.js";

export default function EditorRecorte({

    imagen,

    onCancelar,

    onGuardar

}){

    const canvasImagen = useRef(null);

    const canvasOverlay = useRef(null);

        useEffect(()=>{

            async function iniciar(){
        
                const cv = await cargarOpenCV();
        
                console.log("OpenCV listo");
        
                console.log(cv);
        
            }
        
            iniciar();
        
            cargarImagen();
        
        },[]);

    const puntos = useRef([

      { x: 80, y: 80 },
  
      { x: 520, y: 80 },
  
      { x: 520, y: 700 },
  
      { x: 80, y: 700 }
  
  ]);

  const puntoActivo = useRef(-1);

    async function cargarImagen(){

        const img = new Image();

        img.onload=()=>{

            const canvas = canvasImagen.current;

            const ctx = canvas.getContext("2d");

            canvas.width = img.width;

            canvas.height = img.height;

            ctx.drawImage(img,0,0);

            dibujarOverlay();

        };

        img.src = imagen;

    }

    function dibujarOverlay(){

      const canvas = canvasOverlay.current;
  
      const fondo = canvasImagen.current;
  
      canvas.width = fondo.width;
  
      canvas.height = fondo.height;
  
      const ctx = canvas.getContext("2d");
  
      ctx.clearRect(0,0,canvas.width,canvas.height);
  
      const p = puntos.current;
  
      // ==========================
      // POLÍGONO
      // ==========================
  
      ctx.beginPath();
  
      ctx.moveTo(p[0].x,p[0].y);
  
      ctx.lineTo(p[1].x,p[1].y);
  
      ctx.lineTo(p[2].x,p[2].y);
  
      ctx.lineTo(p[3].x,p[3].y);
  
      ctx.closePath();
  
      ctx.strokeStyle="#FFD400";
  
      ctx.lineWidth=4;
  
      ctx.stroke();
  
      // ==========================
      // ESQUINAS
      // ==========================
  
      p.forEach(punto=>{
  
          ctx.beginPath();
  
          ctx.arc(
  
              punto.x,
  
              punto.y,
  
              12,
  
              0,
  
              Math.PI*2
  
          );
  
          ctx.fillStyle="#2196F3";
  
          ctx.fill();
  
          ctx.lineWidth=3;
  
          ctx.strokeStyle="#FFFFFF";
  
          ctx.stroke();
  
      });
  
  }

  function obtenerPunto(x,y){

    const radio = 25;

    for(let i=0;i<puntos.current.length;i++){

        const p = puntos.current[i];

        const dx = x - p.x;

        const dy = y - p.y;

        if(Math.sqrt(dx*dx + dy*dy) <= radio){

            return i;

        }

    }

    return -1;

}

  function pointerDown(e){

    const rect = canvasOverlay.current.getBoundingClientRect();

    const escalaX = canvasOverlay.current.width / rect.width;

    const escalaY = canvasOverlay.current.height / rect.height;

    const x = (e.clientX - rect.left) * escalaX;

    const y = (e.clientY - rect.top) * escalaY;

    puntoActivo.current = obtenerPunto(x,y);

  }

  function pointerMove(e){

    if(puntoActivo.current === -1){

        return;

    }

    const rect = canvasOverlay.current.getBoundingClientRect();

    const escalaX = canvasOverlay.current.width / rect.width;

    const escalaY = canvasOverlay.current.height / rect.height;

    puntos.current[puntoActivo.current] = {

        x:(e.clientX-rect.left)*escalaX,

        y:(e.clientY-rect.top)*escalaY

    };

    dibujarOverlay();

}

function pointerUp(){

  puntoActivo.current = -1;

}

    return(

        <div className="editor-overlay">

            <div className="editor-panel">

                <div className="editor-contenedor">

                    <canvas

                        ref={canvasImagen}

                        className="canvas-imagen"

                    />

                    <canvas

                    ref={canvasOverlay}

                    className="canvas-overlay"

                    onPointerDown={pointerDown}

                    onPointerMove={pointerMove}

                    onPointerUp={pointerUp}

                    onPointerLeave={pointerUp}

                    onPointerCancel={pointerUp}

                    />

                </div>

                <div className="editor-botones">

                    <button onClick={onCancelar}>

                        Cancelar

                    </button>

                    <button onClick={()=>onGuardar()}>

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}