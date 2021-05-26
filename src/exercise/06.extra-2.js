// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function PokemonInfo({pokemonName}) {
  const [status, setStatus] = React.useState(IDLE)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setStatus(PENDING)
    setPokemon(null)
    setError(null)

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setPokemon(pokemonData)
        setStatus(RESOLVED)
      })
      .catch(error => {
        setError(error)
        setStatus(REJECTED)
      })
  }, [pokemonName])

  switch (status) {
    case IDLE: {
      return 'Submit a pokemon'
    }
    case PENDING: {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case RESOLVED: {
      return <PokemonDataView pokemon={pokemon} />
    }
    case REJECTED: {
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    }
    default: {
      throw new Error(`Unhandled status: ${status}`)
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
