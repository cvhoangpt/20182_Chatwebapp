import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

class MessageList extends React.Component {

  messagesEnd = React.createRef()

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  }
  
  componentDidMount() {
    this.scrollToBottom(false);
  }
  
  componentDidUpdate() {
    this.scrollToBottom({block: 'end', behavior: "smooth"});
  }
  
  render() {
    return (
      <div className='message-list'>
        {this.props.messages.map((message, index) => {
          return (
            <Message key={index} username={message.sender} text={message.content} />
          );
        })}
        <div ref={(div)=>{
          this.messagesEnd = div;
        }} />
      </div>
    )
  }
}

export default MessageList
