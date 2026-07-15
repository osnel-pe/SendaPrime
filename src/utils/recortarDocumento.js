export async function recortarDocumento(blob){

  return new Promise((resolve)=>{

      const imagen = new Image();

      imagen.onload=()=>{

          const canvas=document.createElement("canvas");
          const ctx=canvas.getContext("2d");

          canvas.width=imagen.width;
          canvas.height=imagen.height;

          ctx.drawImage(imagen,0,0);

          // Obtener píxeles
          const datos=ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
          );

          console.log(
              "Resolución:",
              canvas.width,
              "x",
              canvas.height
          );

          // Por ahora devolvemos la imagen original
          resolve(blob);

      };

      imagen.src=URL.createObjectURL(blob);

  });

}