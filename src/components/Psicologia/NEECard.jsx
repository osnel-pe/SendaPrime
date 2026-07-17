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

        <div className="nee-card">

            <div className="nee-header">

                <div className="nee-title">

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
            className="nee-item"
        >

            <div
                className="nee-info"
            >

                <div className="nee-nombre">

                    {item.diagnostico}

                </div>

                <div className="nee-descripcion">

                    {item.nivel}

                </div>

                <div className="nee-descripcion">

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

    <div className="nee-vacio">

        <p>

            No existe una necesidad educativa registrada.

        </p>

        
    </div>
}   

        </div>

    );

}