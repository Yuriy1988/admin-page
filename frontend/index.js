import Polyfill from 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import configureStore from './store/configureStore'

const store = configureStore();

if (DEV_MODE) {
    window.store = store;
}

const targetNode = document.getElementById('root');
const RootComponent = <Root store={store}/>;


//ENTRY point (Root render)
render(RootComponent, targetNode);
