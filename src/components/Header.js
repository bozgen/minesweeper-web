import React from "react";

export default function Header(){
    return(
        <header>
            <section className="header-times">
                <h3>time: <span>13.434s</span></h3>
                <h3>best: <span>11.134s</span></h3>
            </section>
            <h1>Minesweeper</h1>
        </header>
    )
}