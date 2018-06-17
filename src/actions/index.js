import { _basicJewelTypes, _numCols, _numRows } from '../constants'

export const JEWEL_CLICK = "JEWEL_CLICK";
export const SEQUENCE_FOUND = "SEQUENCE_FOUND";
export const EXIT_ANIMATION = "EXIT_ANIMATION";
export const REMOVE_DUPLICATES = "REMOVE_DUPLICATES";
export const REMOVE_EXITED = "REMOVE_EXITED";
export const APPLY_GRAVITY = "APPLY_GRAVITY";
export const REPLACE_MISSING = "REPLACE_MISSING";
export const JEWELS_CREATED = "JEWELS_CREATED";
export const INTRO_COMPLETE = "INTRO_COMPLETE";
export const NO_SEQUENCES_FOUND = "NO_SEQUENCES_FOUND";


export const onJewelClick = (row, column, nextPhase) => {
    return {
        type: JEWEL_CLICK,
        jewel: [row, column],
        nextPhase
    }
}

export const onJewelsCreated = (jewels, nextPhase) => {
    return {
        type: JEWELS_CREATED,
        jewels,
        nextPhase
    }
}

export const onIntroComplete = (nextPhase) => {
    return {
        type: INTRO_COMPLETE,
        nextPhase
    }
}



export const onCheckForSequences = (jewels, nextPhase) => {
    console.log("checking")
    let seqCt = 0;

    const jewelTypeMatrix = new Array(_numRows).fill(null).map((r, i) => {
        return new Array(_numCols).fill(null).map((c, e) => {
            return jewels
                .filter(j => {
                    return j.row === i && j.column === e;
                })
                .reduce((acc, curr) => curr.jewelType, null);
        });
    });

    const matrixByTypeRow = _basicJewelTypes.map(jtype => {
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

    const matrixByTypeCol = _basicJewelTypes.map(jtype => {
        return new Array(_numCols).fill(null).map((c, ci) => {
            return new Array(_numRows)
                .fill(null)
                .map((r, ri) => {
                    //console.log(ci, ri)
                    return jewels
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
            //console.log(this.state.jewels)
            elimJewels = jewels.filter(j => {
                //console.log(j.row, j.column, seqPoints[0])
                return (
                    j.row === seqPoints[0].row &&
                    j.column < seqPoints[0].column + seqPoints[0].count &&
                    j.column >= seqPoints[0].column
                );
            });

            normalJewels = jewels.filter(j => {
                //console.log(j.row, j.column, seqPoints[0])
                return (
                    j.row !== seqPoints[0].row ||
                    j.column >= seqPoints[0].column + seqPoints[0].count ||
                    j.column < seqPoints[0].column
                ); //flip who has the =
            });
        } else {
            //columns-oriented direction
            elimJewels = jewels.filter(
                j =>
                    j.column === seqPoints[0].column &&
                    j.row < seqPoints[0].row + seqPoints[0].count &&
                    j.row >= seqPoints[0].row
            );
            normalJewels = jewels.filter(
                j =>
                    j.column !== seqPoints[0].column ||
                    j.row >= seqPoints[0].row + seqPoints[0].count ||
                    j.row < seqPoints[0].row
            ); //flip who has the =
        }

        //return { active: elimJewels, normal: normalJewels };
        return {
            type: SEQUENCE_FOUND,
            sequences: elimJewels,
            nextPhase
        }
    }

    //return undefined;
    return {
        type: NO_SEQUENCES_FOUND,
        nextPhase
    }
}


