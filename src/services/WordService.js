export async function generarWord(datos){

  console.log("Generando Word...");

  return new Promise((resolve)=>{

      setTimeout(()=>{

          resolve({

              nombreArchivo:

              "FichaGeneral.docx"

          });

      },1200);

  });

}