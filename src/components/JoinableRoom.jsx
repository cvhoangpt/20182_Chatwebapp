import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const JoinableRoom = (props) => {

    return (
        <div>
            <Modal isOpen={props.roomModalVisible} toggle={props.toggle}>
                <ModalHeader>
                   
                </ModalHeader>
                <ModalBody style={{ textAlign: 'left' }}>
                    {props.rooms.map((room)=>{
                        return (
                            <li key={room.key}>
                                <a href={'/chat/'+room.key}># {room.title}</a>
                            </li>
                        )
                    })}
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Modal>
        </div>
    );
}

export default JoinableRoom;