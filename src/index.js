import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import { render } from 'react-dom';
import styled, {} from 'styled-components';
//import GameSurface from './components/GameSurface';
import Jewel from './components/Jewel'
//import './style.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.initGame = this.initGame.bind(this);
        this.onJewelClick = this.onJewelClick.bind(this);
        this.state = {"jewelSet": [], "selectedJewel": [], "animatingJewels":[]};
    }

    initGame() {
        console.log("starting the game");
        const numCols = 8,
            numRows = 8,
            basicJewelTypes = ["orange", "blue", "pink", "green", "yellow", "white", "red"];
        let jewelSet = [],
            tempJewel;

        for (var a = 0; a < numCols; a++) {
            for (var b = 0; b < numRows; b++) {
                if (1) {
                    //first col - just worry about vertical sequences
                    tempJewel = {
                                    "jewelType": basicJewelTypes[Math.floor(Math.random() * basicJewelTypes.length)],
                                    "row": b,
                                    "column": a
                                }
                    jewelSet.push(tempJewel);
                }
            }
        }

        this.setState({"jewelSet": jewelSet});
        console.log(jewelSet);
    }

    onJewelClick(row, col){
        if(this.state.selectedJewel.length){
            if(this.state.selectedJewel[0]!==row || this.state.selectedJewel[1]!==col){
                //a new box has been selected

                //check if its adjacent
                const isAdjacent = Math.abs(this.state.selectedJewel[0]-row)+Math.abs(this.state.selectedJewel[1]-col);
                if(isAdjacent===1){
                    const rowDiff = this.state.selectedJewel[0]-row,
                          colDiff = this.state.selectedJewel[1]-col;
                    
                          let primaryDirection, secondaryDirection;
                          //console.log(rowDiff==true, rowDiff)
                          if(Math.abs(rowDiff)){
                            primaryDirection = rowDiff ? "north" : "south";
                            secondaryDirection = rowDiff ? "south" : "north";
                          }
                          else{
                              primaryDirection = colDiff ? "east" : "west";
                              secondaryDirection = colDiff ? "west" : "east";
                          }

                          console.log(primaryDirection, secondaryDirection);
                          

                    //initatie an animation!!
                    console.log("ANIMATING!!", rowDiff, colDiff);
                    this.setState({"selectedJewel": [], 
                                   "animatingJewels": [{"jewelRow":row, "jewelCol": col, "animation": secondaryDirection},
                                                       {"jewelRow":this.state.selectedJewel[0], "jewelCol": this.state.selectedJewel[1], "animation": primaryDirection}]})
                }
                else{
                    //not adjacent
                    this.setState({"selectedJewel": [row, col], "animatingJewels":[]})
                }

                
            }
        }
        else{
            //no prior-selected box
            this.setState({"selectedJewel": [row, col]})
        }
        
    }

    

    render() {
        const gameDivWidth = 800,
              gameDivHeight = 600,
              jewelWidth = (1/8)*gameDivWidth,
              jewelHeight = (1/8)*gameDivHeight;

        const GameDiv = styled.div`
            background-color: grey;
            width: ${gameDivWidth+"px"};
            height: ${gameDivHeight+"px"};
            margin: 0 auto;
            overflow: hidden;
            position: relative;
            @media (max-width: 1000px) { 
                width: 100%;
            }`;

        const jewelDivs = this.state.jewelSet.map((j,i)=>{
            let isSelected = false; 
            if (this.state.selectedJewel.length){
               isSelected=((j.row===this.state.selectedJewel[0])&&(j.column===this.state.selectedJewel[1]))? true: false;
            }

            let animate = "static"
            if(this.state.animatingJewels.length){
                //is this an issue - can the same animation be triggered multiple times?
                //do i need an "isAnimating prop for the game board to prevent??"
                this.state.animatingJewels.forEach((ajs)=>{
                    if(ajs["jewelRow"]===j.row && ajs["jewelCol"]===j.column){
                        animate = ajs["animation"];
                        console.log("found animating jewel");
                    }
                });
            }

            return (<Jewel key={i} 
                           onJewelClick={this.onJewelClick} 
                           jewelType={j.jewelType} 
                           row={j.row} 
                           column={j.column} 
                           width={jewelWidth} 
                           height={jewelHeight} 
                           animate={animate}
                           isSelected={isSelected} />)})


        

        return (<div>
            <h1>Simple Bejeweled Clone</h1>
            <button onClick={this.initGame}>Start/Restart</button>
            
            <GameDiv>
                {jewelDivs}
            </GameDiv>
        </div>);
    }
}


render(<App />, document.getElementById('app'));

registerServiceWorker();