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
        marginHorizontal: 25,
    },

    textinput : {
		borderBottomColor : 'orange',
		borderBottomWidth : 1,
		padding : 10,
		color : 'white',
        margin:20,
        fontSize : 20
	
    }
}
);

export default(accountStyles)
