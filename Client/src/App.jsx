import { useState } from "react";
import io from "socket.io-client";
import Chat from "./chat";
import music from "./mixkit-tile-game-reveal-960.wav"

const socket = io.connect("http://localhost:3000");

function App() {

  const [userName, setUserName] = useState(""); // State to hold user's name
  const [room, setRoom] = useState(""); // State to hold room number/name
  const [isChatVisible, setIsChatVisible] = useState(false); // State to control the visibility of the Chat component

  const notification = new Audio(music); 

  const joinChat = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room); // Emit event to the server to join the room
      setIsChatVisible(true); // Show the Chat component once the user joins
      notification.play();      //audio
    } else {
      alert("Please enter both a username and a room number to join."); // Show an alert if either field is missing
    }
  };

  return (
    <>
      {!isChatVisible ? (
        <>
          <h2>JOIN CHAT</h2>
          <div className="join_room">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} // Update state with input value
            />
            <input
              type="text"
              placeholder="Enter Chat room"
              value={room}
              onChange={(e) => setRoom(e.target.value)} // Update state with input value
            />
            <button onClick={joinChat}>Join</button>
          </div>
        </>
      ) : (
        <Chat socket={socket} userName={userName} room={room} /> // Pass necessary props to the Chat component
      )}
    </>
  );
}

export default App;
