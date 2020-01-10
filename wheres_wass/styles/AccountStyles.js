import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const accountStyles = StyleSheet.create({
    container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    justifyContent: 'space-around',
    alignItems: 'center'
    },
    
    textStyle: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'monospace',
    textAlign: 'center'
    },

    buttons: {
        justifyContent: 'space-evenly'
    }
}
);

export default(accountStyles)
