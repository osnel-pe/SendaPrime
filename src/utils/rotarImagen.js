export async function rotarImagen(archivo, grados = 90){

  console.log("Entré a rotarImagen");

  return new Promise((resolve)=>{

      const imagen = new Image();

      imagen.onload = ()=>{

        console.log("Imagen cargada");

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const rotacion = ((grados % 360) + 360) % 360;

          if(rotacion===90 || rotacion===270){

              canvas.width = imagen.height;
              canvas.height = imagen.width;

          }else{

              canvas.width = imagen.width;
              canvas.height = imagen.height;

          }

          ctx.translate(
              canvas.width/2,
              canvas.height/2
          );

          ctx.rotate(rotacion*Math.PI/180);

          ctx.drawImage(
              imagen,
              -imagen.width/2,
              -imagen.height/2
          );

          canvas.toBlob((blob)=>{

            console.log("Blob generado:", blob);
        
            if(!blob){
        
                console.log("No se pudo generar el blob");
        
                return;
        
            }
        
            const nuevoArchivo = new File(
        
                [blob],
        
                archivo.name,
        
                {
        
                    type:"image/jpeg"
        
                }
        
            );
        
            const nuevaUrl = URL.createObjectURL(blob);
        
            console.log("Nueva URL:", nuevaUrl);
        
            resolve({
        
                archivo:nuevoArchivo,
        
                url:nuevaUrl
        
            });

            console.log("Resolviendo imagen rotada");
        
        },"image/jpeg",0.95);

      };

      imagen.src = URL.createObjectURL(archivo);

  });

}