export function calcularScore(contexto:any){

    let score=0;

    const notas=contexto.notas ?? [];

    const citas=contexto.citas ?? [];

    const texto=JSON.stringify(notas).toLowerCase();

    const factores=[

        ["bullying",20],
        ["violencia",20],
        ["ansiedad",12],
        ["depres",18],
        ["autoles",35],
        ["suic",40],
        ["abandono",18],
        ["aislamiento",10],
        ["agresión",15],
        ["consumo",18],
        ["fracaso escolar",10]

    ];

    factores.forEach(([palabra,valor])=>{

        if(texto.includes(String(palabra))){

            score+=Number(valor);

        }

    });

    if(notas.length>8){

        score+=10;

    }

    if(citas.length>10){

        score+=8;

    }

    return Math.min(score,100);

}