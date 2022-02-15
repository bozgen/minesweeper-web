import React from "react";
// COMPONENTS
import Header from "./components/Header";
import Game from "./components/Game";


export default function App(){
    const [gameScreen, setGameScreen] = React.useState(false)
    
    return(
        <div>
            <Header />
            <Game
                gameScreen={gameScreen}
                setGameScreen={setGameScreen}
            />
        </div>
    )
}