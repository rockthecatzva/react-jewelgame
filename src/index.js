import registerServiceWorker from "./registerServiceWorker";
import React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { range, max } from "ramda";
//import GameSurface from './components/GameSurface';
import Jewel from "./components/Jewel";
import "./style.css";

//import Test from './components/Test'

class App extends React.Component {
    state = { selectedJewel: [], animatingJewels: [], jewelData: [] };

    _isAdjacent = (pos1, pos2) =>
        Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) === 1;
    _basicJewelTypes = [0, 1, 2, 3, 4, 5, 6];
    _numCols = 8;
    _numRows = 8;

    _jewelWidth = 50; //(1 / _numCols) * _gameDivWidth,
    _jewelHeight = 50; //(1 / _numRows) * _gameDivHeight;
    _gameDivWidth = this._jewelWidth * this._numCols;
    _gameDivHeight = this._jewelHeight * this._numRows;

    initGame = () => {
        const { _numCols, _numRows, _basicJewelTypes } = this;
        let tempSet = [],
            tempJewel;

        for (var a = 0; a < _numCols; a++) {
            for (var b = 0; b < _numRows; b++) {
                const duration = _numRows * 0.075 + "s";
                tempJewel = {
                    jewelType:
                        _basicJewelTypes[
                        Math.floor(Math.random() * _basicJewelTypes.length)
                        ],
                    row: b,
                    column: a,
                    onJewelClick: this.onJewelClick,
                    width:
                        document.getElementsByClassName("game-surface")[0].clientWidth /
                        this._numCols,
                    height:
                        document.getElementsByClassName("game-surface")[0].clientHeight /
                        this._numRows,
                    animate: { direction: "south", magnitude: _numRows, duration },
                    isSelected: false,
                    highLighted: false
                };

                tempSet.push(tempJewel);
            }
        }

        this.setState({ jewelData: tempSet, selectedJewel: [] }, () => {
            this.keepReplacingSequence();
        });
    };

    keepReplacingSequence = (elimJewels = []) => {
        const delayCaller = (delay, data) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(data), delay);
            });
        };

        delayCaller(1000).then(() => {
            let seqs = this.checkForSequences();
            if (seqs) {
                this.animateCollapse(seqs)
                    .then(d => delayCaller(200, d))
                    .then(d => this.removeDuplicates(d))
                    .then(d => this.animateRemoval(d)) //does it need d?
                    .then(d => delayCaller(200, d))
                    .then(d => this.removeShrunks(d)) //does it need d?
                    //MUST HAVE delay before gravity - otherwise shrink animation gets overidden
                    .then(d => this.applyGravity(d)) //does it need d?
                    .then(d=>delayCaller(500,d))
                    .then(d=>this.replaceMissingJewels(d))
                    .then((d) => delayCaller(400, d))
                    .then(()=> {this.keepReplacingSequence()})
            }
        });
    };

    checkForSequences = () => {
        let jewelData = this.state.jewelData;
        console.log("checking for sequences");
        //console.log(jdata, this.state.jewelData)
        let seqCt = 0;

        const jewelTypeMatrix = new Array(this._numRows).fill(null).map((r, i) => {
            return new Array(this._numCols).fill(null).map((c, e) => {
                return jewelData
                    .filter(j => {
                        return j.row === i && j.column === e;
                    })
                    .reduce((acc, curr) => curr.jewelType, null);
            });
        });

        const matrixByTypeRow = this._basicJewelTypes.map(jtype => {
            return jewelTypeMatrix.map(r => {
                return r
                    .map(c => {
                        return c === jtype ? 1 : 0;
                    })
                    .reduce((acc, curr) => {
                        return acc + curr.toString();
                    });
            });
        });

        const matrixByTypeCol = this._basicJewelTypes.map(jtype => {
            return new Array(this._numCols).fill(null).map((c, ci) => {
                return new Array(this._numRows)
                    .fill(null)
                    .map((r, ri) => {
                        //console.log(ci, ri)
                        return jewelData
                            .filter(j => j.row === ri && j.column === ci)
                            .reduce((acc, curr) => curr.jewelType, null) === jtype
                            ? 1
                            : 0;
                    })
                    .reduce((acc, curr) => {
                        return acc + curr.toString();
                    });
            });
        });

        const matrixToObject = (
            jewelStringCts,
            direction,
            rowname = "row",
            colname = "column"
        ) => {
            //a function that gets a binary-string representing a row or col of a
            //jewel-type - indicating where its members are located
            //returns info on which binary-strings contain patterns
            let found = [];
            jewelStringCts.forEach((r, ri) => {
                const segs = r.split("0").map(str => str.length);
                if (segs.filter(rstr => rstr >= 3).length > 0) {
                    segs.forEach((s, ci) => {
                        if (s >= 3) {
                            found.push({
                                [rowname]: ri,
                                [colname]: r.indexOf("111"),
                                count: s,
                                direction
                            });
                        }
                    });
                }
            });

            //found is raw r,c,span ob
            return found;
        };

        let seqPoints = [];

        matrixByTypeCol.map(jtype => {
            const t = matrixToObject(jtype, "columns", "column", "row");
            seqPoints = [...seqPoints, ...t];
        });

        matrixByTypeRow.map(jtype => {
            const t = matrixToObject(jtype, "rows");
            seqPoints = [...seqPoints, ...t];
        });

        //mutating.....!
        seqPoints = seqPoints.sort((a, b) => b.count - a.count);
        //return seqPoints.sort((a, b) => b.count - a.count);

        if (seqPoints.length) {
            //need ramda for these fills...

            //console.log(seqPoints[0])

            let elimJewels, normalJewels;
            if (seqPoints[0].direction === "rows") {
                //console.log(this.state.jewelData)
                elimJewels = this.state.jewelData.filter(j => {
                    //console.log(j.row, j.column, seqPoints[0])
                    return (
                        j.row === seqPoints[0].row &&
                        j.column < seqPoints[0].column + seqPoints[0].count &&
                        j.column >= seqPoints[0].column
                    );
                });

                normalJewels = this.state.jewelData.filter(j => {
                    //console.log(j.row, j.column, seqPoints[0])
                    return (
                        j.row !== seqPoints[0].row ||
                        j.column >= seqPoints[0].column + seqPoints[0].count ||
                        j.column < seqPoints[0].column
                    ); //flip who has the =
                });
            } else {
                //columns-oriented direction
                elimJewels = this.state.jewelData.filter(
                    j =>
                        j.column === seqPoints[0].column &&
                        j.row < seqPoints[0].row + seqPoints[0].count &&
                        j.row >= seqPoints[0].row
                );
                normalJewels = this.state.jewelData.filter(
                    j =>
                        j.column !== seqPoints[0].column ||
                        j.row >= seqPoints[0].row + seqPoints[0].count ||
                        j.row < seqPoints[0].row
                ); //flip who has the =
            }

            return { active: elimJewels, normal: normalJewels };
        }

        return undefined;
    };

    animateRemoval(jewelOb, onNext) {
        return new Promise((resolve, reject) => {
            const active = jewelOb.active.map(j => {
                return { ...j, animate: { direction: "shrink", duration: "0.2s" } };
            });
            const normal = jewelOb.normal.map(j => {
                return { ...j, animate: { direction: "static" } };
            });

            this.setState({ jewelData: [...active, ...normal] }, () => {
                resolve({ active, normal });
            });
        });
    }

    removeShrunks(jewelOb, onNext) {
        return new Promise((resolve, reject) => {
            //const normal = jewelOb.normal.map(j => { return { ...j, animate: { direction: "static" } } })
            const normal = this.state.jewelData.filter(
                j => j.animate.direction !== "shrink"
            );

            this.setState({ jewelData: [...normal] }, () => {
                resolve({ normal });
            });
        });
    }

    removeDuplicates(jewelOb, onNext) {
        return new Promise((resolve, reject) => {
            const { active, normal } = jewelOb;

            this.setState({ jewelData: [active[0], ...normal] }, () => {
                resolve({ active: [active[0]], normal });
            });
        });
    }



    findGaps = ()=>{
        let gaps = [];
        for (let i = 0; i < this._numRows; i++) {
            for (let e = 0; e < this._numCols; e++) {
                if (
                    !this.state.jewelData.find(
                        j =>
                            j.row === i &&
                            j.column === e &&
                            j.animate.direction !== "shrink"
                    )
                ) {
                    gaps.push([i, e]);
                }
            }
        }

        return gaps;
    }

    //WHY ARE YOU PASSING ALONG jewelOb if its just the same as state!

    applyGravity(jewelOb) {
        return new Promise((resolve, reject) => {
            let gaps = this.findGaps();

            let normal = [],
                active = [];

            this.state.jewelData.forEach(j => {
                let g = gaps.filter(
                    g =>
                        g[1] === j.column &&
                        g[0] >= j.row &&
                        j.animate.direction === "static"
                ); //find gaps in my column
                if (g) {
                    const minDur = 0.4,
                        d = g.length * 0.12,
                        duration = (d > minDur ? d : minDur) + "s";

                    normal.push({
                        ...j,
                        row: j.row + g.length,
                        animate: { direction: "south", magnitude: g.length, duration }
                    });
                } else if (j.animate.direction === "static") {
                    normal.push(j);
                } else {
                    active.push(j);
                }
            });

            /*
                  for (let e = 0; e < this._numCols; e++) {
                      let gapCt = 0
                      for (let i = 0; i < this._numRows; i++) {
                          let j = this.state.jewelData.find(j => j.row === i && j.column === e);
                          let g = gaps.filter(g => g[1] === e && g[0] >= i);
                          const minDur = 0.4,
                              d = g.length * .12,
                              duration = (d > minDur ? d : minDur) + "s";
      
                          if (j) {
                              console.log(j.row, j.column, j.animate)
                          }
      
                          if (j && g.length) {
                              if (j.animate.direction === "static") {
                                  console.log(duration, g.length, (g.length * .12) | 0.3)
                                  normal.push({ ...j, row: j.row + g.length, animate: { direction: "south", magnitude: g.length, duration } })
                              }
                              else{
                                  active.push(j)
                              }
                          }
                          else if (j) {
                              normal.push(j)
                          }
                      }
                  }*/

            this.setState({ jewelData: [...normal, ...active] }, () => {
                resolve({ normal, active });
            });
        });
    }


    replaceMissingJewels(jewelOb) {
        return new Promise((resolve, reject) => {
            const { _numCols, _numRows, _basicJewelTypes} = this;
            const { jewelData } = this.state;
            let normal = [],
                active = [],
                gaps = this.findGaps();

            normal = jewelData.map(j=>{
                console.log(j.animate.direction)
                return {...j, animate: {direction: "static"}}
            })
            if (gaps.length) {
                console.log("There are missing jewels");

                 active = gaps.map(j=>{
                     
                     const duration = "0.6s"//(j[0]+1) * 0.09 + "s";
                     console.log(duration)
                     return {
                         jewelType:
                             _basicJewelTypes[
                             Math.floor(Math.random() * _basicJewelTypes.length)
                             ],
                         row: j[0],
                         column: j[1],
                         onJewelClick: this.onJewelClick,
                         width:
                             document.getElementsByClassName("game-surface")[0].clientWidth /
                             this._numCols,
                         height:
                             document.getElementsByClassName("game-surface")[0].clientHeight /
                             this._numRows,
                         animate: { direction: "south", magnitude: _numRows-j[0], duration },
                         isSelected: false,
                         highLighted: false
                         };
                 })

                 console.log(active)

                
            }


            this.setState({ jewelData: [...normal, ...active] }, () => {
                resolve({ normal, active });
            });
        });
    }



    animateCollapse(jewelOb, onNext) {
        return new Promise((resolve, reject) => {
            let elimJewels = jewelOb.active,
                normalJewels = jewelOb.normal;

            //console.log(elimJewels, normalJewels)
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
                    center =
                        (colRange[1] > colRange[0] ? colRange[0] : colRange[1]) +
                        Math.abs(colRange[1] - colRange[0]) / 2;
                    centerCol = center;
                    centerRow = ej.row;
                    dist = center - ej.column;
                    direct = dist > 0 ? "west" : "east";
                } else {
                    //movement on row;
                    center =
                        (rowRange[1] > rowRange[0] ? rowRange[0] : rowRange[1]) +
                        Math.abs(rowRange[1] - rowRange[0]) / 2;
                    dist = center - ej.row;
                    direct = dist > 0 ? "north" : "south";
                    centerCol = ej.column;
                    centerRow = center;
                }

                return {
                    ...ej,
                    row: centerRow,
                    column: centerCol,
                    highLighted: true,
                    animate: {
                        direction: direct,
                        magnitude: Math.abs(dist),
                        duration: "0.3s"
                    }
                };
            });

            const normal = normalJewels.map(j => {
                return { ...j, animate: { direction: "static" } };
            });
            this.setState({ jewelData: [...animateElimJewels, ...normal] }, () => {
                resolve({ active: animateElimJewels, normal });
            });
        });
    }

    onJewelClick = (row, col) => {
        let tempJewelData = this.state.jewelData.map(j => {
            return {
                ...j,
                isSelected: j.row === row && j.column === col ? true : false,
                animate: { direction: "static" }
            };
        });
        let selectedJewel = [row, col];

        if (this.state.selectedJewel.length) {
            if (
                this.state.selectedJewel[0] !== row ||
                this.state.selectedJewel[1] !== col
            ) {
                //a new box has been selected

                //check if its adjacent

                const isAdjacent = this._isAdjacent(this.state.selectedJewel, [
                    row,
                    col
                ]); //Math.abs(this.state.selectedJewel[0] - row) + Math.abs(this.state.selectedJewel[1] - col);

                if (isAdjacent) {
                    const rowDiff = this.state.selectedJewel[0] - row,
                        colDiff = this.state.selectedJewel[1] - col;

                    selectedJewel = []; //[selectedJewel[0]+rowDiff, selectedJewel[1]+colDiff]
                    let primaryDirection, secondaryDirection;

                    let animationDirects = Math.abs(rowDiff)
                        ? rowDiff > 0
                            ? ["south", "north"]
                            : ["north", "south"]
                        : colDiff < 0
                            ? ["east", "west"]
                            : ["west", "east"];

                    const lastJewel = {
                        ...tempJewelData.find(
                            j =>
                                j.row === this.state.selectedJewel[0] &&
                                j.column === this.state.selectedJewel[1]
                        ),
                        animate: {
                            direction: animationDirects[1],
                            magnitude: 1,
                            duration: "0.1s"
                        },
                        isSelected: false
                    };
                    const currJewel = {
                        ...tempJewelData.find(j => j.row === row && j.column === col),
                        animate: {
                            direction: animationDirects[0],
                            magnitude: 1,
                            duration: "0.1s"
                        },
                        isSelected: false
                    };

                    tempJewelData = [
                        ...tempJewelData.filter(
                            j =>
                                (j.row !== row || j.column !== col) &&
                                (j.row !== lastJewel.row || j.column !== lastJewel.column)
                        ),
                        { ...currJewel, row: lastJewel.row, column: lastJewel.column },
                        { ...lastJewel, row: row, column: col }
                    ];
                } else {
                    //not adjacent -
                }
            }
        } else {
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

        this.setState({ jewelData: tempJewelData, selectedJewel }, () => {
            this.keepReplacingSequence();
        });
    };

    render() {
        //styled components block the triggering of children component lifecycles
        console.log(this.state.jewelData.length);
        const jewels = this.state.jewelData.map((j, i) => (
            <Jewel key={"jewel" + i} {...j} />
        ));
        return (
            <div>
                <h1>Simple Bejeweled Clone</h1>
                <button onClick={this.initGame}>Start/Restart</button>

                <div className="game-surface">{jewels}</div>
            </div>
        );
    }
}

render(<App />, document.getElementById("app"));

registerServiceWorker();
