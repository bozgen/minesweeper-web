import React from "react";
import bomb from "../img/bomb.png";
import flag from "../img/flag.png";

export default function Cell(props){
    let value;
    props.value==="bomb"
    ? value="bomb"
    : value = props.value;

    const img = props.img==="bomb"? bomb : flag;

    return(
        <div onClick={props.openCell} onContextMenu={props.flagCell} className="cell">
            {props.display==="open" && props.img==="bomb" && <img className="cell-img" src={img}/>}
            {props.display==="closed" && props.img==="flag" && <img className="cell-img" src={img}/>}
            {props.img==="" && props.display==="open"? <h1 className="cell-value">{value}</h1>: ""}
        </div>
    )
}