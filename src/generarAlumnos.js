const nombresHombre = [
  "Juan","Luis","Carlos","Miguel","José","Pedro","Jorge","Diego","Raúl","Daniel",
  "Eduardo","Fernando","Ricardo","Mario","Arturo","Emilio","Gabriel","Manuel","Adrián","Hugo"
  ];
  
  const nombresMujer = [
  "María","Ana","Sofía","Fernanda","Andrea","Valeria","Camila","Paula","Daniela","Laura",
  "Gabriela","Lucía","Elena","Patricia","Karla","Alejandra","Diana","Mónica","Rosa","Cecilia"
  ];
  
  const apellidos = [
  "García","Hernández","López","Martínez","González","Pérez","Rodríguez","Sánchez",
  "Ramírez","Torres","Flores","Rivera","Gómez","Díaz","Vargas","Morales","Castro",
  "Ortiz","Ruiz","Jiménez","Navarro","Rojas","Silva","Mendoza","Cruz","Reyes"
  ];
  
  const grupos = [
  "1A","1B","1C",
  "2A","2B","2C"
  ];
  
  export function generarAlumnos(){
  
  let alumnos=[];
  
  grupos.forEach(grupo=>{
  
  for(let i=0;i<30;i++){
  
  const hombre=Math.random()>0.5;
  
  const nombres=hombre?nombresHombre:nombresMujer;
  
  alumnos.push({
  
  nombre:nombres[Math.floor(Math.random()*nombres.length)],
  
  apellido_paterno:
  apellidos[Math.floor(Math.random()*apellidos.length)],
  
  apellido_materno:
  apellidos[Math.floor(Math.random()*apellidos.length)],
  
  sexo:hombre?"Masculino":"Femenino",
  
  grupo,
  
  saldo:50,
  
  nivel:1
  
  });
  
  }
  
  });
  
  return alumnos;
  
  }