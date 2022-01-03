import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';



const CreateForm = () => {
  const [inputFields, setInputFields] = useState([
    { id: Math.random(), option: '' },
  ]);
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const result = {'question': question, 'answers': inputFields} 
    const params = {
      method: 'POST',
      body: JSON.stringify(result)
    }
    
    fetch("http://localhost:5000/add_poll", params)

  };

  const handleChangeInput = (id: number, event: any) => {
    const newInputFields = inputFields.map((i: any) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })

    setInputFields(newInputFields);
  }

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: Math.random(), option: '' }])
  }

  const handleRemoveFields = (id: any) => {
    const values = [...inputFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputFields(values);
  }

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  return (
    <Container>
      <h1>Add New Member</h1>
      <form onSubmit={handleSubmit}>
          <TextField
              name="question"
              label="Question"
              variant="outlined"
              value={question}
              onChange={handleQuestionChange}
            />
        {inputFields.map((inputField: { id: number; option: string; }) => (
          <div key={inputField.id}>
            <TextField
              name="option"
              label="Option"
              variant="filled"
              value={inputField.option}
              onChange={(event: any) => handleChangeInput(inputField.id, event)}
            />
            <IconButton disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
              <RemoveIcon />
            </IconButton>
            <IconButton
              onClick={handleAddFields}
            >
              <AddIcon />
            </IconButton>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
        >Send</Button>
      </form>
    </Container>
  );
}


export default CreateForm;
