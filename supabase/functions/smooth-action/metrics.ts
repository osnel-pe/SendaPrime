export interface Metrica {

    nombre: string;

    tiempo: number;

    fecha: string;

}

const metricas: Metrica[] = [];

export function medirTiempo(

    nombre: string,

    tiempo: number

): void {

    const metrica: Metrica = {

        nombre,

        tiempo,

        fecha: new Date().toISOString()

    };

    metricas.push(metrica);

    console.log(

        `[NEURI METRICS] ${nombre}: ${tiempo}ms`

    );

}

export function obtenerMetricas(): Metrica[] {

    return [...metricas];

}