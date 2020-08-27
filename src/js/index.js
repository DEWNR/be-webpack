// import './style.css';
// import Icon from '../favicon_src.svg';
// import printMe from './print.js';
// import bookeasy_mods from './bookeasy-mods.js';
// import bookeasy_utility from './bookeasy-utility.js';
// import $ from 'jquery';
// window.jQuery = $;
// window.$ = $;

console.log('this is index.js');


// function component() {

//     const element = document.createElement('div');

//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');


//     const btn = document.createElement('button');
//     btn.innerHTML = 'Click me and check the console!';
//     btn.onclick = printMe;

//     element.appendChild(btn);

//     return element;

// }


// document.body.appendChild(component());

import { h, render } from 'preact';
// import './style';
let root;
let container = document.getElementById('App');

function init() {
	let App = require('../components/app').default;
	root = render(<App />, container, root);
}


// in development, set up HMR:
if (module.hot) {
	//require('preact/devtools');   // turn this on if you want to enable React DevTools!
	module.hot.accept('../components/app', () => requestAnimationFrame(init) );
}

init();