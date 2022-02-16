import React from "react";
import { useState, useEffect } from "react";

// 3rd party
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
//COMPONENTS
import Cell from "./Cell";

export default function Game(props){
    
    const [cells, setCells] = useState([])
    const [bombPlacesState, setBombPlacesState] = useState([]);

    useEffect(()=>{
        if(cells.some(cellRow=>{return cellRow.some(cell=>{return cell.value==="bomb"})})){
            if(cells.every(cellRow=>{
                return cellRow.every(cell=>{
                    return (cell.value==="bomb" || cell.display==="open")
                })
            })){
                // if every cell that is not a bomb is opened;
                //setCells(newGrid());
                props.setGameScreen("win");
            }
        }
        
    },[cells])

    function newGrid(){ // called only in placeBombs
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
        return rows;
    }

    function placeBombs(){ // prepares a new game grid
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
        const newCells = newGrid();
        bombPlaces.map(bomb=>{
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
            setBombPlacesState(bombPlaces)
        })
        props.setGameScreen("game")
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
                    props.setGameScreen("lose");
                    showBombs();
                    // background of last clicked cell may be red
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

    function showBombs(){
        const newCells = [...cells];
        bombPlacesState.forEach(bomb=>{
            newCells[bomb.row][bomb.col].display="open"
        })
        setCells(newCells)
    }
    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
          width: undefined,
          height: undefined,
        });
        useEffect(() => {
          function handleResize() {
            setWindowSize({
              width: window.innerWidth,
              height: window.innerHeight,
            });
          }
          window.addEventListener("resize", handleResize);
          handleResize();
          return () => window.removeEventListener("resize", handleResize);
        }, []);
        return windowSize;
      }

    
    const { width,height } = useWindowSize();
    const playBtnText = props.gameScreen==="initial"? "Play" : "Play Again";
    const showGrid = props.gameScreen==="game" || props.gameScreen==="lose";
    const gameWon = props.gameScreen==="win";
    const gameLost = props.gameScreen==="lose";

    const cellElements = cells.map(cellArr => {
        return( cellArr.map(cell =>{
            return(
                <Cell key={nanoid()}
                    value={cell.value}
                    display={cell.display}
                    img={cell.img}
                    openCell={gameLost?null : (event)=>openCell(cell.position)}
                    flagCell={(event)=>flagCell(event, cell.position, false)}
                />
            )
        }))
    })
    
    const styles= gameLost
    ?{
        loseState: 
        {
            display: "flex",
            flexDirection: "column",
        },
        loseStatePlayBtn:{
            order: "5",
            margin: 0
        }
    }:{}
    return(
        <main style={styles.loseState} className="game">
            { (props.gameScreen==="initial"
            ||gameLost) && <button style={styles.loseStatePlayBtn}className="play-btn" onClick={placeBombs}>{playBtnText}</button>}
            { gameWon && <h1 className="you-win">You win!</h1> }
            { props.gameTime.newTime===props.gameTime.best && <h1 className="new-record">NEW RECORD!</h1> }
            { gameWon && <h1 className="win-time">your time: {props.gameTime.newTime}s</h1>}
            { gameWon && <button className="win-btn" onClick={placeBombs}>Play Again</button>}
            { gameWon && <Confetti width={width} height={height}/>}
            { showGrid && <div className="game-grid">
                {cellElements}
            </div>}
        </main>
    )
}