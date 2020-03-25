import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';

const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    email: yup.string().email('Must be a valid email address').required('Email is a required field'),
    password: yup.string().required('Password is a required field'),
    terms: yup.boolean().oneOf([true], 'Please agree to Terms and Conditions')
})

function Form() {
    const [formState, setFormState] = useState({
        name:'',
        email:'',
        password:'',
        terms:''
    })

    const [errors, setErrors] = useState({
        name:'',
        email:'',
        password:'',
        terms:''        
    })

    const [buttonDisabled, setButtonDisabled] = useState(true)

    useEffect(() => {
        formSchema.isValid(formState).then(valid => {
            setButtonDisabled(!valid)
        })
    }, [formState])

    const inputChange = e => {
        e.persist()
        const newFormData =  {
            ...formState,
            [e.target.name] : e.target.type === 'checkbox' ? e.target.checked : e.target.value
        }
        validateChange(e)
        setFormState(newFormData)
    }

    const [post, setPost] = useState([])

    const formSubmit = e => {
        e.preventDefault()
        axios
        .post('https://reqres.in/api/users', formState)
        .then(res => {
            setPost(res.data)
            console.log('success', post)
            setFormState({
                name:'',
                email:'',
                password:'',
                terms:''
            })
        })
        .catch(error => console.log(error.response))
    }

    const validateChange = e => {
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
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
        <form onSubmit={formSubmit}>
            <label htmlFor='name'>Name:
                <input 
                name='name' 
                type='text' 
                value={formState.name}
                onChange={inputChange}/>
                {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
            </label>
            <br/>
            <label htmlFor='email'>Email:
                <input 
                name='email' 
                type='text' 
                value={formState.email}
                onChange={inputChange}/>
                {errors.email.length > 0 ? <p className="error">{errors.email}</p> : null}
            </label>
            <br/>
            <label htmlFor='password'>Password:
                <input 
                name='password' 
                type='text' 
                value={formState.password}
                onChange={inputChange}/>
                {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
            </label>
            <br/>
            <label htmlFor='terms' className='terms'>
                <input 
                type='checkbox' 
                name='terms' 
                checked={formState.terms}
                onChange={inputChange}/>
                Terms and Conditions
            </label>
            <br/>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
        </>
    )
}

export default Form