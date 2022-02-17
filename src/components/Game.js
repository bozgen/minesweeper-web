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
        const cellsHasBombs = 
        cells.some(cellRow=>{return cellRow.some(cell=>{
            return cell.value==="bomb" })});

        const everyNonBombCellOpened = 
        cells.every(cellRow=>{ return cellRow.every(cell=>{
            return (cell.value==="bomb" || cell.display===true) })});
        
        
            if(cellsHasBombs && everyNonBombCellOpened){
            props.setGameScreen("win");
        }
    },[cells])


    function newGrid(){ // called only in placeBombs()
        const rows= []
        for(let i=0;i<8;i++){
            const row =[]
            for(let j=0;j<8;j++){
                row.push({
                    value:0,
                    display:false,
                    img:"",
                    position:{row:i, col:j}
                })
            }
            rows.push(row)
        }
        return rows;
    }

    function placeBombs(){ // prepares a new game grid
        const bombPlaces = [];
        
        while(bombPlaces.length < 8){
            const randomPlace = {row:rng(8), col:rng(8)};
            const isPlaceUnique = !bombPlaces.some( place => {
                return place.row === randomPlace.row && place.col === randomPlace.col  });
            
            isPlaceUnique && bombPlaces.push(randomPlace);
        }

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
                display:false,
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
        const { row, col } = pos;
        const cell = cells[row][col];
        
        if( cell.display===false && cell.img!="flag" ){
            const newCells = [...cells]

            if(cell.value==="bomb"){
                props.setGameScreen("lose");
                showBombs();
                return;
            }
            
            if(cell.value===0){
                openEmptyCell(newCells,pos)
            }

            newCells[row][col] = {
                ...newCells[row][col],
                display:true
            }
            
            setCells(newCells)
        }
    }

    function flagCell(event, pos){
        event.preventDefault();

        const { row, col } = pos;
        const cell = cells[row][col];

        if(cell.display===false){
            const newCells = [...cells]

            if(cell.img!=="flag"){
                newCells[row][col] = {
                    ...newCells[row][col],
                    img:"flag"
                }
                setCells(newCells)
            }
            else{
                const cellImg = newCells[row][col].value==="bomb"? "bomb" : "";
            
                newCells[row][col] = {
                    ...newCells[row][col],
                    img: cellImg
                }
                setCells(newCells)
            }
            return false;
        }
    }
    function openEmptyCell(newCells,pos){
        const { row, col } = pos; 
        const cell = newCells[row][col];

        if(cell.display===true){ return }
        cell.display = true;
        cell.img="";
        
        if(cell.value!==0) {return}
        setCells(newCells)
        
        for(let i=-1;i<2;i++){ // to check the surrounding cells
            for(let j=-1;j<2;j++){
                const isRowValid = row+i>=0 && row+i<8;
                const isColValid = col+j>=0 && col+j<8;
                if( isRowValid && isColValid ){
                    openEmptyCell(newCells,{row: row+i, col: col+j})
                }
            }
        }
    }

    function showBombs(){
        const newCells = [...cells];
        bombPlacesState.forEach(bomb=>{
            const bombCell = newCells[bomb.row][bomb.col];
            bombCell.display=true
            bombCell.img="bomb"
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

    
      // conditional rendering variables
    const { width,height } = useWindowSize();
    const playBtnText = props.gameScreen==="initial"? "Play" : "Play Again";
    const shouldShowGrid = props.gameScreen==="game" || props.gameScreen==="lose";
    const gameWon = props.gameScreen==="win";
    const gameLost = props.gameScreen==="lose";
    
    // mapping cells array to elements
    const cellElements = cells.map(cellArr => {
        return( cellArr.map(cell =>{
            const handleFlagEvent = gameLost? (e)=>{e.preventDefault()}
                                            : (event)=>flagCell(event, cell.position, false);
            const handleOpenCellEvent = gameLost? null
                                                : (event)=>openCell(cell.position);
            return(
                <Cell key={nanoid()}
                    value={cell.value}
                    display={cell.display}
                    img={cell.img}
                    openCell={handleOpenCellEvent}
                    flagCell={handleFlagEvent}
                />
            )
        }))
    })
    
    // conditional styling
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
        <main
        style={styles.loseState}
        className="game">

            {
            (props.gameScreen==="initial" || gameLost ) &&
            <button
            style={styles.loseStatePlayBtn}
            className="play-btn"
            onClick={placeBombs}>
                {playBtnText}
            </button>
            }
            
            {
            gameWon &&
            <h1 className="you-win">
                You win!
            </h1>
            }
            
            {
            props.gameTime.newTime === props.gameTime.best &&
            <h1 className="new-record">NEW RECORD!</h1>
            }
            
            {
            gameWon &&
            <h1 className="win-time">
                your time: {props.gameTime.newTime}s
            </h1>
            }
            
            {
            gameWon &&
            <button
            className="win-btn"
            onClick={placeBombs}>
                Play Again
            </button>
            }
            
            {
            gameWon &&
            <Confetti width={width} height={height}/>
            }

            {
            shouldShowGrid &&
            <div className="game-grid">
                {cellElements}
            </div>}
        </main>
    )
}