import styles from './AddPollsForm.module.css';
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const AddPollsForm = (props: any) => {
  const {inputFields, setInputFields, question, setQuestion } = props;
  // const [inputFields, setInputFields] = useState([
  //   { id: Math.random(), option: '' },
  // ]);
  // const [question, setQuestion] = useState("")

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
    <div className={styles.formWrap}>
      {/* <h1>Add New Poll</h1> */}
      <form className={styles.AddPollsForm}>
          <TextField
              name="question"
              label="Ask a question"
              variant="filled"
              value={question}
              fullWidth
              className={styles.question}
              onChange={handleQuestionChange}
            />
        {inputFields.map((inputField: { id: number; option: string; }) => (
          <div key={inputField.id}>
            <TextField
              name="option"
              label="Option"
              variant="filled"
              value={inputField.option}
              fullWidth
              onChange={(event: any) => handleChangeInput(inputField.id, event)}
            />
            <div>
              <IconButton disabled={inputFields.length < 3} onClick={() => handleRemoveFields(inputField.id)}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={handleAddFields}>
                <AddIcon />
              </IconButton>
            </div>
          </div>
        ))}
        {/* <Button
          variant="contained"
          color="primary"
          type="submit"
          className={styles.topDownMargin}
          onClick={handleSubmit}
        >Send</Button> */}
      </form>
    </div>
  );
}


export default AddPollsForm;