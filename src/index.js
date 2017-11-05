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
        this.state = {"jewelSet": [], "selectedJewel": []};
    }

    initGame() {
        console.log("starting the game");
        const numCols = 8,
            numRows = 8,
            basicJewelTypes = ["orange", "blue", "pink", "green", "yellow", "white", "red"];
        let jewelSet = [],
            tempSet = [],
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
                    //tempSet.push(tempJewel);
                    jewelSet.push(tempJewel);
                }
            }
            //jewelSet.push(tempSet);
            //tempSet = [];
        }

        this.setState({"jewelSet": jewelSet});
        console.log(jewelSet);
    }

    onJewelClick(row, col){
        if(this.state.selectedJewel.length){
            if(this.state.selectedJewel[0]!=row || this.state.selectedJewel[1]!=col){
                //a new box has been selected
                this.setState({"selectedJewel": [row, col]})
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
              jewelWidth = (1 / 8)*100,
              jewelHeight = (1/8)*100;

        const GameDiv = styled.div`
            background-color: grey;
            width: ${gameDivWidth+"px"};
            height: ${gameDivHeight+"px"};
            margin: 0 auto;
            position: relative;
            @media (max-width: 1000px) { 
                width: 100%;
            }`;
        
        /*
        const FloatDiv = styled.div`
            postion: relative;
            float: left;
            width: 12%;
            height: 100%;`;
        
        const Test1 = styled.div`
            background-color: ${props=>props.primary?'red':'blue'};
            height: 20px;
            width: 20px;
            `;    
        */

        /*
        const jewelDivs = this.state.jewelSet.map((s,i)=>{
            return (<FloatDiv key={i}>{s.map((j,b)=>{
                return (<Jewel onJewelClick={this.onJewelClick} jewelType={j.jewelType} key={b} />)
            })}</FloatDiv>)
        })
        */

        const jewelDivs = this.state.jewelSet.map((j,i)=>{
            let isSelected = false; 
            if (this.state.selectedJewel.length){
               isSelected=((j.row===this.state.selectedJewel[0])&&(j.column===this.state.selectedJewel[1]))? true: false;
            }

            return (<Jewel onJewelClick={this.onJewelClick} jewelType={j.jewelType} key={i} row={j.row} column={j.column} width={jewelWidth} height={12} isSelected={isSelected} />)})

        //console.log(jewelDivs)
        

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
