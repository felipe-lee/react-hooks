// useState: tic tac toe
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/04-classes.js

import * as React from 'react'

import {useLocalStorageState} from '../utils'

const initialSquares = Array(9).fill(null)

const Board = () => {
  const [squares, setSquares] = useLocalStorageState('squares', initialSquares)

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  let status = calculateStatus(winner, squares, nextValue)

  const selectSquare = squareIndex => {
    if (calculateWinner(squares) || squares[squareIndex]) {
      return
    }

    const squaresCopy = [...squares]

    squaresCopy[squareIndex] = nextValue

    setSquares(squaresCopy)
  }

  const renderSquare = squareIndex => {
    return (
      <button className="square" onClick={() => selectSquare(squareIndex)}>
        {squares[squareIndex]}
      </button>
    )
  }

  const restart = () => {
    setSquares(initialSquares)
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
