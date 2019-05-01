import React, {
  Component
} from 'react';
import './App.css';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';
import firebase from 'firebase';

class App extends Component {

  state = {
    roomId: -1,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
  }

  componentDidMount = async () => {
    var config = {
      apiKey: "AIzaSyApKodtIX6sNEz6tgmjO6J4rypt9H36WPU",
      authDomain: "chat-app-53b68.firebaseapp.com",
      databaseURL: "https://chat-app-53b68.firebaseio.com",
      projectId: "chat-app-53b68",
      storageBucket: "chat-app-53b68.appspot.com",
      messagingSenderId: "657681456719"
    };
    firebase.initializeApp(config);

    this.getRooms();
  }

  createRoom = async (roomName) => {
    try {
      await firebase.database().ref('rooms/').off();
      await firebase.database().ref('rooms/').push({
        title: roomName,
      });
      this.getRooms();
    } catch (error) {
      console.log(error);
    }
  }

  getRooms = async () => {
    try {
      this.setState({
        joinableRooms: [],
      });
      await firebase.database().ref('rooms/').off();
      await firebase.database().ref('rooms/').orderByChild('createdAt').once('value').then((rooms) => {
        if (rooms) {
          rooms.forEach((room) => {
            const newRoom = {
              title: room.val().title,
              key: room.key,
              createdAt: firebase.database.ServerValue.TIMESTAMP,
            };
            this.setState({
              joinableRooms: [...this.state.joinableRooms, newRoom],
            });
          });
        }
        const defaultRoomId = this.state.joinableRooms[0].key;
        this.subscribeToRoom(defaultRoomId);
      });
    } catch (error) {
      console.log(error);
    }
  }

  subscribeToRoom = async (roomId) => {
    try {
      this.setState({
        roomId: roomId,
        messages: [],
      });

      this.listenToMessages();
    } catch (error) {
      console.log(error)
    }
  }

  listenToMessages = async () => {
    try {
      await firebase.database().ref('messages/').off();
      await firebase.database().ref('messages/' + this.state.roomId).orderByChild('createdAt').on('child_added', (message) => {
        this.setState({
          messages: [...this.state.messages, message.val()],
        });
      })
    } catch (error) {
      console.log(error);
    }
  }

  submitMessage = async (newMessage) => {
    try {
      await firebase.database().ref('messages/').off();
      if (newMessage) {
        await firebase.database().ref('messages/' + this.state.roomId).push({
          sender: 'gadfly666',
          content: newMessage,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="app">
        <RoomList
          roomId={this.state.roomId}
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms]} />
        <MessageList messages={this.state.messages} />
        <SendMessageForm message={{ submit: this.submitMessage, }} />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}
export default App;