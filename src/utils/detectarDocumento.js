export function detectarDocumento(imageData){

  const { width, height, data } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for(let y=0;y<height;y++){

      for(let x=0;x<width;x++){

          const i = (y*width+x)*4;

          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];

          const brillo = (r+g+b)/3;

          if(brillo>180){

              if(x<minX) minX=x;
              if(y<minY) minY=y;

              if(x>maxX) maxX=x;
              if(y>maxY) maxY=y;

          }

      }

  }

  return{

      x:minX,
      y:minY,
      width:maxX-minX,
      height:maxY-minY

  };

}