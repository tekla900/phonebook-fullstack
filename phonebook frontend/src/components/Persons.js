const Persons = ({ personsToShow, handleDelete }) => {
    return (
        <ul>
        {personsToShow.map(each => 
          <li key={each.name}>
            {each.name} {each.number}
            <button onClick={handleDelete} value={each.id}>
              delete
            </button>
          </li>
        )}
      </ul>
    )
}

export default Persons