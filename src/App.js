import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';

const ROWS = 20;
const COLS = 20;

const start = [3,3];

const RIGHT = 39;
const DOWN = 40;
const LEFT = 37;
const UP = 38;

const MOVE_RIGHT = [0, 1];
const MOVE_LEFT = [0, -1];
const MOVE_DOWN = [1, 0];
const MOVE_UP = [-1, 0];

const MOVE_MAP = {};
MOVE_MAP[RIGHT] = MOVE_RIGHT;
MOVE_MAP[LEFT] = MOVE_LEFT;
MOVE_MAP[UP] = MOVE_UP;
MOVE_MAP[DOWN] = MOVE_DOWN;

const X = 0;
const Y = 1;
/*
left arrow	37
up arrow	38
right arrow	39
down arrow	40
*/

class App extends Component {
  constructor() {
    super();
    this.state = {
        curr_direction: RIGHT,
        level: 1,
        score: 0,
        snake: [start],
        speed: 700,
        tabs: [[start[X] + 3,start[Y] + 2]],
        doGrow: false,
        tabsEaten: 0,
        lost: false,
        interval: 0
    }
  }

  componentWillMount(){
      document.addEventListener("keydown", this.handleKeyPress.bind(this));
      this.runGame();
  }

  runGame() {
      clearInterval(this.state.interval);
      this.setState({interval: setInterval(this.doFrame.bind(this),this.state.speed)})
  }

  addTab() {
     var tabs = this.state.tabs;
     tabs.push([Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)]);
     this.setState({tabs:tabs})
  }

  doFrame() {
      this.moveSnek();
      const head = _.last(this.state.snake);
      this.eatTab(head[X],head[Y]);
      if(this.outOfBounds(head) || this.eatSelf(head[X],head[Y])) {
          clearInterval(this.state.interval);
          this.setState({lost:true});
          alert("Lost");
      }

  }

  outOfBounds(head) {
      return head[X] > ROWS || head[X] < 0 || head[Y] > COLS || head[Y] < 0;
  }

  moveSnek() {
    const newSnake = _.clone(this.state.snake);
    var newHead = _.clone(_.last(newSnake));
    if(this.state.doGrow) {
        this.setState({doGrow: false});
    } else {
        newSnake.shift();
    }
    const moveCoord = MOVE_MAP[this.state.curr_direction];
    newHead[X] += moveCoord[X];
    newHead[Y] += moveCoord[Y];
    newSnake.push(newHead);
    this.setState({snake: newSnake});
  }

  snakeClass(row, col) {
    if(_.reduce(this.state.snake, (a, b) => {
      return a || (b[X] == row && b[Y] == col);
    }, false)) {
      return "snek";
    }
    return "";
  }

  eatSelf(row, col) {
      var self = _.clone(this.state.snake);
      self.pop();
      if(_.reduce(self, (a, b) => {
                return a || (b[X] == row && b[Y] == col);
            }, false)) {
            return true;
      }
      return false;
  }

  levelUp() {
      this.setState({level: this.state.level + 1,speed:Math.ceil(this.state.speed * 0.9)});
      this.runGame();
  }

  eatTab(row, col) {
    var oldLength = this.state.tabs.length;
    var tabs = _.reject(this.state.tabs, (a) => {
            return (a[X] == row && a[Y] == col);
    });

    this.setState({tabs});
    if(tabs.length < oldLength) {
        this.setState({tabsEaten: this.state.tabsEaten + 1, score: this.state.score + 10, doGrow: true});
        if( this.state.tabsEaten % 5 == 0 ) {
            this.levelUp();
        }
        this.addTab();
    }
  }
tabClass(row, col) {
        if(_.reduce(this.state.tabs, (a, b) => {
                return a || (b[X] == row && b[Y] == col);
            }, false)) {
            return "tab";
        }
        return "";
  }


  handleKeyPress(e) {
    switch(e.keyCode) {
        case LEFT:
          this.setState({curr_direction: LEFT});
          break;
        case RIGHT:
          this.setState({curr_direction: RIGHT});
          break;
        case UP:
          this.setState({curr_direction:UP});
          break;
        case DOWN:
          this.setState({curr_direction:DOWN});
          break;
        default:
          break;
    }
  }

  render() {

    return (
      <div className="App">
          <div>Level: <span>{this.state.level}</span></div>
          <div>Score: {this.state.score}</div>
          <button disabled={!this.state.lost} onClick={()=>window.location.reload()}>Replay</button>
          {_.range(0,ROWS).map((r)=> {
              return (<div className="Row">
                  {_.range(0,COLS).map((c)=><div className={"Col " + this.snakeClass(r,c) + this.tabClass(r,c)}>&nbsp;</div>)}
             </div>)
          })}
      </div>
    );
  }
}

export default App;
