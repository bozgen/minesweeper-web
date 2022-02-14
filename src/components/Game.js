import React from "react";
import { useState } from "react";
import { nanoid } from "nanoid";
//COMPONENTS
import Cell from "./Cell";

export default function Game(){
    
    const [cells, setCells] = useState([])

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
        if(cells.length) placeBombs()
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
            const newCells = [...cells]
            newCells[bomb.row][bomb.col] = {
                value:"bomb",
                display:"closed",
                img:"bomb",
                position:{row:bomb.row, col: bomb.col}
            }
            setCells(newCells)
        })
    } 
    // console.log(cells)
    
    function rng(upperBound){ //RANDOM NUMBER GENERATION of range 0-upperBound(exclusive)
        return Math.floor(Math.random()*upperBound)
    }

    function openCell(pos){
        if(cells[pos.row][pos.col].display ==="closed"){
            if(cells[pos.row][pos.col].img!=="flag"){
                const newCells = [...cells]
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
                newCells[pos.row][pos.col] = {
                    ...newCells[pos.row][pos.col],
                    img:""
                }
                setCells(newCells)
            }
            return false;
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
            <button onClick={newGrid}>Play</button>
            <div className="game-grid">
                {cellElements}
            </div>
        </main>
    )
}