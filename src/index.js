import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import { render } from 'react-dom';
import styled, { } from 'styled-components';
//import GameSurface from './components/GameSurface';
import Jewel from './components/Jewel'
import './style.css';

import Test from './components/Test'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.initGame = this.initGame.bind(this);
        this.onJewelClick = this.onJewelClick.bind(this);
        this.state = { "selectedJewel": [], "animatingJewels": [], "jewelData": [] };
        //console.log("app construct")
    }

    componentDidMount() {
        //console.log("mounted")
        const gameDivWidth = 400,
            gameDivHeight = 300,
            jewelWidth = (1 / 5) * gameDivWidth,
            jewelHeight = (1 / 5) * gameDivHeight;

        this.setState({ gameDivWidth, gameDivHeight, jewelWidth, jewelHeight });
    }

    initGame() {
        console.log("starting the game");
        const numCols = 3,
            numRows = 3,
            basicJewelTypes = ["orange", "blue", "pink", "green", "yellow", "white", "red"];
        let tempSet = [],
            tempJewel;


        for (var a = 0; a < numCols; a++) {
            for (var b = 0; b < numRows; b++) {
                tempJewel = {
                    "jewelType": basicJewelTypes[Math.floor(Math.random() * basicJewelTypes.length)],
                    "row": b,
                    "column": a,
                    "onJewelClick": this.onJewelClick,
                    "width": this.state.jewelWidth,
                    "height": this.state.jewelHeight,
                    "animate": "static",
                    "isSelected": false
                }


                tempSet.push(tempJewel);
            }
        }

        this.setState({ "jewelData": tempSet, "selectedJewel": [] })
       
    }





    onJewelClick(row, col) {
        console.log("jewel click ", row, col);
        let tempJewelData = this.state.jewelData.map(j => {
            return { ...j, isSelected: (j.row === row && j.column === col) ? true : false, animate: "static" }
        });
        let selectedJewel= [row, col]

        /*for (var i = 0; i < tempJewelData.length; i++) {
            if (tempJewelData[i].row == row && tempJewelData[i].column == col) {
                tempJewelData[i].isSelected = true;
                console.log("found")
            }
            else {
                tempJewelData[i].isSelected = false;
            }
        }*/


        if (this.state.selectedJewel.length) {
            if (this.state.selectedJewel[0] !== row || this.state.selectedJewel[1] !== col) {
                

                //a new box has been selected

                //check if its adjacent

                const isAdjacent = Math.abs(this.state.selectedJewel[0] - row) + Math.abs(this.state.selectedJewel[1] - col);
                console.log("adjacent??", isAdjacent, row, col, this.state.selectedJewel[0], this.state.selectedJewel[1])

                if (isAdjacent === 1) {
                    console.log("YES")
                    const rowDiff = this.state.selectedJewel[0] - row,
                        colDiff = this.state.selectedJewel[1] - col;

                    selectedJewel = []//[selectedJewel[0]+rowDiff, selectedJewel[1]+colDiff]
                    let primaryDirection, secondaryDirection;

                    let t = (Math.abs(rowDiff) ? (rowDiff > 0 ? ["south", "north"] : ["north", "south"]) : (colDiff < 0 ? ["east", "west"] : ["west", "east"]));
                    console.log("t>>> ", t)



                    const lastJewel = {
                        ...tempJewelData.find((j => (j.row === this.state.selectedJewel[0] && j.column === this.state.selectedJewel[1]))),
                        animate: t[1],
                        isSelected: false
                    }
                    const currJewel = {
                        ...tempJewelData.find(j => (j.row === row && j.column === col)),
                        animate: t[0],
                        isSelected: false
                    };

                    console.log(lastJewel, currJewel)
                    console.log("~~~~~1 ", tempJewelData)
                    //console.log([...this.state.jewelData.filter(j => (j.row !== row || j.column !== col))])
                    tempJewelData = [...tempJewelData.filter(j => (j.row !== row || j.column !== col) && (j.row !== lastJewel.row || j.column !== lastJewel.column)),
                    { ...currJewel, row: lastJewel.row, column: lastJewel.column },
                    { ...lastJewel, row: row, column: col }];
                    //tempJewelData = [...tempJewelData.filter(j => (j.row !== lastJewel.row || j.column !== lastJewel.column)), ];

                    console.log("~~~~~2 ", tempJewelData)



                    /*this.setState({"selectedJewel": [], 
                                   "animatingJewels": [{"jewelRow":row, "jewelCol": col, "animation": secondaryDirection},
                                                       {"jewelRow":this.state.selectedJewel[0], "jewelCol": this.state.selectedJewel[1], "animation": primaryDirection}]})
                                                       */


                }
                else {
                    //not adjacent - 

                }


            }
        }
        else {
            //no prior-selected box

        }





        this.setState({ "jewelData": tempJewelData, selectedJewel })


    }



    render() {
        //styled components block the triggering of children component lifecycles
        console.log("MAIN ", this.state.selectedJewel)
        return (<div>
            <h1>Simple Bejeweled Clone</h1>
            <button onClick={this.initGame}>Start/Restart</button>



            <div className="game-surface">

                {this.state.jewelData.length > 0 &&

                    <div>
                        <Jewel {...this.state.jewelData[0]} />
                        <Jewel {...this.state.jewelData[1]} />
                        <Jewel {...this.state.jewelData[2]} />
                        <Jewel {...this.state.jewelData[3]} />
                        <Jewel {...this.state.jewelData[4]} />
                        <Jewel {...this.state.jewelData[5]} />
                        <Jewel {...this.state.jewelData[6]} />
                        <Jewel {...this.state.jewelData[7]} />
                        <Jewel {...this.state.jewelData[8]} />

                    </div>}
            </div>
        </div>);
    }
}


render(<App />, document.getElementById('app'));

registerServiceWorker();