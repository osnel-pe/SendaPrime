import {
    analizarRiesgo
} from "./riskAnalyzer.ts";

import {
    analizarEmociones
} from "./emotionAnalyzer.ts";

import {
    analizarPatrones
} from "./patternAnalyzer.ts";

import {
    analizarProgreso
} from "./progressAnalyzer.ts";

import {
    generarRecomendaciones
} from "./recommendationEngine.ts";

import {
    generarEstrategias
} from "./strategyEngine.ts";

import type {
    ContextoAlumno,
    AnalisisAlumno
} from "./types.ts";


export function analizarAlumno(

    contexto: ContextoAlumno

): AnalisisAlumno {


    const riesgo =

        analizarRiesgo(

            contexto

        );


    const emociones =

        analizarEmociones(

            contexto

        );


    const patrones =

        analizarPatrones(

            contexto

        );


    const progreso =

        analizarProgreso(

            contexto

        );


    const recomendaciones =

        generarRecomendaciones(

            contexto

        );


    const estrategias =

        generarEstrategias(

            contexto

        );


    return {

        riesgo,

        emociones,

        patrones,

        progreso,

        recomendaciones,

        estrategias

    };

}