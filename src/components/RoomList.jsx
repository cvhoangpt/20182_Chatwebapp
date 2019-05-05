import React from 'react';
import JoinableRoom from './JoinableRoom';
import {Button} from 'reactstrap';

const RoomList = (props) => {
    return (
        <div className="rooms-list">
            <ul>
                <h3>Your rooms:</h3>
                {props.joinedRooms.map((room) => {
                    const active = props.roomId === room.key ? "active" : "";
                    return (
                        <li key={room.key} className={'room '+ active}>
                            <a href={'/chat/'+room.key}># {room.title}</a>
                        </li>
                    )
                })}
            </ul>
            <button id="create-room-btn" onClick={props.toggle}>->View All Rooms</button>
            <button id="create-room-btn" onClick={props.out}>->Out Room</button>
            <JoinableRoom roomModalVisible={props.roomModalVisible} toggle={props.toggle} rooms={props.joinableRooms} />
        </div>
    );
};

export default RoomList;