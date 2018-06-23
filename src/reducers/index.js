import { combineReducers } from "redux";
import {
  JEWELS_CREATED,
  JEWEL_CLICK,
  SEQUENCE_FOUND,
  INTRO_COMPLETE,
  COLLAPSE_SEQUENCE,
  REMOVE_EXITERS,
  COLLAPSE_COMPLETE,
  REMOVE_DUPLICATES,
  EXIT_ANIMATION,
  APPLY_GRAVITY,
  REPLACE_MISSING,
  REMOVE_EXITED,
  SELECT_JEWEL,
  SWAP_JEWELS,
  COMPLETE_SWAP,
  NEUTRAL,
  INTRO_ANIMATION,
  JEWEL_CLICK_IN,
  CHECK_FOR_SEQUENCES,
  HIGHLIGHT_SEQUENCES
} from "../actions";

import {
  _numCols,
  _numRows,
  _basicJewelTypes,
  
} from "../constants";

const _checkForSequences = jewels => {
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

    return elimJewels;
  }

  return [];
};

const _animateCollapse = jewels => {
  console.log("ANIMATING");

  let elimJewels = jewels.filter(j => j.highLighted),
    normalJewels = jewels.filter(j => !j.highLighted);

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

  return [...normal, ...animateElimJewels];
};

const _animateRemoval = jewels => {
  const active = jewels.filter(j => j.animate.direction !== "static").map(j => {
    return { ...j, animate: { direction: "shrink", duration: "0.2s" } };
  });
  const normal = jewels.filter(j => j.animate.direction === "static");

  return [...active, ...normal];
};

const _removeDuplicates = jewels => {
  const active = jewels.filter(j => j.animate.direction !== "static"),
    normal = jewels.filter(j => j.animate.direction === "static");

  return [active[0], ...normal];
};

const _findGaps = jewels => {
  let gaps = [];
  for (let i = 0; i < _numRows; i++) {
    for (let e = 0; e < _numCols; e++) {
      if (
        !jewels.find(
          j => j.row === i && j.column === e && j.animate.direction !== "shrink"
        )
      ) {
        gaps.push([i, e]);
      }
    }
  }

  return gaps;
};

const _applyGravity = jewels => {
  console.log("DONT NEED TO BE SPLITTING UP NORMAL AND ACTIVE ANYMORE!!!");
  let gaps = _findGaps(jewels);

  let normal = [],
    active = [];

  jewels.forEach(j => {
    let g = gaps.filter(
      g =>
        g[1] === j.column && g[0] >= j.row && j.animate.direction === "static"
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

  return [...normal, ...active];
};

const _removeShrunks = jewels => {
  return jewels.filter(j => j.animate.direction !== "shrink");
};

const _replaceMissingJewels = (jewels, jewelMaker) => {
  let normal = [],
    active = [],
    gaps = _findGaps(jewels);

  normal = jewels.map(j => {
    return { ...j, animate: { direction: "static" } };
  });
  if (gaps.length) {
    active = gaps.map(j => {
      const duration = "0.6s"; //(j[0]+1) * 0.09 + "s";
      return jewelMaker(j[0], j[1], duration);
    });
  }

  return [...active, ...normal];
};

const _swapJewels = (j1, j2, jewels) => {
  console.log("SWAPPIGN JULES");

  const rowDiff = j1[0] - j2[0],
    colDiff = j1[1] - j2[1];

  //selectedJewel = []; //[selectedJewel[0]+rowDiff, selectedJewel[1]+colDiff]
  let primaryDirection, secondaryDirection;

  let animationDirects = Math.abs(rowDiff)
    ? rowDiff > 0
      ? ["south", "north"]
      : ["north", "south"]
    : colDiff < 0
      ? ["east", "west"]
      : ["west", "east"];

  const lastJewel = {
    ...jewels.find(j => j.row === j1[0] && j.column === j1[1]),
    animate: {
      direction: animationDirects[1],
      magnitude: 1,
      duration: "0.1s"
    },
    isSelected: false
  };
  const currJewel = {
    ...jewels.find(j => j.row === j2[0] && j.column === j2[1]),
    animate: {
      direction: animationDirects[0],
      magnitude: 1,
      duration: "0.1s"
    },
    isSelected: false
  };

  return [
    ...jewels
      .filter(
        j =>
          (j.row !== j1[0] || j.column !== j1[1]) &&
          (j.row !== j2[0] || j.column !== j2[1])
      )
      .map(j => ({ ...j, animate: { direction: "static" } })),
    { ...currJewel, row: j1[0], column: j1[1], isSelected: true },
    { ...lastJewel, row: j2[0], column: j2[1], isSelected: false }
  ];
};

function appData(
  state = {
    jewels: [],
    selectedJewel: [],
    score: 0,
    time: 0,
    animationPhase: NEUTRAL
  },
  action
) {
  switch (action.type) {
    case JEWELS_CREATED:
      return {
        ...state,
        jewels: action.jewels,
        animationPhase: INTRO_ANIMATION
      };
    case INTRO_COMPLETE:
      const jewels = state.jewels.map(j => {
        return { ...j, animate: { direction: "static" } };
      });
      return { ...state, jewels, animationPhase: CHECK_FOR_SEQUENCES };
    case CHECK_FOR_SEQUENCES:
      const seqs = _checkForSequences(state.jewels),
        highlightJewels = seqs.map(j => ({ ...j, highLighted: true })),
        normalJewels = state.jewels.filter(j => {
          return seqs.reduce((acc, curr) => {
            if (curr.row === j.row && curr.column === j.column) return false;
            return acc;
          }, true);
        });

      //console.log(seqs)
      return {
        ...state,
        jewels: [...highlightJewels, ...normalJewels],
        animationPhase:
          highlightJewels.length > 0 ? HIGHLIGHT_SEQUENCES : NEUTRAL
      };
    case SEQUENCE_FOUND:
      return {
        ...state,
        jewels: _animateCollapse(state.jewels),
        animationPhase: COLLAPSE_SEQUENCE
      };
    case COLLAPSE_COMPLETE:
      return {
        ...state,
        jewels: _removeDuplicates(state.jewels),
        animationPhase: REMOVE_DUPLICATES
      };
    case EXIT_ANIMATION:
      return {
        ...state,
        jewels: _animateRemoval(state.jewels),
        animationPhase: REMOVE_EXITED
      };
    case REMOVE_EXITED:
      return {
        ...state,
        jewels: _removeShrunks(state.jewels),
        animationPhase: APPLY_GRAVITY
      };
    case APPLY_GRAVITY:
      return {
        ...state,
        jewels: _applyGravity(state.jewels),
        animationPhase: REPLACE_MISSING
      };
    case REPLACE_MISSING:
      return {
        ...state,
        //avoid sending clickHandler thru action -
        // - use a factory function 
        jewels: _replaceMissingJewels(state.jewels, action.jewelMaker),
        animationPhase: INTRO_ANIMATION
      };
    case JEWEL_CLICK:
      return {
        ...state,
        selectedJewel: action.jewel,
        animationPhase: JEWEL_CLICK_IN
      };
    case SELECT_JEWEL:
      const selectedJewel = state.jewels
          .filter(j => j.row === action.row && j.column === action.column)
          .map(j => ({ ...j, isSelected: true })),
        otherJewels = state.jewels
          .filter(j => j.row !== action.row || j.column !== action.column)
          .map(j => ({ ...j, isSelected: false }));
      return {
        ...state,
        selectedJewel: [action.row, action.column],
        jewels: [...selectedJewel, ...otherJewels]
      };
    case SWAP_JEWELS:
      return {
        ...state,
        jewels: _swapJewels(action.jewels[0], action.jewels[1], state.jewels),
        animationPhase: COMPLETE_SWAP
      };
    case COMPLETE_SWAP:
      return {
        ...state,
        jewels: state.jewels.map(j => ({
          ...j,
          animate: { direction: "static" }
        })),
        animationPhase: NEUTRAL
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appData
});

export default rootReducer;
