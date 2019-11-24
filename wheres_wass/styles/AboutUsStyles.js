import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const aboutUsStyles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    },

    mainHeader: {
    alignContent: 'center',
    fontSize: 30,
    paddingBottom: 20,
    fontFamily: 'serif',
    color: 'red'
    },

    headerStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 20,
    color: 'white',
    fontFamily: 'serif',
    alignContent: 'center'
    },
    
    textStyle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'serif',
    justifyContent: 'space-evenly'
    }
}
);

export default(aboutUsStyles)
