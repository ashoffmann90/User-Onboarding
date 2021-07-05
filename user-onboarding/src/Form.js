import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';

// Step 3: validation schema
const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    email: yup.string().email('Must be a valid email address').required('Email is a required field'),
    password: yup.string().required('Password is a required field'),
    terms: yup.boolean().oneOf([true], 'Please agree to Terms and Conditions')
})

function Form() {
    // Step 2: Create State for the form
    // managing state for our form inputs
    const [formState, setFormState] = useState({
        name:'',
        email:'',
        password:'',
        terms:''
    })

    // state for our errors
    const [errors, setErrors] = useState({
        name:'',
        email:'',
        password:'',
        terms:''        
    })

    // Step 4a: setup button state
    // state for whether our button should be disabled or not.
    const [buttonDisabled, setButtonDisabled] = useState(true)

    // Step 5: useEffect for button
    /* Each time the form value state is updated, check to see if it is valid per our schema. This will allow us to enable/disable the submit button.*/
    useEffect(() => {
        /* We pass the entire state into the entire schema, no need to use reach here. We want to make sure it is all valid before we allow a user to submit isValid comes from Yup directly */
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid)
        })
    }, [formState])

    // Step 6: Set up an event handler called `inputChange`
    const inputChange = e => {
        /* e.persist allows us to use the synthetic event in an async manner.
    We need to be able to use it after the form validation */
        e.persist()
        const newFormData =  {
            ...formState,
            [e.target.name] : e.target.type === 'checkbox' ? e.target.checked : e.target.value
        }
        validateChange(e)
        setFormState(newFormData)
    }

    // Step 11: IMPORT AXIOS and make POST requests to pass data collected from a form to a database
    // Step 11a: set up state for our data that will be posted so we can later display it. 
    // new state to set our post request too. So we can console.log and see it.
    const [post, setPost] = useState([])

    // Step 11b: set up a axios call inside a formSubmit function we will pass to our form.
    const formSubmit = e => {
        e.preventDefault()
        axios
        .post('https://reqres.in/api/users', formState)
        .then(res => {
            setPost(res.data) // get just the form data from the REST api
            console.log('success', post)
            // reset form if successful
            setFormState({
                name:'',
                email:'',
                password:'',
                terms:''
            })
        })
        .catch(error => console.log(error.response))
    }

    // Step 9: Setting up final validation
    const validateChange = e => {
        yup
        // Reach will allow us to "reach" into the schema and test only one part.
        .reach(formSchema, e.target.name)
        .validate(e.target.name === "terms" ? e.target.checked : e.target.value)
        .then(valid => {
            setErrors({
                ...errors,[e.target.name]: ''
            })
        })
        .catch(error => {
            setErrors({
                ...errors, [e.target.name]: error.errors[0]
            })
        })
    }
   

    return (
        <>
        {/* 
        Step 1: Create form structure,
                label htmlFor
                input name, type, value, onChange
        */}
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>Name:
                <input 
                name='name' 
                type='text' 
                //Step 8: We can also set up the value and onChange for each of our inputs now.
                value={formState.name}
                onChange={inputChange}/>
                {/* Step 10: And adding validation to our inputs with conditional rendering */}
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>
            <br/>
            <label htmlFor='email'>Email:
                <input 
                name='email' 
                type='text' 
                //Step 8: We can also set up the value and onChange for each of our inputs now.
                value={formState.email}
                onChange={inputChange}/>
                {/* Step 10: And adding validation to our inputs with conditional rendering */}
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <br/>
            <label htmlFor='password'>Password:
                <input 
                id='password'
                name='password' 
                type='text' 
                //Step 8: We can also set up the value and onChange for each of our inputs now.
                value={formState.password}
                onChange={inputChange}/>
                {/* Step 10: And adding validation to our inputs with conditional rendering */}
                {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>
            <br/>
            <label htmlFor='terms' className='terms'>
                <input 
                type='checkbox' 
                name='terms' 
                //Step 8: We can also set up the value and onChange for each of our inputs now.
                checked={formState.terms}
                onChange={inputChange}/>
                Terms and Conditions
                {errors.terms.length > 0 ? <p className="error">{errors.terms}</p> : null}
            </label>
            <br/>
            {/* Step 11c: Display Data. For our purposes, we’ll just display data to the DOM, instead of doing something with it on a server. For that we will use JSON.stringify to display our data in both the DOM and the console. */}
            <pre>{JSON.stringify(post, null, 2)}</pre>
            {/* Step 4b: add button things */}
            <button data-cy='submit' disabled={buttonDisabled}>Submit</button>
        </form>
        </>
    )
}

export default Form