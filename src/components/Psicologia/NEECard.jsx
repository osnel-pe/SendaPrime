import "./../../Styles/NEECard.css";

import {

    Puzzle,

    Plus,

    Pencil,

    Trash2

} from "lucide-react";

export default function NEECard({

    nee,

    onAgregar,

    onEditar,

    onEliminar

}){

    const listaNEE = Array.isArray(nee) ? nee : [];

    return(

        <div className="nee-perfil-card">

            <div className="nee-perfil-header">

                <div className="nee-perfil-title">

                    <Puzzle size={22}/>

                    <h3>NEE</h3>

                </div>

                <button
                    className="nee-add-mini"
                    onClick={onAgregar}
                >

                    +

                </button>

            </div>

         {
    listaNEE.length > 0 ?

    listaNEE.map((item,index)=>(

        <div
            key={index}
            className="nee-perfil-item"
        >

            <div
                className="nee-perfil-info"
            >

                <div className="nee-perfil-nombre">

                    {item.diagnostico}

                </div>

                <div className="nee-perfil-descripcion">

                    {item.nivel}

                </div>

                <div className="nee-perfil-descripcion">

                    {item.observaciones}

                </div>

            </div>

            <div className="nee-acciones">

                <button
                    className="icon-btn replace"
                    onClick={()=>onEditar(index)}
                >

                    <Pencil size={17}/>

                </button>

                <button
                    className="icon-btn delete"
                    onClick={()=>onEliminar(index)}
                >

                    <Trash2 size={17}/>

                </button>

            </div>

        </div>

    ))

    :

    <div className="nee-perfil-vacio">

        <p>

            No existe una necesidad educativa registrada.

        </p>

        
    </div>
}   

        </div>

    );

}