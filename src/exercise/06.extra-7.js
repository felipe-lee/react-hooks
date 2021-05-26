// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

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
  const [state, setState] = React.useState({
    error: null,
    pokemon: null,
    status: pokemonName ? PENDING : IDLE,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: PENDING, pokemon: null, error: null})

    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({status: RESOLVED, pokemon, error: null})
      })
      .catch(error => {
        setState({status: REJECTED, pokemon: null, error})
      })
  }, [pokemonName])

  switch (state.status) {
    case IDLE: {
      return 'Submit a pokemon'
    }
    case PENDING: {
      return <PokemonInfoFallback name={pokemonName} />
    }
    case RESOLVED: {
      return <PokemonDataView pokemon={state.pokemon} />
    }
    case REJECTED: {
      throw state.error
    }
    default: {
      throw new Error(`Unhandled status: ${state.status}`)
    }
  }
}

const PokemonFallbackComponent = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
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
        <ErrorBoundary
          FallbackComponent={PokemonFallbackComponent}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
