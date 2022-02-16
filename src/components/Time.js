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
    const bestElement = document.querySelector(".bestTime");
    
    let interval = React.useRef(null);

    React.useEffect(()=>{ //game time and best time handling
        const timeElement = document.querySelector(".game-time")
        function handleGameTime(gameScreen){
            if(gameScreen==="win"){
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
                if (bestTime && newTime < bestTime){ 
                    setGameTime(prevGameTime=>{
                        return{
                            ...prevGameTime,
                            best: newTime
                        }
                    })
                    localStorage.setItem("bestTime", newTime);
                }
                else if(!bestTime){
                    setGameTime(prevGameTime=>{
                        return{
                            ...prevGameTime,
                            best: newTime
                        }
                    })
                    localStorage.setItem("bestTime", newTime)
                }
            }
            else if(gameScreen==="game"){
                //start timer
                
                interval = setInterval(()=>{
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
                        start: start
                    }
                })
            }
            else{
                //stop timer
                const date= new Date();
                const endTime = date.getTime();
            }
        }
        handleGameTime(props.gameScreen)
        return () => { return clearInterval(interval) }
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