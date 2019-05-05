import React from 'react'

const SendMessageForm = (props) => {
    
    var message ='';
    
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                props.message.submit(message);
                document.getElementById('send-message-form').reset();
            }}
            className="send-message-form"
            id='send-message-form'>
            <input
                onChange={(event) => {message = event.target.value}}
                placeholder="Type your message and hit ENTER"
                type="text" />
        </form>
    );
}

export default SendMessageForm