export function construirContextoAlumno({

    alumno,

    notas = [],

    citas = [],

    expedientes = []

}) {

    const contexto = {

        alumno: alumno || null,

        notas: notas.slice(0, 20),

        citas: citas.slice(0, 10),

        expedientes: expedientes.slice(0, 20)

    };

    return JSON.stringify(

        contexto,

        null,

        2

    );

}