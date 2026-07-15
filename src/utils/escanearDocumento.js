export async function escanearDocumento(blob){

    return new Promise((resolve,reject)=>{

        const imagen = new Image();

        imagen.onload=()=>{

            try{

                const canvas=document.createElement("canvas");

                canvas.width=imagen.width;

                canvas.height=imagen.height;

                const ctx=canvas.getContext("2d");

                ctx.drawImage(imagen,0,0);

                const resultado=scanner.extractPaper(
                    canvas,
                    canvas.width,
                    canvas.height
                );

                resultado.toBlob(

                    (blobFinal)=>{

                        resolve(blobFinal);

                    },

                    "image/jpeg",

                    0.95

                );

            }

            catch(error){

                console.log("No se detectó documento.");

                resolve(blob);

            }

        };

        imagen.onerror=reject;

        imagen.src=URL.createObjectURL(blob);

    });

}