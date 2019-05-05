import React, {
  Component
} from 'react';
import './App.css';
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import firebase from 'firebase';
import { Route, Switch } from 'react-router-dom';


class App extends Component {

  state = {
    roomId: -1,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    loginInfo: {
      email: '',
      password: '',
    },
    roomModalVisible: false,
  }

  toggleRoom = () => {
    console.log(this.state.roomModalVisible);
    this.setState({
      roomModalVisible: !this.state.roomModalVisible,
    });
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

    const userId = window.sessionStorage.getItem('userId');

    console.log(window.location.pathname != '/');

    if ((!userId)) {
      if (window.location.pathname !== '/' && window.location.pathname !== '/register') {
        window.location.replace('/');
      }
    } else {

      const roomId = window.location.pathname.split('/')[2];

      if (roomId) {
        this.setState({
          roomId: roomId,
        });
      }

      await this.getJoinedRoom();
      await this.getJoinableRooms();

      const inJoinedRoom = this.state.joinedRooms.find((room) => room.key == roomId);
      const inJoinableRoom = this.state.joinableRooms.find((room) => room.key == roomId);

      if(!inJoinedRoom){
        if(inJoinableRoom){
          this.setState({
            joinedRooms: [...this.state.joinedRooms, inJoinableRoom],
          });
          await firebase.database().ref('userRooms/' + userId).set({
            rooms: [...this.state.joinedRooms],
          });
        }
      }

      firebase.database().ref('messages/' + this.state.roomId).orderByChild('createdAt').on('child_added', (message) => {
        if (message) {
          this.setState({
            messages: [...this.state.messages, message.val()],
          });
        }
      });
    }
  }

  handleScroll = () => {
    console.log('scrolling');
  }

  loginInfoChange = (newLoginInfo) => {
    this.setState({
      loginInfo: {
        ... this.state.loginInfo,
        ...newLoginInfo,
      }
    });
  }

  loginSubmit = async () => {
    try {
      if (this.state.loginInfo.email && this.state.loginInfo.password) {
        await firebase.auth().signInWithEmailAndPassword(this.state.loginInfo.email, this.state.loginInfo.password)
          .then((user) => {
            window.sessionStorage.setItem('userId', user.user.uid);
            window.sessionStorage.setItem('email', user.user.email);
            window.location.replace('/chat');
          })
          .catch(function (error) {
            window.alert(error.message);
          });
      }

    } catch (error) {
      window.alert(error.message);
    }
  }

  registerSubmit = async () => {
    try {
      if (this.state.loginInfo.email && this.state.loginInfo.password) {
        await firebase.auth().createUserWithEmailAndPassword(this.state.loginInfo.email, this.state.loginInfo.password)
          .then(() => window.location.replace('/'))
          .catch((error) => {
            window.alert(error.message);
          });
      }
    } catch (error) {
      window.alert(error.message);
    }
  }

  getJoinedRoom = async () => {
    try {
      const userId = window.sessionStorage.getItem('userId');
      if (userId) {
        this.setState({
          joinedRooms: [],
        });
        await firebase.database().ref('userRooms/' + userId).orderByChild('createdAt').once('value').then((value) => {
          this.setState({
            joinedRooms: value.val().rooms,
          });
        });
        if (this.state.joinedRooms.length > 0) {
          const defaultRoomId = this.state.joinedRooms[0].key;
          if (this.state.roomId == -1 && window.location.pathname !== '/chat/' + defaultRoomId) {
            window.location.replace('/chat/' + defaultRoomId);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  createRoom = async (roomName) => {
    try {
      const userId = window.sessionStorage.getItem('userId');
      if (userId) {
        let roomKey = '';
        const createdAt= await firebase.database.ServerValue.TIMESTAMP;
        await firebase.database().ref('rooms/').push({
          title: roomName,
          createdAt: createdAt,
          lastMessage: null,
        }).then((room) => roomKey = room.key);
        const newUserRoom = {
          title: roomName,
          createdAt: createdAt,
          key: roomKey,
        }
        await firebase.database().ref('userRooms/' + userId).set({
          rooms: [...this.state.joinedRooms, newUserRoom],
        });
        this.getJoinedRoom();
        this.getJoinableRooms();
      }
    } catch (error) {
      console.log(error);
    }
  }

  getJoinableRooms = async () => {
    try {
      const email = window.sessionStorage.getItem('email');
      if (email) {
        this.setState({
          joinableRooms: [],
        });
        await firebase.database().ref('rooms/').orderByChild('createdAt').once('value').then((rooms) => {
          if (rooms) {
            rooms.forEach((room) => {
              const newRoom = {
                title: room.val().title,
                key: room.key,
                createdAt: room.val().createdAt,
              };
              this.setState({
                joinableRooms: [...this.state.joinableRooms, newRoom],
              });
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  submitMessage = async (newMessage) => {
    try {
      if (this.state.roomId !== -1) {
        const email = window.sessionStorage.getItem('email');
        if (newMessage) {
          await firebase.database().ref('messages/' + this.state.roomId).push({
            sender: email,
            content: newMessage,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  outRoom = async () => {
    const userId = window.sessionStorage.getItem('userId');
    const removedJoinedRoom = this.state.joinedRooms.filter((room)=>{return room.key !== this.state.roomId});
    await firebase.database().ref('userRooms/' + userId).set({
      rooms: [...removedJoinedRoom],
    });
    await this.getJoinedRoom();
    if(this.state.joinedRooms.length > 0){
      window.location.replace('/chat/'+this.state.joinedRooms[0].key);
    }else{
      window.location.replace('/chat');
    }
  }

  render() {

    return (
      <Switch>
        <Route exact path='/' render={(props) => <LoginForm {...props} login={
          {
            loginInfoChange: this.loginInfoChange,
            submit: this.loginSubmit,
          }
        } />} />
        <Route path="/register" render={(props) => <RegisterForm {...props} register={
          {
            registerInfoChange: this.loginInfoChange,
            submit: this.registerSubmit,
          }
        } />} />
        <Route path='/chat' component={() => <div className="app">
          <RoomList
            roomId={this.state.roomId}
            joinedRooms={[...this.state.joinedRooms]}
            joinableRooms={[...this.state.joinableRooms]}
            roomModalVisible={this.state.roomModalVisible}
            toggle = {this.toggleRoom}
            out={this.outRoom} />
          <MessageList messages={this.state.messages} />
          <SendMessageForm message={{ submit: this.submitMessage, }} />
          <NewRoomForm createRoom={this.createRoom} />
        </div>} />
      </Switch>
    );
  }
}
export default App;