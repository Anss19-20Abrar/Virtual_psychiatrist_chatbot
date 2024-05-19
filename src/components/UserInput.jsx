import  { useState } from 'react';

const UserInput = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(text);
    setText('');
  };

  return (
    <form className="user-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={handleChange}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default UserInput;
