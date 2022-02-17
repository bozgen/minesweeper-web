import React from "react";
import bomb from "../img/bomb.png";
import flag from "../img/flag.png";

export default function Cell(props){
    
    let valueColor;
    switch(props.value){
        case 1:
            valueColor = "#4B73DA";
            break;
        case 2:
            valueColor = "#4CA85B";
            break;
        case 3:
            valueColor = "#FFF48C";
            break;
        case 4:
            valueColor = "#F28621";
            break;
        case 5:
            valueColor = "#DF4F3C";
            break;
        case 6:
            valueColor = "#CE362C";
            break;
        case 7:
            valueColor = "#AE0000";
            break;
        case 8:
            valueColor = "#7B0000";
            break;
        default:
            valueColor = "#000000";
            break;
    }
    const styles = {
        cell: props.display==="open"
        ?{
            background: "#CFCCCD",
            color: valueColor
        }
        :{}
    }

    let value;
    props.value===0
    ?value=""
    :value = props.value;

    const img = props.img==="bomb"? bomb : flag;
    
    const bombShouldShow =  props.display==="open" && props.img==="bomb";
    const flagShouldShow =  props.display==="closed" && props.img==="flag";
    const valueShouldShow = props.img==="" && props.display==="open";
    return(
        <div
        style={styles.cell}
        onClick={props.openCell}
        onContextMenu={props.flagCell}
        className="cell">
                {bombShouldShow && <img className="cell-img" src={img}/>}
                {flagShouldShow && <img className="cell-img" src={img}/>}
                {valueShouldShow && <h1 style={styles.cell}className="cell-value">{value}</h1>}
        </div>
    )
}