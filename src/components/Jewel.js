import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

export default class Jewel extends Component {
    _animDuration = ".40s";

    render() {
        //const color = this.props.jewelType;
        let bg = "";
        switch (this.props.jewelType) {
            case 0:
                bg = "001-pizza.png";
                break;
            case 1:
                bg = "002-beach-ball.png";
                break;
            case 2:
                bg = "003-star.png";
                break;
            case 3:
                bg = "004-gift.png";
                break;
            case 4:
                bg = "005-ice-cream.png";
                break;
            case 5:
                bg = "006-dog.png";
                break;
            case 6:
                bg = "007-cat.png";
                break;


        }



        const { width, height, row, column, isSelected, animate, highLighted } = this.props;
        const border = isSelected ? "solid 5px black" : "none 0px";
        const shiftPercent = animate.magnitude * 100;

        const north = keyframes`
        to {
            transform: translateY(-${shiftPercent}%);
        }`,
            south = keyframes`
              to {
                transform: translateY(${shiftPercent}%);
              }`,
            east = keyframes`
              to {
                transform: translateX(-${shiftPercent}%);
              }`,
            west = keyframes`
              to {
                transform: translateX(${shiftPercent}%);
              }`,
            shrink = keyframes`
              to {
                  transform: scale(0) rotate(180deg);
              }
            `;


        let animation = "";
        let startR = row, startC = column;
        let easeInCubic = " cubic-bezier(0.550, 0.055, 0.675, 0.190)"

        const { duration } = this.props.animate;


        switch (animate.direction) {
            case "shrink":
                animation = shrink + " " + duration + " linear";
                break;
            case "north":
                animation = north + " " + duration + easeInCubic;
                startR += animate.magnitude;
                break;
            case "south":
                animation = south + " " + duration + easeInCubic;
                startR -= animate.magnitude;
                break;
            case "east":
                animation = east + " " + duration + easeInCubic;
                startC += animate.magnitude;
                break;
            case "west":
                animation = west + " " + duration + easeInCubic;
                startC -= animate.magnitude;
                break;
            default:
                animation = "";
        };




        const JewelDiv = styled.div`
            position: absolute;
            box-sizing: border-box;
            padding: 5px 5px;
            background-color: ${highLighted ? "yellow" : "none"};
            height: ${height + "px"};
            width: ${width + "px"};
            top: ${ (startR * height) + "px"};
            left: ${(startC * width) + "px"};
            border: ${border};
            animation: ${animation};
            animation-fill-mode: forwards;

            `;

        const JewelImage = styled.img`
    
            `;

        if (animate.direction === "shrink") {
            console.log("SHRINKING ", row, column, startR, startC, animation, west, shrink)
        }

        return (<JewelDiv onClick={() => { this.props.onJewelClick(row, column) }}><img className="jewel-image" src={"images/png/" + bg} /></JewelDiv>)
    }
}

Jewel.PropTypes = {
    jewelType: PropTypes.number.isRequired,
    onJewelClick: PropTypes.func.isRequired,
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    animate: PropTypes.object.isRequired,
    highLighted: PropTypes.bool.isRequired
}