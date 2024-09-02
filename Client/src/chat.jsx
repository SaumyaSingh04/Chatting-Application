import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import music from "./iphone-sms-tone-original-mp4-5732.mp3"

function Chat({ socket, userName, room }) {
  const [message, setMessage] = useState(""); // State to hold the current message
  const [messages, setMessages] = useState([]); // State to hold all messages
  const chatBoxRef = useRef(null); // Reference to the chat box for scrolling

  const notification = new Audio(music); 


  // Function to handle sending a message
  const sendMessage = () => {
    if (message !== "") {
      const messageData = {
        room: room,
        user: userName,
        message: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Using locale time format for the message timestamp
      };

      socket.emit("send_message", messageData); // Emit message event to the server
      setMessages((list) => [...list, messageData]); // Add the message to local state
      setMessage(""); // Clear the input field
      notification.play();      //audio

    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Send message when Enter key is pressed
    }
  };

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data]); // Add the received message to the local state
    });

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat box whenever a new message is added
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Effect will run whenever messages change

  return (
    <div className="chat-container">
      <h3 className="welcome-message">Welcome, {userName}!</h3>
      <h4>Chat Room: {room}</h4>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${
              msg.user === userName ? "my-message" : "other-message"
            }`}
          >
            <div className="message">
              <p className="message-text">{msg.message}</p>
            </div>
            <p className="message-info">
              <strong>{msg.user}</strong> [{msg.time}]
            </p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Call handleKeyPress on key press
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

// Define the prop types for the Chat component
Chat.propTypes = {
  socket: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
};

export default Chat;
