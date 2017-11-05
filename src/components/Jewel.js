import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, {} from 'styled-components';

export default class Jewel extends Component {
    render(){
        const color = this.props.jewelType;
        const {width, height, row, column, isSelected} = this.props;
        const border = isSelected ? "solid 5px black": "none 0px";
        

        const JewelDiv = styled.div`
            position: absolute;
            box-sizing: border-box;
            background-color: ${color};
            color: white;
            height: ${height+"%"};
            width: ${width+"%"};
            top: ${(row*height)+"%"};
            left: ${(column*width)+"%"};
            border: ${border};
            
            `

        return (<JewelDiv onClick={()=>{this.props.onJewelClick(row, column)}}></JewelDiv>)
    }
}

Jewel.propTypes = {
    jewelType: PropTypes.string.isRequired,
    onJewelClick: PropTypes.func.isRequired,
    row: PropTypes.number.isRequired,
    column: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired
}