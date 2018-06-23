import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { range, max } from "ramda";
import Jewel from "../components/Jewel";
//import "../style.css";

import {
  onJewelsCreated,
  onIntroComplete,
  onCheckForSequences,
  onSequenceFound,
  COLLAPSE_SEQUENCE,
  onAnimateExit,
  REMOVE_DUPLICATES,
  onCollapse,
  APPLY_GRAVITY,
  onApplyGravity,
  REMOVE_EXITED,
  onRemoveExiters,
  REPLACE_MISSING,
  onReplaceMissing,
  onJewelSwap,
  onSelectJewel,
  onCompleteSwappingJewels,
  COMPLETE_SWAP,
  INTRO_ANIMATION,
  CHECK_FOR_SEQUENCES,
  HIGHLIGHT_SEQUENCES,
  NEUTRAL
} from "../actions";
import {
  _basicJewelTypes,
  _numCols,
  _numRows,
} from "../constants";

class App extends React.Component {
  state = { selectedJewel: [], jewelData: [] };

jewelMaker = (r, c, duration) =>{
    return {
        jewelType:
          _basicJewelTypes[
            Math.floor(Math.random() * _basicJewelTypes.length)
          ],
        row: r,
        column: c,
        onJewelClick: this.onJewelClick,
        width:
          document.getElementsByClassName("game-surface")[0].clientWidth /
          _numCols,
        height:
          document.getElementsByClassName("game-surface")[0].clientHeight /
          _numRows,
        animate: duration ? { direction: "south", magnitude: _numRows, duration } : {direction: "static"},
        isSelected: false,
        highLighted: false
      }
}

  initGame = () => {
    let tempSet = [];

    for (var a = 0; a < _numCols; a++) {
      for (var b = 0; b < _numRows; b++) {
        const duration = _numRows * 0.075 + "s",
            tempJewel = this.jewelMaker(b, a, duration);
        tempSet.push(tempJewel);
      }
    }

    this.props.dispatch(onJewelsCreated(INTRO_ANIMATION, tempSet));
  };

  onJewelClick = (row, col) => {
    if (this.props.appData.animationPhase === NEUTRAL) {
      if (
        this.props.appData.selectedJewel[0] !== row ||
        this.props.appData.selectedJewel[1] !== col
      ) {
        //it wasnt the same jewel being clicked!!
        this.props.dispatch(onSelectJewel(NEUTRAL, row, col));

        //check if adjacent

        let selectedJewel = [row, col];

        const _isAdjacent = (pos1, pos2) =>
          Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) === 1;

        if (_isAdjacent(this.props.appData.selectedJewel, selectedJewel)) {
          this.props.dispatch(
            onJewelSwap(selectedJewel, this.props.appData.selectedJewel)
          );
        }
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.props.appData.animationPhase)
    switch (this.props.appData.animationPhase) {
      case INTRO_ANIMATION:
        setTimeout(
          () => this.props.dispatch(onIntroComplete(CHECK_FOR_SEQUENCES)),
          800
        );
        break;
      case CHECK_FOR_SEQUENCES:
        this.props.dispatch(onCheckForSequences(HIGHLIGHT_SEQUENCES, NEUTRAL));
        break;
      case HIGHLIGHT_SEQUENCES:
        setTimeout(() => this.props.dispatch(onSequenceFound(COLLAPSE_SEQUENCE)), 0);
        break;
      case COLLAPSE_SEQUENCE:
        setTimeout(() => this.props.dispatch(onCollapse(REMOVE_DUPLICATES)), 250);
        break;
      case REMOVE_DUPLICATES:
        this.props.dispatch(onAnimateExit(REMOVE_EXITED));
        break;
      case REMOVE_EXITED:
        setTimeout(() => this.props.dispatch(onRemoveExiters(APPLY_GRAVITY)), 0);
        break;
      case APPLY_GRAVITY:
        setTimeout(() => this.props.dispatch(onApplyGravity(COMPLETE_SWAP, this.jewelMaker)), 0);
        break;
      // case REPLACE_MISSING:
      //   setTimeout(
      //     () =>
      //       this.props.dispatch(
      //         onReplaceMissing(COMPLETE_SWAP, this.jewelMaker)
      //       ),
      //     100
      //   );
      //   break;
      case COMPLETE_SWAP:
        setTimeout(() => this.props.dispatch(onCompleteSwappingJewels(CHECK_FOR_SEQUENCES)), 500);
        break;
      default:
        return;
    }
  }

  render() {
    // console.log(
    //   this.props.appData.jewels.length,
    //   this.props.appData.animationPhase
    // );
    //styled components block the triggering of children component lifecycles?
    const jewels = this.props.appData.jewels.map((j, i) => (
      <Jewel key={"jewel" + i} {...j} />
    ));
    return (
      <div>
        <h1>Matching Game</h1>
        <button onClick={this.initGame}>Start/Restart</button>

        <div className="game-surface">{jewels}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    appData: state.appData
  };
};

export default (App = connect(mapStateToProps)(App));
