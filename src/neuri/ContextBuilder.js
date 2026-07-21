import MemoryManager from "./MemoryManager";

class ContextBuilder{

    construir(){

        return MemoryManager

        .obtener()

        .map(

            c=>

`Psicóloga:

${c.usuario}

Neuri:

${c.ia}

`

        )

        .join("\n");

    }

}

export default new ContextBuilder();