class IntentAnalyzer {

    analizar(mensaje){

        const texto = mensaje.toLowerCase();

        //-------------------------------------------------
        // Buscar alumno
        //-------------------------------------------------

        if(

            texto.includes("analiza") ||

            texto.includes("analizar") ||

            texto.includes("expediente") ||

            texto.includes("perfil") ||

            texto.includes("alumno") ||

            texto.includes("estudiante")

        ){

            return{

                tipo:"buscarAlumno"

            };

        }

        //-------------------------------------------------
        // Buscar PDF
        //-------------------------------------------------

        if(

            texto.includes("pdf") ||

            texto.includes("archivo") ||

            texto.includes("documento")

        ){

            return{

                tipo:"leerPDF"

            };

        }

        //-------------------------------------------------
        // Estrategias
        //-------------------------------------------------

        if(

            texto.includes("estrategia") ||

            texto.includes("intervención") ||

            texto.includes("plan")

        ){

            return{

                tipo:"estrategia"

            };

        }

        //-------------------------------------------------

        return{

            tipo:"general"

        };

    }

}

export default new IntentAnalyzer();