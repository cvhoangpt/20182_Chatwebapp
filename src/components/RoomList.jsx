import React from 'react';

const RoomList = (props) => {
    return (
        <div className="rooms-list">
            <ul>
                <h3>Your rooms:</h3>
                {props.rooms.map(room => {
                    const active = props.roomId === room.key ? "active" : "";
                    return (
                        <li key={room.key} className={'room '+ active}>
                            <a onClick={()=>{props.subscribeToRoom(room.key)}} href="#"># {room.title}</a>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};

export default RoomList;