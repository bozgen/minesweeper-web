import React from "react";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
//COMPONENTS
import Cell from "./Cell";

export default function Game(props){
    
    const [cells, setCells] = useState([])

    useEffect(()=>{
        setCells(newGrid());
    },[])

    useEffect(()=>{
        if(cells.some(cellRow=>{return cellRow.some(cell=>{return cell.value==="bomb"})})){
            if(cells.every(cellRow=>{
                return cellRow.every(cell=>{
                    return (cell.value==="bomb" || cell.display==="open")
                })
            })){
                // if every cell that is not a bomb is opened;
                setCells(newGrid());
                props.setGameScreen("win");
            }
        }
        
    },[cells])

    function newGrid(){
        const rows= []
        for(let i=0;i<8;i++){
            const row =[]
            for(let j=0;j<8;j++){
                row.push({
                    value:0,
                    display:"closed",
                    img:"",
                    position:{row:i, col:j}
                })
            }
            rows.push(row)
        }
        setCells(rows)
        return rows;
    }

    function placeBombs(){
        const bombPlaces = []
        while(bombPlaces.length < 8){
            const randomPlace = {row:rng(8), col:rng(8)};
            if(!bombPlaces.some( place => { // bomb places must be unique
                return place.row === randomPlace.row && place.col === randomPlace.col  
            })){
                bombPlaces.push(randomPlace);
            }
        }
        // console.log(bombPlaces)
        
        bombPlaces.map(bomb=>{
            const newCells = [...cells];
            for(let i=-1;i<2;i++){ // to increment the values around the bombs
                for(let j=-1;j<2;j++){
                    const isRowValid = bomb.row+i>=0 && bomb.row+i<8;
                    const isColValid = bomb.col+j>=0 && bomb.col+j<8;
                    if( isRowValid && isColValid ){
                        const cell = newCells[bomb.row+i][bomb.col+j];
                        if(cell.value!=="bomb"){
                            cell.value++;
                        }
                    }
                }
            }
            // set the bomb
            newCells[bomb.row][bomb.col] = {
            value:"bomb",
            display:"closed",
            img:"bomb",
            position:{row:bomb.row, col: bomb.col}
            }
            setCells(newCells)
        })
        props.setGameScreen(true)
    } 
    // console.log(cells)
    
    function rng(upperBound){ //RANDOM NUMBER GENERATION of range 0-upperBound(exclusive)
        return Math.floor(Math.random()*upperBound)
    }

    function openCell(pos){
        if(cells[pos.row][pos.col].display ==="closed"){
            if(cells[pos.row][pos.col].img!=="flag"){
                const newCells = [...cells]
                if(cells[pos.row][pos.col].value==="bomb"){
                    setCells(newGrid());
                    props.setGameScreen(false);
                    return;
                }
                if(cells[pos.row][pos.col].value===0){
                    openEmptyCell(newCells,pos)
                }
                newCells[pos.row][pos.col] = {
                    ...newCells[pos.row][pos.col],
                    display:"open"
                }
                
                setCells(newCells)
            }
        }
    }
    function flagCell(event, pos){
        event.preventDefault();
        if(cells[pos.row][pos.col].display ==="closed"){
            if(cells[pos.row][pos.col].img!=="flag"){
                const newCells = [...cells]
                newCells[pos.row][pos.col] = {
                    ...newCells[pos.row][pos.col],
                    img:"flag"
                }
                setCells(newCells)
            }else{
                const newCells = [...cells]
                newCells[pos.row][pos.col].value==="bomb"
                ? newCells[pos.row][pos.col] = {
                    ...newCells[pos.row][pos.col],
                    img:"bomb"
                }
                : newCells[pos.row][pos.col] = {
                    ...newCells[pos.row][pos.col],
                    img:""
                }
                setCells(newCells)
            }
            return false;
        }
    }
    function openEmptyCell(newCells,pos){
        if(newCells[pos.row][pos.col].display==="open"){ return }
        newCells[pos.row][pos.col].display = "open";

        if(newCells[pos.row][pos.col].value!==0) {return}
        if(newCells[pos.row][pos.col].img==="flag") newCells[pos.row][pos.col].img="";
        setCells(newCells)
        
        for(let i=-1;i<2;i++){ // to check the surrounding cells
            for(let j=-1;j<2;j++){
                const isRowValid = pos.row+i>=0 && pos.row+i<8;
                const isColValid = pos.col+j>=0 && pos.col+j<8;
                if( isRowValid && isColValid ){
                    openEmptyCell(newCells,{row: pos.row+i, col: pos.col+j})
                }
            }
        }
    }

    const cellElements = cells.map(cellArr => {
        return( cellArr.map(cell =>{
            return(
                <Cell key={nanoid()}
                    value={cell.value}
                    display={cell.display}
                    img={cell.img}
                    openCell={(event)=>openCell(cell.position)}
                    flagCell={(event)=>flagCell(event, cell.position, false)}
                />
            )
        }))
    })

    return(
        <main className="game">
            { !props.gameScreen && <button className="play-btn" onClick={placeBombs}>Play</button>}
            { props.gameScreen==="win" && <button className="play-btn" onClick={placeBombs}>Play Again</button>}
            { props.gameScreen===true && <div className="game-grid">
                {cellElements}
            </div>}
        </main>
    )
}