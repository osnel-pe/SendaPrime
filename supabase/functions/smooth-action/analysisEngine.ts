import { analizarRiesgo } from "./riskAnalyzer.ts";
import { analizarEmociones } from "./emotionAnalyzer.ts";
import { analizarPatrones } from "./patternAnalyzer.ts";
import { analizarProgreso } from "./progressAnalyzer.ts";
import { construirTimeline } from "./timelineEngine.ts";
import { generarDecision } from "./decisionEngine.ts";
import { generarRecomendaciones } from "./recommendationEngine.ts";
import { generarEstrategias } from "./strategyEngine.ts";
import { calcularPrioridad } from "./priorityEngine.ts";
import { generarDashboard } from "./dashboardEngine.ts";

export function analizarAlumno(contexto: any) {

    const riesgo =
        analizarRiesgo(contexto);

    const emociones =
        analizarEmociones(contexto);

    const patrones =
        analizarPatrones(contexto);

    const progreso =
        analizarProgreso(contexto);

    const timeline =
        construirTimeline(contexto);

    const decision =
        generarDecision({

            riesgo,

            emociones,

            patrones,

            progreso

        });

    const recomendaciones =
        generarRecomendaciones({

            riesgo,

            emociones,

            patrones,

            progreso

        });

    const estrategias =
        generarEstrategias({

            riesgo,

            emociones,

            patrones,

            progreso

        });

    const prioridad =
        calcularPrioridad({

            riesgo,

            emociones,

            patrones

        });

    const dashboard =
        generarDashboard(

            contexto,

            {

                riesgo,

                emociones

            }

        );

    return {

        riesgo,

        emociones,

        patrones,

        progreso,

        timeline,

        decision,

        recomendaciones,

        estrategias,

        prioridad,

        dashboard

    };

}