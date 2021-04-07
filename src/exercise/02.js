// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }

    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [person, setPerson] = useLocalStorageState('person', {
    name: initialName,
  })

  function handleChange(event) {
    console.log(event)
    const updatedPerson = {...person, [event.target.id]: event.target.value}

    setPerson(updatedPerson)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={person.name} onChange={handleChange} id="name" />
        <br />
        <label htmlFor="email">Email: </label>
        <input value={person.email} onChange={handleChange} id="email" />
      </form>
      {person.name ? (
        <strong>Hello {person.name}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  )
}

function App() {
  return <Greeting initialName={'Gandalf'} />
}

export default App
