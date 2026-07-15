export async function leerDocumento(archivo){

  console.log("Leyendo documento...");

  return new Promise((resolve)=>{

      setTimeout(()=>{

          resolve({

              texto:

              "Texto de prueba obtenido del OCR."

          });

      },1500);

  });

}