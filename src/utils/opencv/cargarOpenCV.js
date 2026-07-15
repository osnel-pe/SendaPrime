let cargando = null;

export async function cargarOpenCV(){

    if(window.cv){

        return window.cv;

    }

    if(cargando){

        return cargando;

    }

    cargando = new Promise((resolve,reject)=>{

        const script = document.createElement("script");

        script.src = "https://docs.opencv.org/4.x/opencv.js";

        script.async = true;

        script.onload = ()=>{

            const esperar = ()=>{

                if(window.cv && window.cv.Mat){

                    resolve(window.cv);

                }

                else{

                    requestAnimationFrame(esperar);

                }

            };

            esperar();

        };

        script.onerror=()=>{

            reject("No fue posible cargar OpenCV");

        };

        document.body.appendChild(script);

    });

    return cargando;

}