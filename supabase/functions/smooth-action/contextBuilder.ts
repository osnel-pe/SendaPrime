import { buscarNotas } from "./buscarNotas.ts";

import { buscarCitas } from "./buscarCitas.ts";

import { buscarExpediente } from "./buscarExpediente.ts";

import { seleccionarHerramientas } from "./toolManager.ts";

import type {
    Alumno,
    ContextoAlumno
} from "./types.ts";


export async function construirContexto(

    alumno: Alumno,

    mensaje: string

): Promise<ContextoAlumno> {


    const tools =

        seleccionarHerramientas(

            mensaje

        );


    const contexto: ContextoAlumno = {

        alumno,

        notas: [],

        citas: [],

        expediente: []

    };


    if (

        tools.notas

    ) {

        contexto.notas =

            await buscarNotas(

                alumno.id

            );

    }


    if (

        tools.citas

    ) {

        contexto.citas =

            await buscarCitas(

                alumno.id

            );

    }


    if (

        tools.expediente

    ) {

        contexto.expediente =

            await buscarExpediente(

                alumno.id

            );

    }


    return contexto;

}