import { calcularScore } from "./scoringEngine.ts";

export function analizarRiesgo(contexto:any){

    const score=

    calcularScore(contexto);

    let nivel="BAJO";

    if(score>=80){

        nivel="CRÍTICO";

    }

    else if(score>=60){

        nivel="ALTO";

    }

    else if(score>=35){

        nivel="MEDIO";

    }

    return{

        score,

        nivel,

        prioridad:

        Math.round(score/10)

    };

}