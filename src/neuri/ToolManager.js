import BuscarAlumnoTool

from "./tools/BuscarAlumnoTool";

class ToolManager{

    herramientas={

        buscarAlumno:

        BuscarAlumnoTool

    };

    async ejecutar(

        nombre,

        parametros

    ){

        const herramienta=

        this.herramientas[nombre];

        if(!herramienta){

            return null;

        }

        return await herramienta.ejecutar(

            parametros

        );

    }

}

export default new ToolManager();