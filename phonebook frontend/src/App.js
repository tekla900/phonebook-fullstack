import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';
import Error from './components/Error';
import Filter from './components/Filter';
import phonebook from './services/phonebook';
import './index.css';



const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newSearch, setNewSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebook
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, []);

  const addPerson = (event) => {
    event.preventDefault()

    const found = persons.find(element => element.name.toLowerCase() === newName.toLowerCase());
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (found) {
      const confirmed = window.confirm(`${newName} is already added to phonebook,
      replace the old number with the new one? `);
      if(confirmed) {
        const id = persons.filter(each => each.name == newName)[0].id;
        const person = persons.find(p => p.id === id);
        const changedPerson = {...person, number: newNumber};

        phonebook
        .update(id, changedPerson).then(returnedPerson => {
          setPersons(persons.map(each => each.id !== id ? each : returnedPerson));
          setMessage(`Changed number for ${newName}`);
          setTimeout(() => {
            setMessage(null)
          }, 3000);
        })
        .catch(error => {
          setErrorMessage(
            `Note '${newName}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 30000)
          setPersons(persons.filter(n => n.id !== id))
        })
      }
    }
    else {
      phonebook
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setMessage(`Added ${newName}`);
          setTimeout(() => {
            setErrorMessage(null)
          }, 1000);
        })
        .catch(error => {
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 30000)
        })
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value);
  }

  const handleDelete = event => {
    const id = event.target.value;
    const name = persons.filter(each => each.id == id)[0].name;
    if (window.confirm(`Delete ${name} ?`)) {
      phonebook
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(each => each.id != id));
        })
    }
  }
    

  const personsToShow = persons.filter(each => {
    if (each.name.toLowerCase().includes(newSearch.toLowerCase())) {
      return each;
    }
  });

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <Error message={errorMessage} />
      <Filter newSearch={newSearch} handleSearch={handleSearch} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson}
                  newName={newName} 
                  newNumber={newNumber}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNumberChange}
                  />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App