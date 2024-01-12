import { useState, useEffect } from 'react'
import personService from './services/persons'

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


const Persons = ({persons, searchQuery, onDeleteButtonClick}) => {
  return persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(person => <li key={person.name}>{person.name} {person.number} <button onClick={onDeleteButtonClick(person.id)}>delete</button></li>)
}



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')


  const onAddButtonClick = (event) => {
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)){
      if (persons.find(person => person.name===newName && person.number===newNumber)!==undefined){
        window.alert(`${newName} is already added to phonebook`)
      }
      else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService
          .update(persons.find(person => person.name===newName).id, nameObject)
          .then( returnedPerson => {
            setPersons(persons.map(person => person.id!==returnedPerson.id ? person : {...person, number: newNumber}))
            setNewName('')
            setNewNumber('')
          })
      }
    }
    else {
      personService
        .create(nameObject)
        .then( returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  
  const onDeleteButtonClick = (personId) => (event) => {
    event.preventDefault()
    personService
      .get(personId)
      .then(person => {
        if(window.confirm(`Delete ${person.name}?`)){
          personService
          .remove(personId)
          .then(person =>
            setPersons(persons.filter(person => person.id != personId))
            )
        }
      })
  }


  const handleInputChange = (setFunc) => (event) => {
    setFunc(event.target.value)
  }

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }


  useEffect(() => {
    personService
      .getAll()
      .then(persons => 
        setPersons(persons)
    )   
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
      <Persons persons={persons} 
        searchQuery={searchQuery} 
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </div>
  )
}

export default App