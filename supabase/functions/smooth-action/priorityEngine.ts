export function calcularPrioridad(

    analisis:any

){

    if(

        analisis.riesgo.score>=85

    ){

        return{

            color:"rojo",

            prioridad:"URGENTE"

        };

    }

    if(

        analisis.riesgo.score>=60

    ){

        return{

            color:"naranja",

            prioridad:"ALTA"

        };

    }

    if(

        analisis.riesgo.score>=35

    ){

        return{

            color:"amarillo",

            prioridad:"MEDIA"

        };

    }

    return{

        color:"verde",

        prioridad:"NORMAL"

    };

}