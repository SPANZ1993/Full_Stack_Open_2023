import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({searchQuery, onChange}) => 
  <form>
    <div>
      filter shown with: <input value={searchQuery} onChange={onChange}/>
    </div>
  </form>


const PersonForm = ({newName, newNumber, onSubmit, handleNameChange, handleNumberChange}) => 
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>


const Persons = ({persons, searchQuery}) =>
  persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(person => <li key={person.name}>{person.name} {person.number}</li>)




const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')


  const onAddButtonClick = (event) => {
    event.preventDefault()
    if (persons.map(person => person.name).includes(newName)){
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }


  const handleInputChange = (setFunc) => (event) => {
    setFunc(event.target.value)
  }

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])




  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} onChange={handleQueryChange}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} 
        newNumber={newNumber} 
        onSubmit={onAddButtonClick} 
        handleNameChange={handleInputChange(setNewName)}
        handleNumberChange={handleInputChange(setNewNumber)}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} searchQuery={searchQuery}/>
    </div>
  )
}

export default App