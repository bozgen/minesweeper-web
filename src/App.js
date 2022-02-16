import React from "react";
// COMPONENTS
import Time from "./components/Time";


export default function App(){
    const [gameScreen, setGameScreen] = React.useState("initial")
    
    return(
        <Time
            gameScreen={gameScreen}
            setGameScreen={setGameScreen}
        />
    )
}