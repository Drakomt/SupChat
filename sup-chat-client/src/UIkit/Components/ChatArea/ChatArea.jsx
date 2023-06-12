import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Rows } from "../../Layouts/Line/Line";
import { Input } from "../Input/Input/Input";
import { Saparate } from "../../Layouts/Line/Line";
import { Button } from "../Button/Button";
import { sendMessage } from "../../../store/userSlice";
import { MessageList } from "../MessageList/MessageList";
import SendIcon from "@mui/icons-material/Send";
import {
  emitMessage,
  emitTyping,
  emitStopTyping,
} from "../../../services/socket";
//import { Picker } from "emoji-mart";
//import "emoji-mart/css/emoji-mart.css";
import "./ChatArea.css";

export const ChatArea = ({chat}) => {
  let typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  // const chat = useSelector((state) => state.userSlice.selectedChat) || {
  //   messages: [],
  // };
  const messages = useSelector(
    (state) => state.userSlice.selectedChat?.messages
  );
  const user = useSelector((state) => state.userSlice.user);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const newMessage = { user, text, dateTime: null };

  const sendNewMessage = (e) => {
    if (e) e.preventDefault();
    newMessage.dateTime = Date.now();
    dispatch(sendMessage(newMessage));
    emitMessage(newMessage, chat);
    setText("");
  };

  const handleChange = (text) => {
    setText(text);

    if(!isTyping) {
      setIsTyping(true);
      emitTyping(user._id, chat._id);
    }

    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if(text === "") {
      setIsTyping(false);
      emitStopTyping(user._id, chat._id);
    } else {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        emitStopTyping(user._id, chat._id);
      }, 1000);
    }
  }


    useEffect(() => {
        return () => {
          if(typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
    }, []);

    if (!chat || !chat._id) {
      return (
        <div className="chatArea">
          <p>Please select a chat to start messaging.</p>
        </div>
      );
    }

    return (
      <div className="chatArea">
        <div className="chatAreaContainer">
          <Rows>
            <h1>{chat.name ? chat.name : "Chat Area"}</h1>
            <MessageList messages={messages}/>
            <form className="form" onSubmit={sendNewMessage}>
              <Saparate>
                <Input
                  type={"text"}
                  placeholder={"Write a new message..."}
                  name={"newMessage"}
                  onTextChange={handleChange}
                  value={text}
                  className="inputForm"
                />
                <Button onClick={sendNewMessage} className="buttonForm">
                  <SendIcon />
                </Button>
              </Saparate>
            </form>
          </Rows>
        </div>
      </div>
    );
}
