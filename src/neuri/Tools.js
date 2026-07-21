class Tools{

    herramientas={

        buscarAlumno:true,

        leerPDF:true,

        leerNotas:true,

        leerAgenda:true,

        analizarConducta:true,

        generarIntervencion:true

    };

    existe(nombre){

        return this.herramientas[nombre];

    }

}

export default new Tools();