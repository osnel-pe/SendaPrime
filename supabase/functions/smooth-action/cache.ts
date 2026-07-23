const cache=new Map();

export function guardarCache(

    id:string,

    datos:any

){

    cache.set(id,{

        datos,

        fecha:Date.now()

    });

}

export function leerCache(

    id:string

){

    const c=

    cache.get(id);

    if(!c){

        return null;

    }

    if(

        Date.now()-c.fecha>

        1000*60*5

    ){

        cache.delete(id);

        return null;

    }

    return c.datos;

}