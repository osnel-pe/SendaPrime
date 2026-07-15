export async function mejorarImagen(blob) {

  return new Promise((resolve) => {

      const imagen = new Image();

      imagen.onload = () => {

          const canvas = document.createElement("canvas");

          const ctx = canvas.getContext("2d", {
              willReadFrequently: true
          });

          canvas.width = imagen.width;
          canvas.height = imagen.height;

          ctx.drawImage(imagen, 0, 0);

          const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
          );

          const datos = imageData.data;

          for (let i = 0; i < datos.length; i += 4) {

              const gris =
                  datos[i] * 0.30 +
                  datos[i + 1] * 0.59 +
                  datos[i + 2] * 0.11;

              let color = gris;

              // aumentar contraste
              color = (color - 128) * 1.55 + 128;

              // aclarar fondo
              if (color > 170) color = 255;

              // oscurecer texto
              if (color < 110) color = 0;

              datos[i] = color;
              datos[i + 1] = color;
              datos[i + 2] = color;
          }

          ctx.putImageData(imageData, 0, 0);

          canvas.toBlob(

              (nuevoBlob) => {

                  resolve(nuevoBlob);

              },

              "image/jpeg",

              0.98

          );

      };

      imagen.src = URL.createObjectURL(blob);

  });

}