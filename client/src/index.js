import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const socket = window.io('http://localhost:3000');

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));
registerServiceWorker();
