import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

export default class Test extends Component {
    constructor(props){
        super(props);
        console.log("contruct")
    }

    componentDidUpdate(){
        console.log("updated");
    }
    componenDidMount(){
        console.log("mounted");
    }
    componentWillUpdate(){
        console.log("will update");
    }
    componentWillReceiveProps(nextprops){
        console.log("Getting props");
    }
    
    render() {
        
        

        return (<div>Test</div>)
    }
}

Test.propTypes = {
}