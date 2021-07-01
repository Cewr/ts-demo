import React from 'react';
import './App.css';
import ScrollBar from './components/react-free-scrollbar';
import Roll from './components/Roll';


function App() {
  let num = 200;

  let str = ''

  while (num--) {
    str += num
  }

  return (
    <div className="App">

      <div className="main">
        <Roll height={70}>
          <div>{str}</div>
        </Roll>
      </div>

    </div>
  );
}

export default App;
