import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Cell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: null,
		};
	}
	render() {
		if (!this.props.won) {
			return (
				<button className="cell" onClick={() => this.props.onClick()}>
				{this.props.value}
				</button>
			);
		}
		else return (
			<button className="cell2" onClick={() => this.props.onClick()}>
			{this.props.value}
			</button>
		);
	}
}

class Playfield extends React.Component {
  	constructor(props) {
  		super(props);
  		this.state = {
        size: 9,
  		turn: false, /* Player turn: X = false, O = true */
        score_x:0,
        score_o:0,
        winState:[],
        full: 0, /* Playfield is full when counter reaches size */
  		cells: Array(9).fill(null),
  		};
  	}
  	newGame() {
  		let cells = Array(this.state.size).fill(null);
  		this.setState({cells:cells, turn:false, full:0, winState:[]});
  	}
    resetScore() {
      this.setState({score_x:0, score_o:0});
    }
    incrementScore(i) {
      if (i === "X")
        this.setState({score_x:this.state.score_x+1});
      else this.setState({score_o:this.state.score_o+1});
    }
  	handleClick(i) {
      if (this.state.cells[i] != null || this.state.full === this.state.size)
        return;
  	  const cells = this.state.cells.slice();	/* get a copy of cells array rather than mutating directly */
      cells[i] = this.state.turn ? 'O':'X';
      let won = checkWinCondition(cells);
      if (won) {
        this.incrementScore(won[1]);
        this.setState({cells:cells,full:this.state.size,winState:won});	/* reassign copy to original */
        setTimeout(()=>{this.newGame();}, 8000);	/* If 5 seconds passes after winning, call newGame() */
        return;										/* Either preserve context with .bind(this), or use arrow function */
      }
  		this.setState({cells:cells, turn:!this.state.turn, full:this.state.full+1});
  	}
  	renderCell(i) {
  		if (this.state.winState.length === 0) {
	  		return (
	    		<Cell value={this.state.cells[i]}
	    		onClick={() => this.handleClick(i)}
	    		/>
	    	);
	  	}
	  	else {
	  		if (this.state.winState[0].includes(i)) {
		  		return (
		    		<Cell value={this.state.cells[i]}
		    		won = {true}
		    		onClick={() => this.handleClick(i)}
		    		/>
		    	);
		  	}
		  	else return (
		    		<Cell value={this.state.cells[i]}
		    		onClick={() => this.handleClick(i)}
		    		/>
		    );
		}
  	}
  	render() {
    	const title = 'tic tac toe';
    	let winner_text = "";
    	const winner = checkWinCondition(this.state.cells);
    	let x_score = "X: " + this.state.score_x;
    	let o_score = "O: " + this.state.score_o;
    	if (this.state.full === this.state.size && !winner) {
      		winner_text = "Tie!";
      		setTimeout(()=>{this.newGame();}, 8000);	/* If 5 seconds passes after winning, call newGame() */
    	}
    	if (winner) 
    		winner_text = winner[1] + " wins!";
    	return (
	      	<div>
	        	<div className="title">{title}</div>
	        	<div className="winner">{winner_text}</div>
	        	<div className="row">
	          		{this.renderCell(0)}
	         		{this.renderCell(1)}
	          		{this.renderCell(2)}
	        	</div>
	        	<div className="row">
	          		{this.renderCell(3)}
	          		{this.renderCell(4)}
	          		{this.renderCell(5)}
	        	</div>
	        	<div className="row">
	          		{this.renderCell(6)}
	          		{this.renderCell(7)}
	          		{this.renderCell(8)}
	        	</div>
	        	<div className="score_x">{x_score}</div>
	        	<div className="score_o">{o_score}</div>
	        	<button className="button" onClick={() => this.resetScore()}>Reset Scores</button>
	        	<button className="button" onClick={() => this.newGame()}>New Game</button>
	      	</div>
    	);
  	}
}
function checkWinCondition(cells) {
	const winConditions = [
      	[0,1,2],
  		[3,4,5],
  		[6,7,8],
  		[0,3,6],
		[1,4,7],
 		[2,5,8],
  		[0,4,8],
  		[2,4,6],
  	];
  	for (let i=0; i<winConditions.length; i++) {
  		const [x,y,z] = winConditions[i];
  		if (cells[x] && cells[x] === cells[y] && cells[x] === cells[z]) {
        	return [winConditions[i], cells[x]];
  		}
  	}
  	return null;
}
class Play extends React.Component {
  constructor(props) {
    super(props);
    sessionStorage.setItem("X", 0);
    sessionStorage.setItem("O", 0);
  }
  render() {
    return (
      <div className="play">
        <div className="play-field">
          <Playfield />
        </div>
        <div className="info">
          <div>{/* status */}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Play />,
  document.getElementById('root')
);