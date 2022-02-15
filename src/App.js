import React from "react";
// COMPONENTS
import Header from "./components/Header";
import Game from "./components/Game";


export default function App(){
    const [gameOn, setGameOn] = React.useState(false)
    
    return(
        <div>
            <Header />
            <Game
                gameOn={gameOn}
                setGameOn={setGameOn}
            />
        </div>
    )
}