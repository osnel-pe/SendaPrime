class MemoryManager{

    historial=[];

    agregar(usuario,ia){

        this.historial.push({

            usuario,

            ia,

            fecha:new Date()

        });

        if(this.historial.length>15){

            this.historial.shift();

        }

    }

    obtener(){

        return this.historial;

    }

    limpiar(){

        this.historial=[];

    }

}

export default new MemoryManager();