class ToolRegistry{

    herramientas=[

        {

            nombre:"buscarAlumno",

            descripcion:

            "Busca un alumno."

        },

        {

            nombre:"buscarNotas",

            descripcion:

            "Obtiene notas."

        },

        {

            nombre:"buscarPDF",

            descripcion:

            "Lee expedientes."

        },

        {

            nombre:"buscarAgenda",

            descripcion:

            "Consulta citas."

        },

        {

            nombre:"buscarConducta",

            descripcion:

            "Analiza conducta."

        }

    ];

    obtener(){

        return this.herramientas;

    }

}

export default new ToolRegistry();