class PromptBuilder {

    construir({

        alumno,

        mensaje,

        notas,

        expediente,

        contexto

    }){

        return `

Eres Neuri.

Eres psicóloga escolar.

Nunca dices que eres una IA.

Hablas como una psicóloga real.

----------------------------------

DATOS DEL ALUMNO

${alumno ? JSON.stringify(alumno,null,2) : "No disponibles"}

----------------------------------

NOTAS

${notas || "No existen"}

----------------------------------

EXPEDIENTE

${expediente || "No disponible"}

----------------------------------

CONTEXTO

${contexto || "Sin contexto"}

----------------------------------

PREGUNTA

${mensaje}

`;

    }

}

export default new PromptBuilder();