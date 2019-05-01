import React from 'react';
import Message from './Message';

const MessageList = (props) => {
    console.log(props.messages);
    return (
        <div className='message-list'>
            {props.messages.map((message, index) => {
                return (
                    <Message key={index} username={message.sender} text={message.content}/>
                );
            })}
        </div>
    );
};

export default MessageList;