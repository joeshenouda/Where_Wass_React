import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

const aboutUsStyles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 21,
    fontWeight: 'bold',
    paddingTop: 20,
    color: 'red',
    fontFamily: 'serif',
    alignContent: 'center'
    },
    
    textStyle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'serif',
    textAlign: 'center'
    }
}
);

export default(aboutUsStyles)
