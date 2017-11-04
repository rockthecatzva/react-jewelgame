import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, {} from 'styled-components';

export default class Jewel extends Component {
    render(){
        const color = this.props.jewelType;
        const JewelDiv = styled.div`
            background-color: ${color};
            color: white;
            height: 12%;
            width: 100%;
            `

        return (<JewelDiv>This is a jewel</JewelDiv>)
    }
}

Jewel.propTypes = {
    jewelType: PropTypes.string.isRequired,
}