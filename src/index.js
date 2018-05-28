import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import { render } from 'react-dom';
import styled, { } from 'styled-components';
//import GameSurface from './components/GameSurface';
import Jewel from './components/Jewel'
import './style.css';

import Test from './components/Test'


class App extends React.Component {
    state = { "selectedJewel": [], "animatingJewels": [], "jewelData": [] };

    _isAdjacent = (pos1, pos2) => (Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])) === 1;
    _basicJewelTypes = [0,1,2,3]//[0, 1, 2, 3, 4, 5, 6];
    _numCols = 5;
    _numRows = 5;

    componentDidMount() {
        //console.log("mounted")
        const gameDivWidth = 400,
            gameDivHeight = 300,
            jewelWidth = (1 / 5) * gameDivWidth,
            jewelHeight = (1 / 5) * gameDivHeight;

        this.setState({ gameDivWidth, gameDivHeight, jewelWidth, jewelHeight });
    }

    initGame = () => {
        console.log("starting the game");
        const { _numCols, _numRows, _basicJewelTypes } = this;

        let tempSet = [],
            tempJewel;


        for (var a = 0; a < _numCols; a++) {
            for (var b = 0; b < _numRows; b++) {
                tempJewel = {
                    "jewelType": _basicJewelTypes[Math.floor(Math.random() * _basicJewelTypes.length)],
                    "row": b,
                    "column": a,
                    "onJewelClick": this.onJewelClick,
                    "width": this.state.jewelWidth,
                    "height": this.state.jewelHeight,
                    "animate": "static",
                    "isSelected": false,
                    highLighted: false
                }


                tempSet.push(tempJewel);
            }
        }

        this.setState({ "jewelData": tempSet, "selectedJewel": [] }, ()=>{console.log(this.checkForSequences())})

    }


    checkForSequences = () => {
        console.log("checking for sequences")
        let seqCt = 0;
        /*
                const t = this._basicJewelTypes.map(j => {
                    return new Array(this._numRows).fill(null).map((r,i)=>{
                        return new Array(this._numCols).fill(null).map((c,e)=>{
                            console.log(i,e);
                            return;
                        })
                        return r;
                    })
                });
        */

        const jewelTypeMatrix = new Array(this._numRows).fill(null).map((r, i) => {
            return new Array(this._numCols).fill(null).map((c, e) => {
                return this.state.jewelData.find(j => {
                    return j.row === i && j.column === e
                }).jewelType;
            })
        });
        console.log(jewelTypeMatrix);

        const matrixByTypeRow = this._basicJewelTypes.map(jtype => {
            return jewelTypeMatrix.map(r => {
                return r.map(c => {
                    return c === jtype ? 1 : 0;
                }).reduce((acc, curr) => {
                    return acc + curr.toString()
                })

            })
        });


        const matrixByTypeCol = this._basicJewelTypes.map(jtype => {
            return new Array(this._numCols).fill(null).map((c, ci) => {
                return new Array(this._numRows).fill(null).map((r, ri) => {
                    //console.log(ci, ri)
                    return this.state.jewelData.find(j => j.row === ri && j.column === ci).jewelType === jtype ? 1 : 0;
                }).reduce((acc, curr) => {
                    return acc + curr.toString()
                })

            })
        });


        const checkThis = (jewelStringCts) => {
            let found = []
            jewelStringCts.forEach((r, ri) => {
                //console.log(r)
                //console.log(r.split("0"));
                const segs = r.split("0").map(str => str.length)
                //
                if (segs.filter(rstr => rstr >= 3).length > 0) {
                    //found min count
                    console.log(segs);
                    segs.forEach((s, ci) => {
                        if (s >= 3) {
                            //console.log(ri, ci, s);
                            found.push({ row: ri, column: ci, count: s });
                        }

                    })

                }


            })
            return found;
        }


        let seqPoints = [];
        return matrixByTypeRow.map(jtype => {
            const t = checkThis(jtype);
            //console.log(t)
            return t.map(sq=>{
                return (this.state.jewelData.filter(j => { 
                    return (j.column < (sq.column + sq.count) && j.column >= (sq.column)) &&
                        (j.row===sq.row)
                }))
            })
        }).filter(r=>r.length);
        
    }



    onJewelClick = (row, col) => {
        let tempJewelData = this.state.jewelData.map(j => {
            return { ...j, isSelected: (j.row === row && j.column === col) ? true : false, animate: "static" }
        });
        let selectedJewel = [row, col]

        if (this.state.selectedJewel.length) {
            if (this.state.selectedJewel[0] !== row || this.state.selectedJewel[1] !== col) {


                //a new box has been selected

                //check if its adjacent

                const isAdjacent = this._isAdjacent(this.state.selectedJewel, [row, col])//Math.abs(this.state.selectedJewel[0] - row) + Math.abs(this.state.selectedJewel[1] - col);

                if (isAdjacent) {
                    const rowDiff = this.state.selectedJewel[0] - row,
                        colDiff = this.state.selectedJewel[1] - col;

                    selectedJewel = []//[selectedJewel[0]+rowDiff, selectedJewel[1]+colDiff]
                    let primaryDirection, secondaryDirection;

                    let animationDirects = (Math.abs(rowDiff) ? (rowDiff > 0 ? ["south", "north"] : ["north", "south"]) : (colDiff < 0 ? ["east", "west"] : ["west", "east"]));

                    const lastJewel = {
                        ...tempJewelData.find((j => (j.row === this.state.selectedJewel[0] && j.column === this.state.selectedJewel[1]))),
                        animate: animationDirects[1],
                        isSelected: false
                    }
                    const currJewel = {
                        ...tempJewelData.find(j => (j.row === row && j.column === col)),
                        animate: animationDirects[0],
                        isSelected: false
                    };


                    tempJewelData = [...tempJewelData.filter(j => (j.row !== row || j.column !== col) && (j.row !== lastJewel.row || j.column !== lastJewel.column)),
                    { ...currJewel, row: lastJewel.row, column: lastJewel.column },
                    { ...lastJewel, row: row, column: col }];



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

        const jewels = this.state.jewelData.map((j, i) => <Jewel key={"jewel" + i}  {...j} />)
        return (<div>
            <h1>Simple Bejeweled Clone</h1>
            <button onClick={this.initGame}>Start/Restart</button>



            <div className="game-surface">

                {this.state.jewelData.length > 0 &&

                    <div>
                        {jewels}

                    </div>}
            </div>
        </div >);
    }
}


render(<App />, document.getElementById('app'));

registerServiceWorker();