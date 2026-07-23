export function resumirAlumno(

    contexto:any

){

    return{

        nombre:

        contexto.alumno.nombre,

        edad:

        contexto.alumno.edad,

        grado:

        contexto.alumno.grado,

        notas:

        contexto.notas.length,

        citas:

        contexto.citas.length,

        ultimaNota:

        contexto.notas[0] ?? null

    };

}