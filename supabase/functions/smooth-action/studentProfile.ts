export function crearPerfil(contexto:any){

    return{

        alumno:{

            id:contexto.alumno.id,

            nombre:

            `${

                contexto.alumno.nombre

            }

            ${

                contexto.alumno.apellido_paterno ?? ""

            }`

        },

        totalNotas:

        contexto.notas.length,

        totalCitas:

        contexto.citas.length,

        ultimaNota:

        contexto.notas[0] ?? null,

        ultimaCita:

        contexto.citas[0] ?? null

    };

}