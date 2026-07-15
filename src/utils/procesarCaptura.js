export async function procesarCaptura(blob, modo = "documento"){

  return new Promise((resolve)=>{

      const imagen = new Image();

      imagen.onload = ()=>{

          const canvas = document.createElement("canvas");

          const ctx = canvas.getContext("2d");

          canvas.width = imagen.width;

          canvas.height = imagen.height;

          ctx.drawImage(imagen,0,0);

          // Si el usuario quiere la imagen original
          if(modo==="original"){

              canvas.toBlob(resolve,"image/jpeg",0.95);

              return;

          }

          const datos = ctx.getImageData(

              0,

              0,

              canvas.width,

              canvas.height

          );
              
          const pixeles = datos.data;

          balanceBlancos(pixeles);

          reducirRuido(pixeles, canvas.width, canvas.height);

          switch(modo){

            case "documento":
        
              ajustarBalanceBlancos(pixeles);

              eliminarSombras(pixeles);
              
              ajustarBrillo(pixeles);
              
              ajustarContraste(pixeles);
        
                break;
        
            case "color":
        
              ajustarBalanceBlancos(pixeles);

              eliminarSombras(pixeles);
              
              aumentarColor(pixeles);
              
              ajustarContrasteSuave(pixeles);
        
                break;
        
            case "byn":
        
                convertirBlancoNegro(pixeles);
        
                break;
        
        }

          aumentarNitidez(pixeles, canvas.width, canvas.height);

          function balanceBlancos(pixeles){

            let sumaR = 0;
            let sumaG = 0;
            let sumaB = 0;
        
            const totalPixeles = pixeles.length / 4;
        
            // Calcular promedios
            for(let i = 0; i < pixeles.length; i += 4){
        
                sumaR += pixeles[i];
                sumaG += pixeles[i + 1];
                sumaB += pixeles[i + 2];
        
            }
        
            const promedioR = sumaR / totalPixeles;
            const promedioG = sumaG / totalPixeles;
            const promedioB = sumaB / totalPixeles;
        
            // Tomamos el promedio general como referencia
            const promedio = (promedioR + promedioG + promedioB) / 3;
        
            const factorR = promedio / promedioR;
            const factorG = promedio / promedioG;
            const factorB = promedio / promedioB;
        
            // Aplicar corrección
            for(let i = 0; i < pixeles.length; i += 4){
        
                pixeles[i] = Math.min(255, pixeles[i] * factorR);
        
                pixeles[i + 1] = Math.min(255, pixeles[i + 1] * factorG);
        
                pixeles[i + 2] = Math.min(255, pixeles[i + 2] * factorB);
        
            }
        
        }

        function reducirRuido(pixeles, ancho, alto){

          // Copia para no modificar los datos mientras se recorren
          const copia = new Uint8ClampedArray(pixeles);
      
          for(let y = 1; y < alto - 1; y++){
      
              for(let x = 1; x < ancho - 1; x++){
      
                  let sumaR = 0;
                  let sumaG = 0;
                  let sumaB = 0;
      
                  // Vecindario 3x3
                  for(let dy = -1; dy <= 1; dy++){
      
                      for(let dx = -1; dx <= 1; dx++){
      
                          const indice = ((y + dy) * ancho + (x + dx)) * 4;
      
                          sumaR += copia[indice];
                          sumaG += copia[indice + 1];
                          sumaB += copia[indice + 2];
      
                      }
      
                  }
      
                  const i = (y * ancho + x) * 4;
      
                  pixeles[i]     = sumaR / 9;
                  pixeles[i + 1] = sumaG / 9;
                  pixeles[i + 2] = sumaB / 9;
      
              }
      
          }
      
      }

      function aumentarNitidez(pixeles, ancho, alto){

        const copia = new Uint8ClampedArray(pixeles);
    
        const kernel = [
    
             0,-1, 0,
    
            -1, 5,-1,
    
             0,-1, 0
    
        ];
    
        for(let y=1;y<alto-1;y++){
    
            for(let x=1;x<ancho-1;x++){
    
                let r=0;
                let g=0;
                let b=0;
    
                let k=0;
    
                for(let dy=-1;dy<=1;dy++){
    
                    for(let dx=-1;dx<=1;dx++){
    
                        const indice=((y+dy)*ancho+(x+dx))*4;
    
                        const peso=kernel[k++];
    
                        r+=copia[indice]*peso;
                        g+=copia[indice+1]*peso;
                        b+=copia[indice+2]*peso;
    
                    }
    
                }
    
                const i=(y*ancho+x)*4;
    
                pixeles[i]=Math.max(0,Math.min(255,r));
                pixeles[i+1]=Math.max(0,Math.min(255,g));
                pixeles[i+2]=Math.max(0,Math.min(255,b));
    
            }
    
        }
    
    }

    ctx.putImageData(datos,0,0);

    aplicarNitidez(canvas,ctx);
    
    canvas.toBlob(resolve,"image/jpeg",0.95);

      };

      imagen.src=URL.createObjectURL(blob);

  });

}
function ajustarBrillo(pixeles){

  for(let i=0;i<pixeles.length;i+=4){

      pixeles[i] = Math.min(255,pixeles[i]+18);

      pixeles[i+1] = Math.min(255,pixeles[i+1]+18);

      pixeles[i+2] = Math.min(255,pixeles[i+2]+18);

  }

}
function ajustarContraste(pixeles){

  const contraste = 1.25;

  for(let i=0;i<pixeles.length;i+=4){

      let r=((pixeles[i]-128)*contraste)+128;

      let g=((pixeles[i+1]-128)*contraste)+128;

      let b=((pixeles[i+2]-128)*contraste)+128;

      pixeles[i]=Math.max(0,Math.min(255,r));

      pixeles[i+1]=Math.max(0,Math.min(255,g));

      pixeles[i+2]=Math.max(0,Math.min(255,b));

  }

}

function aumentarColor(pixeles){

  for(let i=0;i<pixeles.length;i+=4){

      const factor = 1.18;

      const promedio =

          (pixeles[i] + pixeles[i+1] + pixeles[i+2]) / 3;

      pixeles[i] = Math.min(

          255,

          promedio + (pixeles[i]-promedio)*factor

      );

      pixeles[i+1] = Math.min(

          255,

          promedio + (pixeles[i+1]-promedio)*factor

      );

      pixeles[i+2] = Math.min(

          255,

          promedio + (pixeles[i+2]-promedio)*factor

      );

  }

}

function ajustarContrasteSuave(pixeles){

  const contraste = 1.10;

  for(let i=0;i<pixeles.length;i+=4){

      pixeles[i] =

      ((pixeles[i]-128)*contraste)+128;

      pixeles[i+1] =

      ((pixeles[i+1]-128)*contraste)+128;

      pixeles[i+2] =

      ((pixeles[i+2]-128)*contraste)+128;

  }

}

function convertirBlancoNegro(pixeles){

  for(let i=0;i<pixeles.length;i+=4){

      const gris =

          pixeles[i]*0.299 +

          pixeles[i+1]*0.587 +

          pixeles[i+2]*0.114;

      const color = gris > 160 ? 255 : 0;

      pixeles[i] = color;

      pixeles[i+1] = color;

      pixeles[i+2] = color;

  }

}

function ajustarBalanceBlancos(pixeles){

  let sumaR = 0;
  let sumaG = 0;
  let sumaB = 0;
  let cantidad = 0;

  for(let i = 0; i < pixeles.length; i += 4){

      sumaR += pixeles[i];
      sumaG += pixeles[i + 1];
      sumaB += pixeles[i + 2];
      cantidad++;

  }

  const promedioR = sumaR / cantidad;
  const promedioG = sumaG / cantidad;
  const promedioB = sumaB / cantidad;

  const gris = (promedioR + promedioG + promedioB) / 3;

  const factorR = gris / promedioR;
  const factorG = gris / promedioG;
  const factorB = gris / promedioB;

  for(let i = 0; i < pixeles.length; i += 4){

      pixeles[i] = Math.min(255, pixeles[i] * factorR);

      pixeles[i + 1] = Math.min(255, pixeles[i + 1] * factorG);

      pixeles[i + 2] = Math.min(255, pixeles[i + 2] * factorB);

  }

}

function aplicarNitidez(canvas, ctx){

  const width = canvas.width;
  const height = canvas.height;

  const original = ctx.getImageData(0,0,width,height);
  const copia = ctx.getImageData(0,0,width,height);

  const src = original.data;
  const dst = copia.data;

  const kernel = [

       0,-1, 0,
      -1, 5,-1,
       0,-1, 0

  ];

  for(let y=1;y<height-1;y++){

      for(let x=1;x<width-1;x++){

          let r=0;
          let g=0;
          let b=0;

          let k=0;

          for(let ky=-1;ky<=1;ky++){

              for(let kx=-1;kx<=1;kx++){

                  const indice=((y+ky)*width+(x+kx))*4;

                  r+=src[indice]*kernel[k];
                  g+=src[indice+1]*kernel[k];
                  b+=src[indice+2]*kernel[k];

                  k++;

              }

          }

          const i=(y*width+x)*4;

          dst[i]=Math.max(0,Math.min(255,r));
          dst[i+1]=Math.max(0,Math.min(255,g));
          dst[i+2]=Math.max(0,Math.min(255,b));

      }

  }

  ctx.putImageData(copia,0,0);

}
function eliminarSombras(pixeles){

  for(let i=0;i<pixeles.length;i+=4){

      let r = pixeles[i];
      let g = pixeles[i+1];
      let b = pixeles[i+2];

      const promedio = (r+g+b)/3;

      if(promedio<80){

          const factor = 1.55;

          r*=factor;
          g*=factor;
          b*=factor;

      }

      pixeles[i]=Math.min(255,r);
      pixeles[i+1]=Math.min(255,g);
      pixeles[i+2]=Math.min(255,b);

  }

}