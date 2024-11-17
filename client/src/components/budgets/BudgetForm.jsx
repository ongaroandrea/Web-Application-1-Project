import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Budget from '../../models/budget';

export default function CreateBudgetForm(props) {

  const [value, setValue] = useState(0);

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the budget is saved (eventually modified) we return to the list of all budgets, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  // This state is used to handle error messages
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const validationErrors = {};
    
    // Rating validation: rating should be bigger than 0
    if (value <= 0 ) {
      validationErrors.value='Il budget deve essere maggiore di 0!';
    }
  
    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  // The form is not submitted. I.e., the budget is not added.
    }

    setErrors([]);  // cleaning error array
    setValue(value);
    const budget = new Budget(undefined, undefined, value, 0, undefined, undefined);

    props.onSubmit(budget);
    // To be sure that the user can see the added budget, we navigate to the root.
    navigate('/');
  }

  
  return (
    <Form className='mt-4 mb-0 px-5 py-4 form-padding custom-border'  onSubmit={handleSubmit}>
      <h2 className='text-center'>Aggiungi un nuovo budget</h2>
      <Form.Group className='mb-3'>
        <Form.Label>Valore</Form.Label>
        {/* If there is an error related to the rating, the Form.Control becomes red */}
        <Form.Control className={errors.rating ? 'wrong-field' : ''} type="number" min={1} value={value}
          onChange={event => setValue(event.target.value === '' ? 0 : parseInt(event.target.value))}
        />
      </Form.Group>

      { Object.keys(errors).length > 0 ?
        <div id="errors" className='pt-1 pb-2'>
          { /* errors.map((error, index) => (<p  key={index}>{error}</p>)) } */
          Object.keys(errors).map((err, index) => ( <p className='error-message' key={index}><b>{"Error "+(index+1)+": "}</b>{errors[err]}</p> )) }
        </div>
        : ""
      }

      <Button className='my-3 button-create' type='submit'>Crea il budget</Button>
      <Link className='btn btn-danger mx-2 my-3' to={nextpage}>Annulla</Link>
    </Form>
  )

}

CreateBudgetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  budget: PropTypes.object
};

