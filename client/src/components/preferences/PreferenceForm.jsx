import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Preference from '../../models/preference';



const PreferenceForm = (props) => {
  /*
   * Creating a state for each parameter of the preference.
   * There are two possible cases: 
   * - if we are creating a new preference, the form is initialized with the default values.
   * - if we are editing a preference, the form is pre-filled with the previous values.
   */

  const [value, setValue] = useState(props.preference ? props.preference.value : '');
  const [proposalID, setProposalID] = useState(props.preference ? props.preference.proposalID : '');

  // useNavigate hook is necessary to change page
  const navigate = useNavigate();
  const location = useLocation();

  // if the preference is saved (eventually modified) we return to the list of all preferences, 
  // otherwise, if cancel is pressed, we go back to the previous location (given by the location state)
  const nextpage = location.state?.nextpage || '/preferences';

  // This state is used to handle error messages
  const [errors, setErrors] = useState([]);


  const validateForm = () => {
    const validationErrors = {};

    // Title validation: title should not be empty
    if (!proposalID) {
      validationErrors.proposalID = 'Selezionare una proposta!';
    }

    // Rating validation: rating should be between 1 and 3
    if (value < 1 || value > 3) {
      validationErrors.value = 'La valutazione deve essere compresa tra 1 e 3!';
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  // The form is not submitted. I.e., the preference is not added.
    }

    setErrors([]);  // cleaning error array
    setValue(value);
    setProposalID(proposalID);
    const preference = new Preference(undefined, value, proposalID);
    if (props.preference) {
      preference.id = props.preference.id;
    }

    props.onSubmit(preference);
    // To be sure that the user can see the added preference, we navigate to the root.
    navigate('/preferences');
  }

  return (
    <Container >
      <Form className='mt-4 mb-0 px-5 py-4 form-padding' onSubmit={handleSubmit}>

        {/* If there is an error related to the title, the Form.Control becomes red */}
        
        {!props.preference ? <h2 className='mb-4'>{props.preference ? 'Modifica preferenza' : 'Aggiungi preferenza'}</h2> : <h2 className='mb-4'>Modifica preferenza</h2>} 
        {!props.preference ?
          <Form.Group className='mb-3'><Form.Label>Proposta</Form.Label>
            <Form.Select className={errors.title ? 'wrong-field' : ''} value={proposalID} onChange={event => setProposalID(event.target.value)} >
              <option value=''>Seleziona una proposta</option>
              {props.proposals.map((proposal, index) => <option key={index} value={proposal.id}>{proposal.title} - Budget {proposal.budget}</option>)}
            </Form.Select> </Form.Group> : <div>Proposta selezionata: <b>{props.preference.proposal.title}</b></div>}



        <Form.Group className='mb-3'>
          <Form.Label>Valutazione</Form.Label>
          {/* If there is an error related to the rating, the Form.Control becomes red */}
          <Form.Control className={errors.rating ? 'wrong-field' : ''} type="number" min={1} max={3} step={1} value={value}
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

        {props.preference ? <Button className='my-3' variant='success' type='submit'>Aggiorna</Button>
          : <Button className='my-3' variant='primary' type='submit'>Aggiungi</Button>
        }
        <Link className='btn btn-danger mx-2 my-3' to={nextpage}>Annulla</Link>
      </Form>
    </Container>
  )

}

PreferenceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  preference: PropTypes.object,
  proposals: PropTypes.array
};

export default PreferenceForm;