const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
    return (
      <div className='sucessful'>
        {message}
      </div>
    )
}

export default Notification;