import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const accountStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'flex-end',
        paddingBottom : 70
    },
    
    textStyle: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'monospace',
        textAlign: 'center',
    },

    buttons: {
        justifyContent: 'space-evenly'
    },

    textinput : {
		borderColor : 'orange',
		borderWidth : 2,
		padding : 10,
		color : 'white',
		margin:10
	
    }
}
);

export default(accountStyles)
