import React from 'react';
import {EmojiConvertor} from 'emoji-js';
import ReactDOM from 'react-dom';

// authority HieuNa
const Message = (props) => { 

    const emoji = new EmojiConvertor();

    emoji.img_sets.google.path = 'https://res.cloudinary.com/dswwcaqwu/image/upload/v1555303638/emoji-data/img-google-64';
    emoji.img_sets.google.sheet = 'https://res.cloudinary.com/dswwcaqwu/image/upload/v1555303638/emoji-data/sheet_google_64.png';

    emoji.use_sheet = true;

    emoji.img_set = 'google';

    return (
        <div className="message">
            <div className="message-username">{props.username}</div>
            <div className="message-text" dangerouslySetInnerHTML={{__html: emoji.replace_emoticons(props.text)}}></div>
        </div>
    )
}

export default Message