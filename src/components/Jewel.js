import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

export default class Jewel extends Component {

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
        const north = keyframes`
        to {
            transform: translateY(-100%);
        }`,
            south = keyframes`
              to {
                transform: translateY(100%);
              }`,
            east = keyframes`
              to {
                transform: translateX(-100%);
              }`,
            west = keyframes`
              to {
                transform: translateX(100%);
              }`;


        let animation = "";
        let startR = row, startC = column;



        switch (animate) {
            case "north":
                animation = north + " 0.20s linear";
                startR += 1;
                break;
            case "south":
                animation = south + " 0.20s linear";
                startR -= 1;
                break;
            case "east":
                animation = east + " 0.20s linear";
                startC += 1;
                break;
            case "west":
                animation = west + " 0.20s linear";
                startC -= 1;
                break;
            default:
                animation = "";
        };




        const JewelDiv = styled.div`
            position: absolute;
            box-sizing: border-box;
            padding: 5px 5px;
            background-color: ${highLighted? "yellow":"none"};
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


        return (<JewelDiv onClick={() => { this.props.onJewelClick(row, column) }}><img className="jewel-image" src={"images/png/" + bg} /></JewelDiv>)
    }
}

Jewel.propTypes = {
    jewelType: PropTypes.number.isRequired,
    onJewelClick: PropTypes.func.isRequired,
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    animate: PropTypes.string.isRequired,
    highLighted: PropTypes.bool.isRequired
}