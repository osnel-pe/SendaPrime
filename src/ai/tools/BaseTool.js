class BaseTool {

    constructor(nombre){

        this.nombre = nombre;

    }

    async ejecutar(){

        throw new Error("Debe implementarse ejecutar().");

    }

}

export default BaseTool;