import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

const ROWS = 20;
const COLS = 20;


class App extends Component {
  render() {
    return (
      <div className="App">
          {_.range(0,ROWS).map((r)=> {
              return (<div className="Row">
                  {_.range(0,COLS).map((c)=><div className="Col">&nbsp;</div>)}
             </div>)
          })}
      </div>
    );
  }
}

export default App;
