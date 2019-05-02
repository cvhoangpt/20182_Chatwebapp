import React from 'react';

const NewRoomForm = (props) => {
    var name = '';

    return (
        <div className="new-room-form">
            <form id='room-form' onSubmit={(event)=>{
                event.preventDefault();
                props.createRoom(name);
                document.getElementById('room-form').reset();
                }}>
                <input
                    type="text" 
                    placeholder="NewRoomForm"
                    onChange={(event)=>{name = event.target.value}} 
                    required />
                <button id="create-room-btn" type="submit">+</button>
        </form>
    </div>
    );
};

export default NewRoomForm;