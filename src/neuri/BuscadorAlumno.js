class BuscadorAlumno {

    buscar(mensaje, alumnos){

        const texto = mensaje.toLowerCase();

        for(const alumno of alumnos){

            const nombre =
                alumno.nombre?.toLowerCase() || "";

            const paterno =
                alumno.apellido_paterno?.toLowerCase() || "";

            const materno =
                alumno.apellido_materno?.toLowerCase() || "";

            const nombreCompleto =
                `${nombre} ${paterno} ${materno}`;

            if(

                texto.includes(nombreCompleto) ||

                texto.includes(nombre) ||

                texto.includes(paterno) ||

                texto.includes(materno)

            ){

                return alumno;

            }

        }

        return null;

    }

}

export default new BuscadorAlumno();