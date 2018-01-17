import * as React from 'react';
import * as ReactDOM from 'react-dom';

const hello = () => "Hello World!";
// main
ReactDOM.render(
    <h1>{hello()}</h1>,
    document.getElementById('js-main')
);
