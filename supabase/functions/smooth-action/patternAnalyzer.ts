export function analizarPatrones(contexto:any){

    const notas=contexto.notas ?? [];

    return{

        sesiones:notas.length,

        tieneSeguimiento:

            notas.length>=3,

        muchasObservaciones:

            notas.length>=8,

        requiereMonitoreo:

            notas.length>=10

    };

}