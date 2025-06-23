
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import createSocket from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = () => {
  const { id } = useParams();
  const targetUserId = id;
  const loggedInUser = useSelector(state => state?.user?._id);

  console.log("Target User ID:",loggedInUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinChat", { targetUserId, loggedInUser });
    });

    newSocket.on("receive_message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [targetUserId, loggedInUser]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: loggedInUser,
      receiver: targetUserId,
      text: newMessage,
    };

    setMessages(prev => [...prev, message]); // Show instantly
    socket?.emit("send_message", message);   // Emit to server
    setNewMessage(""); // Clear input
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${msg.sender === loggedInUser ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="input input-bordered flex-1"
        />
        <button className="btn btn-primary" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
