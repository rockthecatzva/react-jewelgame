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
        this.state = {"jewelSet": []};
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
                                    "jewelType": basicJewelTypes[Math.floor(Math.random() * basicJewelTypes.length)]
                                }
                    tempSet.push(tempJewel);
                }
            }
            jewelSet.push(tempSet);
            tempSet = [];
        }

        this.setState({"jewelSet": jewelSet});
        console.log(jewelSet);
    }

    render() {
        const GameDiv = styled.div`
            background-color: grey;
            width: 800px;
            height: 600px;
            margin: 0 auto;
            
            @media (max-width: 1000px) { 
                width: 100%;
            }`;
        
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
        
        const jewelDivs = this.state.jewelSet.map((s,i)=>{
            return (<FloatDiv key={i}>{s.map((j,b)=>{
                return (<Jewel jewelType={j.jewelType} key={b} />)
            })}</FloatDiv>)
        })
        
        console.log(jewelDivs)
        

        return (<div>
            <h1>Simple Bejeweled Clone</h1>
            <button onClick={this.initGame}>Start/Restart</button>
            <Test1 />
            <Test1 primary />
            <GameDiv>
                {jewelDivs}
            </GameDiv>
        </div>);
    }
}


render(<App />, document.getElementById('app'));

registerServiceWorker();
