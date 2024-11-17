import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Proposal from '../../models/proposal';

const ProposalForm = (props) => {
  /*
   * Creating a state for each parameter of the proposal.
   * There are two possible cases: 
   * - if we are creating a new proposal, the form is initialized with the default values.
   * - if we are editing a proposal, the form is pre-filled with the previous values.
   */
  const { proposal } = props;
  const [title, setTitle] = useState(proposal ? proposal.title : '');
  const [budget, setValue] = useState(proposal ? proposal.budget : '');

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the proposal is saved (eventually modified) we return to the list of all proposals, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/';

  // This state is used to handle error messages
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const validationErrors = {};

    // Title validation: title should not be empty
    if (title.trim() === '') {
      validationErrors.title = 'Titolo non può essere vuoto!';
    }
    if(title.length > 100){
      validationErrors.title = 'Il titolo non può superare i 100 caratteri!';
    }

    // Rating validation: rating should be between 0 and 5
    if (budget <= 0) {
      validationErrors.rating = 'La proposta non può avere budget uguale a 0!';
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  // The form is not submitted. I.e., the proposal is not added.
    }

    setErrors([]);  // cleaning error array
    setTitle(title.trim());  // trim() is used for removing leading and ending whitespaces
    setValue(budget);

    const proposal = new Proposal(undefined, title, budget, undefined, undefined, undefined, undefined)
    if (props.proposal) {
      proposal.id = props.proposal.id;
    }

    props.onSubmit(proposal);

    navigate('/proposals');
  }

  return (
    <>
      <h2 className='text-center mt-4'>{props.proposal ?  "Modifica Proposta" : "Aggiungi Proposta"} </h2>
      <Form className='mt-4 mb-0 px-5 py-4 form-padding' onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label>Titolo</Form.Label>
          {/* If there is an error related to the tile, the Form.Control becomes red */}
          <Form.Control className={errors.title ? 'wrong-field' : ''} type='text' required={true} value={title} onChange={event => setTitle(event.target.value)} />
        </Form.Group>


        <Form.Group className='mb-3'>
          <Form.Label>Budget</Form.Label>
          {/* If there is an error related to the rating, the Form.Control becomes red */}
          <Form.Control className={errors.rating ? 'wrong-field' : ''} type="number" min={0} step={0.01} value={budget}
            onChange={event => setValue(event.target.value === '' ? 0 : parseInt(event.target.value))}
          // You can also use directly "event.target.value" even when it is an empty string but you will see a warning in console.
          />
        </Form.Group>

        {Object.keys(errors).length > 0 ?
          <div id="errors" className='pt-1 pb-2'>
            { /* errors.map((error, index) => (<p  key={index}>{error}</p>)) } */
              Object.keys(errors).map((err, index) => (<p className='error-message' key={index}><b>{"Error " + (index + 1) + ": "}</b>{errors[err]}</p>))}
          </div>
          : ""
        }

        {props.proposal ? <Button className='my-3' variant='success' type='submit'>Aggiorna</Button>
          : <Button className='my-3' variant='primary' type='submit'>Aggiungi</Button>
        }
        <Link className='btn btn-danger mx-2 my-3' to={nextpage}>Cancella</Link>
      </Form>
    </>
  )

}

ProposalForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  proposal: PropTypes.object
};

export default ProposalForm;