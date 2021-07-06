import React from 'react';
import './App.css';
import ScrollBar from './components/react-free-scrollbar';
import Roll from './components/Roll';


function App() {
  let num = 0;

  let str = ''

  while (num < 100) {
    num++
    str += num + ','
  }

  return (
    <div className="App">

      <div className="main">
        <Roll height={90} noScrolling>
          <div>{str}</div>
        </Roll>
      </div>

      <div className="main">
        <Roll height={90}>
          <div>13465645</div>
        </Roll>
      </div>

    </div>
  );
}

export default App;
