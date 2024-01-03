import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Chat = () => {
  var token;

  const [socket] = useState(io());
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  useEffect(() => {
    token = localStorage.getItem("token");
    console.log("token", token);

    if (token) {
      axios
        .get("http://localhost:4000/api/chat", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
          setUsername(response.data.user.name);
        });
    } else {
      alert("user not found , please login again");
      navigate("/login");
    }
  }, []);
  const textArea = useRef(null);
  // const textArea = document.getElementById("textarea");
  const sendMessage = (message) => {
    const msg = {
      user: username,
      message: message.trim(),
    };

    appendMessage(msg, "outgoing");
    textArea.value = "";
    socket.emit("message", msg);
  };
  // const appendMessage = (msg, type) => {
  //   const mainDiv = document.createElement("div");
  //   const className = type;
  //   mainDiv.classList.add(type, "message");
  //   let markup;
  //   console.log(msg.user);

  //   if (type === "outgoing") {
  //     markup = <p>{msg.message}</p>;
  //   } else {
  //     markup = (
  //       <>
  //         <h4>{msg.user}</h4>
  //         <p>{msg.message}</p>
  //       </>
  //     );
  //   }
  //   mainDiv.innerHTML = markup;
  //   document.querySelector(".message__area").appendChild(mainDiv);
  // };
  const appendMessage = (msg, type) => {
    const mainDiv = document.createElement("div");
    const className = type;
    mainDiv.classList.add(type, "message");

    if (type === "outgoing") {
      const paragraph = document.createElement("p");
      paragraph.textContent = msg.message;
      mainDiv.appendChild(paragraph);
    } else {
      const heading = document.createElement("h4");
      heading.textContent = msg.user;

      const paragraph = document.createElement("p");
      paragraph.textContent = msg.message;

      mainDiv.appendChild(heading);
      mainDiv.appendChild(paragraph);
    }

    document.querySelector(".message__area").appendChild(mainDiv);
  };
  const fetchChatsData = async () => {
    try {
      const response = await fetch("http://localhost:4000/chats");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch chats data (${response.status}): ${response.statusText}`
        );
      }

      const chatsData = await response.json();

      for (let i = 0; i < chatsData.length; i++) {
        const chat = chatsData[i];
        const msg = {
          user: chat.username,
          message: chat.message,
        };
        if (msg.user === username) {
          appendMessage(msg, "outgoing");
        } else {
          appendMessage(msg, "incoming");
        }
      }
    } catch (error) {
      console.error("Error fetching chats data:", error);
    }
  };

  useEffect(() => {
    fetchChatsData();
  }, [username]); // Run when username changes

  useEffect(() => {
    const handleIncomingMessage = (msg) => {
      appendMessage(msg, "incoming");
    };

    socket.on("message", handleIncomingMessage);

    return () => {
      socket.off("message", handleIncomingMessage);
    };
  }, [socket]);

  return (
    <div>
      <h1>Chat App</h1>
      <p>
        {user?.user.name} , {user?.user.email}
      </p>

      <button onClick={logout}>Logout</button>
      <div className="message__area"></div>
      <textarea
        ref={textArea}
        id="textarea"
        cols="30"
        rows="1"
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage(message)}
      />
    </div>
  );
};

export default Chat;
