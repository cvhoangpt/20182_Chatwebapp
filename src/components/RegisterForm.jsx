import React from 'react';

const RegisterForm = (props) => {
    return (
        <div className="login-page">
            <div className="form">
                <form className="register-form" onSubmit={(event) => (event.preventDefault())}>
                    <input type="text" placeholder="email address" required onChange={(event) => { props.register.registerInfoChange({ email: event.target.value }) }}  />
                    <input type="password" placeholder="password"  required onChange={(event) => { props.register.registerInfoChange({ password: event.target.value }) }} />
                    <button onClick={props.register.submit}>create</button>
                    <p className="message">Already registered? <a href="/login">Sign In</a></p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;