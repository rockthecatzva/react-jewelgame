import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

export default class Jewel extends Component {
    render() {
        const color = this.props.jewelType;
        const { width, height, row, column, isSelected, animate } = this.props;
        const border = isSelected ? "solid 5px black" : "none 0px";
        const north = keyframes`
        to {
            transform: translateY(100%);
        }`,
            south = keyframes`
              to {
                  transform: translateY(-100%);
              }`,
              east = keyframes`
              to {
                  transform: translateX(100%);
              }`,
              west = keyframes`
              to {
                  transform: translateX(-100%);
              }`;


        let animation = "";

        switch (animate) {
            case "north":
                animation = north + " 0.20s linear";
                break;
            case "south":
                animation = south + " 0.20s linear";
                break;
            case "east":
                animation = east + " 0.20s linear";
                break;
            case "west":
                animation = west + " 0.20s linear";
                break;
            default:
                animation = "";
        }

        const JewelDiv = styled.div`
            position: absolute;
            box-sizing: border-box;
            background-color: ${color};
            color: white;
            height: ${height + "px"};
            width: ${width + "px"};
            top: ${(row * height) + "px"};
            left: ${(column * width) + "px"};
            border: ${border};
            animation: ${animation};
            animation-fill-mode: forwards;
            `

        return (<JewelDiv onClick={() => { this.props.onJewelClick(row, column) }}></JewelDiv>)
    }
}

Jewel.propTypes = {
    jewelType: PropTypes.string.isRequired,
    onJewelClick: PropTypes.func.isRequired,
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    animate: PropTypes.string.isRequired
}