import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, {} from 'styled-components';
import Jewel from './Jewel'

export default class GameSurface extends Component {
    render(){
        const GameDiv = styled.div`
            background-color: grey;
            width: 800px;
            height: 600px;
            margin: 0 auto;
            
            @media (max-width: 1000px) { 
                width: 100%;
            }
            
            `

        return (<GameDiv>
            <Jewel jewelType="yellow" boxSize={0} />
            </GameDiv>)
    }
}

GameSurface.propTypes = {
    //jewelType: PropTypes.string.isRequired,
    //boxSize: PropTypes.number.isRequired
}