import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./App.css";

function App() {
  const [chatData, setChatData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedChat, setSelectedChat] = useState({});
  const [messageValue, setMessageValue] = useState("");

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats")
      .then((response) => response.json())
      .then((data) => {
        setChatData(data);
      });
  }, []);

  const convertTimeStamp = (timestamp) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(timestamp);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const getFilteredData = () => {
    let newChatData = JSON.parse(JSON.stringify(chatData));
    newChatData = newChatData.filter((chat) => {
      return (
        chat.orderId.toLowerCase().includes(filterValue.toLowerCase()) ||
        chat.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    });
    return newChatData;
  };

  const handleClick = (chat) => {
    console.log(chat);
    if (selectedChat.id === chat.id) {
      setSelectedChat({});
    } else {
      setSelectedChat(chat);
    }
  };

  const handleChange = (e) => {
    setMessageValue(e.target.value);
  };

  const handleMessageSend = () => {
    let tempData = JSON.parse(JSON.stringify(selectedChat));
    let timestamp = Date.now();
    if (!tempData.messageList) {
      tempData.messageList = [];
    }
    tempData.messageList.push({
      message: messageValue,
      timestamp: timestamp,
      sender: "USER",
      messageType: "text",
    });
    let index = chatData.findIndex((chat) => chat.id === selectedChat.id);
    console.log(index, tempData);
    if (index !== -1) {
      chatData[index] = JSON.parse(JSON.stringify(tempData));
      setChatData(chatData);
      setSelectedChat(tempData);
      setMessageValue("");
    }
  };
  console.log(getFilteredData());

  return (
    <div className="App">
      <div className="filter">
        <h3>Filter By Title / Order ID</h3>
        <input
          value={filterValue}
          onChange={(e) => handleFilterChange(e)}
          className="input-feild"
        />
      </div>
      <div style={{ display: "flex" }}>
        <div
          className="chat-left"
          style={{ width: !Object.keys(selectedChat).length ? "100%" : "40%" }}
        >
          <div className="chat-list">
            {getFilteredData().length ? (
              getFilteredData().map((chat, index) => {
                return (
                  <div
                    className="chat-item"
                    key={index}
                    onClick={() => handleClick(chat)}
                  >
                    <div className="chat-item-left">
                      <img src={chat.imageURL} className="chat-image-icon" />
                      <div className="chat-info">
                        <h5 className="title">{chat.title}</h5>
                        <h5 className="order">{`Order ${chat.orderId}`}</h5>
                        <div className="latest-message">
                          {chat.messageList.length
                            ? chat.messageList[chat.messageList.length - 1]
                                ?.message
                            : null}
                        </div>
                      </div>
                    </div>
                    <div className="chat-info-right">
                      {convertTimeStamp(chat.latestMessageTimestamp)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No Data</div>
            )}
          </div>
        </div>
        <div
          className="chat-right"
          style={{
            display: !Object.keys(selectedChat).length && "none",
            width: Object.keys(selectedChat).length && "70%",
            overflow: "auto",
          }}
        >
          <div className="chat-header">
            <img src={selectedChat.imageURL} className="chat-image-icon" />
            <div className="chat-info">
              <h5 className="title">{selectedChat.title}</h5>
            </div>
          </div>
          <div className="message-area">
            <div className="scroll-body">
              {selectedChat.messageList &&
                selectedChat.messageList.map((message, id) => {
                  return message.messageType === "text" ? (
                    <div
                      className={
                        message.sender === "BOT"
                          ? "message-left"
                          : "message-right"
                      }
                    >
                      {message.message}
                    </div>
                  ) : (
                    <div className="options">
                      <div className="option-header">{message.message}</div>
                      {message.options.map((option, i) => {
                        return (
                          <div className="option">{option.optionText}</div>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
            <div className="message-actions">
              <input
                className="message-input"
                value={messageValue}
                onChange={(e) => handleChange(e)}
              />
              <button className="message-button" onClick={handleMessageSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
