import React from "react";

export default function Header(props){
    const styles= props.gameScreen===false && props.gameTime.best===null
    ?{
        header: {
            margin: "5rem auto 2rem"
        }
    }
    :""
    
    return(
        <header>
            <section className="header-times">
                { props.gameScreen===true && <h3>time: <span className="game-time">{props.gameTime.newTime}</span></h3>}
                { props.gameTime.best && <h3>best: <span className="bestTime">{props.gameTime.best}</span></h3>}
            </section>
            <h1 style={styles.header}>Minesweeper</h1>
        </header>
    )
}