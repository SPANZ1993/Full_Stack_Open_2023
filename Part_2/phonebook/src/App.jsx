import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ( { searchQuery, onChange } ) =>
  <form>
    <div>
      filter shown with: <input value={searchQuery} onChange={onChange}/>
    </div>
  </form>


const PersonForm = ( { newName, newNumber, onSubmit, handleNameChange, handleNumberChange } ) =>
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


const Persons = ( { persons, searchQuery, onDeleteButtonClick } ) => {
  return persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(person => <li key={person.name}>{person.name} {person.number} <button onClick={onDeleteButtonClick(person.id)}>delete</button></li>)
}



const Notification = ( { message, success } ) => {

  const notificationStyle = {
    color: success ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(true)
  const notificationTimeout = 2000


  const displayNotification = (message, success) => {
    setNotificationSuccess(success)
    setNotificationMessage(
      message
    )
    setTimeout(() => {
      setNotificationMessage(null)
    }, notificationTimeout)
  }


  const onAddButtonClick = (event) => {
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)){
      if (persons.find(person => person.name===newName && person.number===newNumber)!==undefined){
        displayNotification(`${newName} is already added to phonebook.`, true)
      }
      else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService
          .update(persons.find(person => person.name===newName).id, nameObject)
          .then( returnedPerson => {
            setPersons(persons.map(person => person.id!==returnedPerson.id ? person : { ...person, number: newNumber } ))
            setNewName('')
            setNewNumber('')
            displayNotification(`Updated entry for ${newName}`, true)
          })
          .catch(error => {
            if (error instanceof TypeError){
              displayNotification(`Information of ${newName} has already been removed from server`)
            }
            else{
              displayNotification(error.response.data.error, false)
            }
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
          displayNotification(`Added ${returnedPerson.name}`, true)
        })
        .catch(error => displayNotification(error.response.data.error, false))
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
            .then( () =>
              setPersons(persons.filter(person => person.id !== personId))
            )
        }
      })
      .catch( () =>
        displayNotification(`Information of ${newName} has already been removed from server`)
      )
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
        setPersons(persons))
  }, [])




  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} success={notificationSuccess}/>
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