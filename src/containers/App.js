import React from "react";
import { connect } from "react-redux";
//import styled from "styled-components";
//import { range, max } from "ramda";
import Jewel from "../components/Jewel";
//import "../style.css";

import {
  onInitGame,
  onJewelSwap,
  onSelectJewel,
  NEUTRAL
} from "../actions";
import {
  _numCols,
  _numRows,
} from "../constants";

class App extends React.Component {
  state = { selectedJewel: [], jewelData: [] };
  _timer = undefined;

  initGame = () => {
    window.clearTimeout(this._timer)
    this.props.dispatch(onInitGame(_numRows, _numCols));
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
    const {appData} = this.props;

    if(appData.nextDispatchEvent){
      //pass jewelMaker down to ALL dispatch events?
      //or
      //add it to state??
      //or
      //move it to reducers and move that logic out of App.js
      this._timer = setTimeout(() => this.props.dispatch(appData.nextDispatchEvent), appData.dispatchDelay)
    }

    //console.log(this.props.appData.animationPhase)
    // switch (appData.animationPhase) {
    //   case INTRO_ANIMATION:
    //     console.log(this.props.appData.nextDispatchEvent)
    //     // setTimeout(
    //     //   () => this.props.dispatch(onIntroComplete()),
    //     //   800
    //     // );

    //     setTimeout(() => this.props.dispatch(appData.nextDispatchEvent), appData.dispatchDelay)
    //     break;
    //   case CHECK_FOR_SEQUENCES:
    //   //console.log(this.props.appData, this.props.appData.nextDispatchEvent)
    //     this.props.dispatch(onCheckForSequences());
    //     break;
    //   case HIGHLIGHT_SEQUENCES:
    //     setTimeout(() => this.props.dispatch(onSequenceFound()), 0);
    //     break;
    //   case COLLAPSE_SEQUENCE:
    //     setTimeout(() => this.props.dispatch(onCollapse()), 250);
    //     break;
    //   case REMOVE_DUPLICATES:
    //     this.props.dispatch(onAnimateExit());
    //     break;
    //   case REMOVE_EXITED:
    //     setTimeout(() => this.props.dispatch(onRemoveExiters()), 0);
    //     break;
    //   case APPLY_GRAVITY:
    //     setTimeout(() => this.props.dispatch(onApplyGravity(this.jewelMaker)), 0);
    //     break;
    //   case COMPLETE_SWAP:
    //     setTimeout(() => this.props.dispatch(onCompleteSwappingJewels()), 500);
    //     break;
    //   default:
    //     return;
    // }


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
