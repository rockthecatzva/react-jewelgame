import registerServiceWorker from './registerServiceWorker';
import React from 'react';
import { render } from 'react-dom';
import styled, { } from 'styled-components';
//import GameSurface from './components/GameSurface';
import Jewel from './components/Jewel'
import './style.css';

//import Test from './components/Test'


class App extends React.Component {
    state = { "selectedJewel": [], "animatingJewels": [], "jewelData": [] };

    _isAdjacent = (pos1, pos2) => (Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1])) === 1;
    _basicJewelTypes = [0, 1, 2, 3]//[0, 1, 2, 3, 4, 5, 6];
    _numCols = 8;
    _numRows = 8;

    _jewelWidth = 50;//(1 / _numCols) * _gameDivWidth,
    _jewelHeight = 50;//(1 / _numRows) * _gameDivHeight;
    _gameDivWidth = this._jewelWidth * this._numCols;
    _gameDivHeight = this._jewelHeight * this._numRows;


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
                    "width": this._jewelWidth,
                    "height": this._jewelHeight,
                    "animate": { direction: "static", magnitude: 0 },
                    "isSelected": false,
                    highLighted: false
                }


                tempSet.push(tempJewel);
            }
        }

        this.setState({ "jewelData": tempSet, "selectedJewel": [] }, () => {  setInterval( this.checkForSequences(), 1000) })

    }


    checkForSequences = () => {
        let jewelData = this.state.jewelData
        //console.log("checking for sequences")
        //console.log(jdata, this.state.jewelData)
        let seqCt = 0;

        const jewelTypeMatrix = new Array(this._numRows).fill(null).map((r, i) => {
            return new Array(this._numCols).fill(null).map((c, e) => {
                return jewelData.filter(j => {
                    return j.row === i && j.column === e
                }).reduce((acc,curr)=>curr.jewelType, null);
            })
        });

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
                    return jewelData.filter(j => j.row === ri && j.column === ci).reduce((acc,curr)=>curr.jewelType,null) === jtype ? 1 : 0;
                }).reduce((acc, curr) => {
                    return acc + curr.toString()
                })

            })
        });


        const checkThis = (jewelStringCts, direction, rowname = "row", colname = "column") => {
            //a function that gets a binary-string representing a row or col of a 
            //jewel-type - indicating where its members are located
            //returns info on which binary-strings contain patterns
            let found = []
            jewelStringCts.forEach((r, ri) => {
                const segs = r.split("0").map(str => str.length)
                if (segs.filter(rstr => rstr >= 3).length > 0) {
                    segs.forEach((s, ci) => {
                        if (s >= 3) {
                            found.push({ [rowname]: ri, [colname]: r.indexOf("111"), count: s, direction });
                        }
                    })
                }
            });

            //found is raw r,c,span ob
            //console.log(found)
            return found;


            /*
            //flattens it out to an array of points by jewel-type
            let seqPoints = [];
            found.forEach(sq => {
                let x = jewelData.filter(j => {
                    return (j[colname] < (sq[colname] + sq.count) && j[colname] >= (sq[colname])) &&
                        (j[rowname] === sq[rowname])
                });
                if (x.length > 0) {
                    seqPoints = [...seqPoints, ...x];
                }
            });
            return seqPoints;
            */
        }

        let seqPoints = [];

        matrixByTypeRow.map(jtype => {
            const t = checkThis(jtype, "rows");
            seqPoints = [...seqPoints, ...t];
        })


        matrixByTypeCol.map(jtype => {
            const t = checkThis(jtype, "columns", "column", "row");
            seqPoints = [...seqPoints, ...t];
        })

        //console.log(seqPoints);
        //eliminate a seq:
        if (seqPoints.length) {
            //need ramda for these fills...

            console.log(seqPoints[0])

            let elimJewels, normalJewels;
            if (seqPoints[0].direction === "rows") {
                //console.log(this.state.jewelData)
                elimJewels = this.state.jewelData.filter(j => {
                    //console.log(j.row, j.column, seqPoints[0])
                    return j.row === seqPoints[0].row && j.column < (seqPoints[0].column + seqPoints[0].count) && j.column >= seqPoints[0].column
                })

                normalJewels = this.state.jewelData.filter(j => {
                    //console.log(j.row, j.column, seqPoints[0])
                    return j.row !== seqPoints[0].row || j.column >= (seqPoints[0].column + seqPoints[0].count) || j.column < seqPoints[0].column//flip who has the =
                })
            }
            else {
                //columns-oriented direction
                elimJewels = this.state.jewelData.filter(j => j.column === seqPoints[0].column && j.row < (seqPoints[0].row + seqPoints[0].count) && j.row >= seqPoints[0].row);
                normalJewels = this.state.jewelData.filter(j => j.column !== seqPoints[0].column && j.row > (seqPoints[0].row + seqPoints[0].count) && j.row <= seqPoints[0].row);//flip who has the =
            }
            //return this.state.jewelData.filter(j=>j.row===s)


            console.log(elimJewels, normalJewels)
            const cols = elimJewels.map(j => j.column),
                rows = elimJewels.map(j => j.row),
                colRange = [Math.min(...cols), Math.max(...cols)],
                rowRange = [Math.min(...rows), Math.max(...rows)];
            let center, dist, direct;
            let centerRow, centerCol;

            const animateElimJewels = elimJewels.map(ej => {
                //console.log((ej.row))

                if (Math.abs(colRange[0] - colRange[1]) > 0) {
                    //movement on cols
                    //calc distance from center
                    center = ((colRange[1] > colRange[0]) ? colRange[0] : colRange[1]) + (Math.abs(colRange[1] - colRange[0]) / 2)
                    centerCol = center;
                    centerRow = ej.row;
                    dist = center - ej.column;
                    direct = dist > 0 ? "west" : "east";

                    
                }
                else {
                    //movement on row;
                    center = ((rowRange[1] > rowRange[0]) ? rowRange[0] : rowRange[1]) + (Math.abs(rowRange[1] - rowRange[0]) / 2)
                    dist = center - ej.row;
                    direct = dist > 0 ? "north" : "south";
                    centerCol = ej.column;
                    centerRow = center;
                    
                }


                //TEMP!!!!
                //direct = "static"
                //dist = 0

                console.log("cemter: ", centerRow, centerCol)
                return { ...ej, row: centerRow, column: centerCol, highLighted: true, animate: { direction: direct, magnitude: Math.abs(dist) } }
            })


            console.log([...animateElimJewels, ...normalJewels.map(j=>{return {...j, animate: {direction:"static"}}})])
            //debugger
            this.setState({jewelData: [...animateElimJewels, ...normalJewels.map(j=>{return {...j, animate: {direction:"static"}}})]});

        }


        /*
        //STACK ALL POINTS IN A FLAT ARRAY - FOR HIGLIGHTING
        let seqPoints = [];

        matrixByTypeRow.forEach(jtype => {
            const t = checkThis(jtype);
            seqPoints = [...seqPoints, ...t];
        })



        matrixByTypeCol.forEach(jtype => {
            const t = checkThis(jtype, "column", "row");
            seqPoints = [...seqPoints, ...t];
        })



        console.log(seqPoints)*/

        /*
        //UPDATE THE STATE TO SHOW HIGHLIGHTING
        this.setState({
            jewelData: jewelData.map((j, i) => {
                if (seqPoints.filter(sq => (sq.row === j.row && sq.column === j.column)).length) {
                    //console.log("FOUND!!!")
                    return { ...j, highLighted: true }
                }
                else {
                    //console.log("NOT FOUND")
                    return { ...j, highLighted: false }
                }
            })
        })*/




    }



    onJewelClick = (row, col) => {
        let tempJewelData = this.state.jewelData.map(j => {
            return { ...j, isSelected: (j.row === row && j.column === col) ? true : false, animate: { direction: "static" } }
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
                        animate: { direction: animationDirects[1], magnitude: 1 },
                        isSelected: false
                    }
                    const currJewel = {
                        ...tempJewelData.find(j => (j.row === row && j.column === col)),
                        animate: { direction: animationDirects[0], magnitude: 1 },
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


        /*
        //WIP - how to flip back a rejected animation...
        const onReject = ()=>{
            
            //flip it back!
            currJewel = { ...currJewel, animate: animationDirects[1], row: row, column: col }
            lastJewel = { ...lastJewel, animate: animationDirects[0], row: lastJewel.row, column: lastJewel.column }

            tempJewelData = [...tempJewelData.filter(j => (j.row !== row || j.column !== col) && (j.row !== lastJewel.row || j.column !== lastJewel.column)),
                currJewel,
                lastJewel];
                this.setState({ "jewelData": tempJewelData, selectedJewel }, () => { this.checkForSequences() })        
        }

        this.setState({ "jewelData": tempJewelData, selectedJewel }, () => { this.checkForSequences([currJewel, lastJewel], onReject) })
    */
        
        this.setState({ "jewelData": tempJewelData, selectedJewel }, () => { this.checkForSequences() })

    }



    render() {
        //styled components block the triggering of children component lifecycles
        console.log(this.state.jewelData.length)
        const jewels = this.state.jewelData.map((j, i) => <Jewel key={"jewel" + i}  {...j} />)
        return (<div>
            <h1>Simple Bejeweled Clone</h1>
            <button onClick={this.initGame}>Start/Restart</button>





            {this.state.jewelData.length > 0 &&

                <div className="game-surface">
                    {jewels}

                </div>}

        </div >);
    }
}


render(<App />, document.getElementById('app'));

registerServiceWorker();