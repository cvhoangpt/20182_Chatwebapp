import React from 'react';

const LoginForm = (props) => {
    return (
        <div class="login-page">
            <div class="form">
                <form class="login-form" onSubmit={(event)=>(event.preventDefault())}>
                    <input type="text" placeholder="username" required onChange={(event)=>{props.login.loginInfoChange({email:event.target.value})}}/>
                    <input type="password" placeholder="password" required onChange={(event)=>{props.login.loginInfoChange({password:event.target.value})}}/>
                    <button onClick={(props.login.submit)}>login</button>
                    <p class="message">Not registered? <a href="/register">Create an account</a></p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;