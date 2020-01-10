import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Assets } from 'react-navigation-stack';

const inStoreStyles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'space-between',
    },

    mainHeader: {
    alignContent: 'center',
    fontSize: 30,
    fontFamily: 'serif',
    color: 'orange'
    },

    headerStyle: {
    fontSize: 21,
    fontWeight: 'bold',
    paddingTop: 20,
    color: 'orange',
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

export default(inStoreStyles)
