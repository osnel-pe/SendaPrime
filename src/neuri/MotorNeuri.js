import IntentAnalyzer from "./IntentAnalyzer";
import BuscadorAlumno from "./BuscadorAlumno";
import PromptBuilder from "./PromptBuilder";
import GroqService from "./GroqService";
import ContextBuilder from "./ContextBuilder";
import MemoryManager from "./MemoryManager";
import ToolManager from "./ToolManager";

class MotorNeuri{

    async responder({

        mensaje,

        alumnos

    }){

        const intencion=

            IntentAnalyzer.analizar(mensaje);

        let alumno=null;

        if(intencion.tipo==="buscarAlumno"){

            alumno=

            await ToolManager.ejecutar(

                "buscarAlumno",

                {

                    mensaje,

                    alumnos

                }

            );

        }

        const prompt=

        PromptBuilder.construir({

            alumno,

            mensaje,

            contexto:

            ContextBuilder.construir()

        });

        const respuesta=

        await GroqService.preguntar(prompt);

        MemoryManager.agregar(

            mensaje,

            respuesta

        );

        return{

            respuesta,

            alumno,

            intencion

        };

    }

}

export default new MotorNeuri();