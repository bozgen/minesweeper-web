import React from "react";
//COMPONENTS
import Header from "./Header"
import Game from "./Game"

export default function Time(props){
    
    const [gameTime, setGameTime] = React.useState(
        {
            start:0,
            newTime:0,
            best: JSON.parse(localStorage.getItem("bestTime"))
        })

    
    let interval = React.useRef(null);
    React.useEffect(()=>{ //game time and best time handling
        
        handleGameTime(props.gameScreen)
        return () => { return clearInterval(interval.current) } // cleanup function
        
        function handleGameTime(gameScreen){
            
            if(gameScreen==="game"){
                //start timer
                interval.current = setInterval(()=>{
                    const date = new Date();
                    const now = date.getTime();
                    setGameTime(prevGameTime=>{
                        return{
                            ...prevGameTime,
                            newTime: Math.floor(Math.round((now - prevGameTime.start)) / 1000)
                        }
                    })
                },1000)
                
                const date= new Date();
                const start= date.getTime();
                setGameTime(prevGameTime=>{
                    return{
                        ...prevGameTime,
                        start: start,
                        newTime: 0  // game timer always starts from 0
                        // so that it does not remember the last time
                    }
                })
            }
            else if(gameScreen==="win"){
                const date= new Date();
                const end = date.getTime();
                const newTime = Math.round((end - gameTime.start)) / 1000;
                setGameTime(prevGameTime=>{
                    return{
                        ...prevGameTime,
                        newTime: newTime
                    }
                })
                
                const bestTime = JSON.parse(localStorage.getItem("bestTime"));
                
                if ((bestTime && newTime < bestTime) || !bestTime ){ 
                    setGameTime(prevGameTime=>{
                        return{
                            ...prevGameTime,
                            best: newTime
                        }
                    })
                    localStorage.setItem("bestTime", newTime);
                }
            }
        }
        
    },[props.gameScreen])    

    return(
        <div>
            <Header
                gameTime={gameTime}
                gameScreen={props.gameScreen}
            />
            <Game
                gameScreen={props.gameScreen}
                setGameScreen={props.setGameScreen}
                gameTime={gameTime}
            />
        </div>
    )
}