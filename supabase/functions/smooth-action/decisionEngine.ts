export function generarDecision(analisis:any){

    if(

        analisis.riesgo.nivel==="ALTO"

    ){

        return{

            prioridad:"URGENTE"

        };

    }

    if(

        analisis.patrones.requiereMonitoreo

    ){

        return{

            prioridad:"ALTA"

        };

    }

    return{

        prioridad:"NORMAL"

    };

}