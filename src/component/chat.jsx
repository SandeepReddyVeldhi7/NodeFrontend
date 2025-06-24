import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import createSocket from '../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';

const Chat = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const loggedInUser = user?._id;
  const targetUserId = id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // ✅ For smooth scroll
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ 1) Fetch user profile if missing
  const fetchProfile = async () => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await fetch(`${BACKEND}/get-user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("User data:", data);
      if (res.ok && data?.user) {
        dispatch(addUser(data.user));
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (!user || !user._id) {
      fetchProfile();
    }
  }, []);

  // ✅ 2) Setup socket connection AFTER user is ready
  useEffect(() => {
    if (!loggedInUser) return;

    const newSocket = createSocket();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinChat", {
        targetUserId,
        loggedInUser
      });
    });

    newSocket.on("receive_message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [targetUserId, loggedInUser]);

  // ✅ 3) Fetch existing chat messages AFTER user is ready
  const fetchChat = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${targetUserId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log("Chat data:", data?.chat);

      if (data?.chat?.messages) {
        const formattedMessages = data.chat.messages.map(m => ({
          sender: m.senderId,
          text: m.text,
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log("Error fetching chat:", error);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchChat();
    }
  }, [targetUserId, loggedInUser]);

  // ✅ 4) Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      sender: loggedInUser,
      receiver: targetUserId,
      text: newMessage,
    };

    // ✅ Don't push manually — let socket echo handle it
    socket?.emit("send_message", message);
    setNewMessage("");
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
        {/* ✅ Scroll target */}
        <div ref={messagesEndRef} />
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
