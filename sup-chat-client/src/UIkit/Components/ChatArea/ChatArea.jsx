import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import { Rows } from "../../Layouts/Line/Line";
import { Input } from "../Input/Input/Input";
import { Saparate } from "../../Layouts/Line/Line";
import { Button } from "../Button/Button";
import { sendMessage } from "../../../store/userSlice";
import { MessageList } from "../MessageList/MessageList";
import SendIcon from "@mui/icons-material/Send";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  emitMessage,
  emitTyping,
  emitStopTyping,
} from "../../../services/socket";
//import { Picker } from "emoji-mart";
//import "emoji-mart/css/emoji-mart.css";
import "./ChatArea.css";
import { customFetch } from "../../utils/customFetch";
import { FileInput } from "../Input/FileInput/FileInput";

export const ChatArea = ({chat}) => {
  let typingTimeoutRef = useRef(null);
  const fileInput = useRef(null);
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
  const newMessage = { user:{_id:user._id}, text, dateTime: null };

  const sendNewMessage = (e) => {
    console.log("new message!!!!!!!!")
    e.preventDefault();
    if(!text.trim() && !newMessage.image){
      alert("enter message")
    } else{ 
      newMessage.dateTime = Date.now();
      dispatch(sendMessage(newMessage));
      emitMessage(newMessage, chat);
      setText("");
    }
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
  };

  const handleFileInput = (e) => {
    e.preventDefault();
    if(fileInput.current){
      fileInput.current.click();
    } else {
      console.log("no input");
    }
  };

  const handleImageUpload = useCallback( async (event) => {
    console.log("handleImageUpload");
    if(event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('user', user._id);
        const response = await customFetch(
          `messages/upload/${chat._id}`,
          "POST",
          formData
        );
        // console.log("upload successful", response);
        if (response && response.message && response.message.image){
          const imageMessage = { ...newMessage, image: response.message.image, text: '', dateTime: Date.now() };
          //console.log(imageMessage)
          dispatch(sendMessage(imageMessage));
          emitMessage(imageMessage, chat);
        } else {
          console.log("Upload successful but no image URL received from server");
        }
      } catch (error) {
        console.log("upload failed", error);
      }
    } else {
      console.log("No image selected!");
    }
  },[newMessage, dispatch, chat, user]);

  useEffect(() => {
      return () => {
        if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
  }, []);

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
              <Button onClick={handleFileInput} className="buttonForm btnGallery"> <CameraAltIcon/> </Button>
              <Button onClick={sendNewMessage} className="buttonForm btnSend"> <SendIcon/> </Button>
              <FileInput className={"hidden"} ref={fileInput} onTextChange={handleImageUpload}/>
            </Saparate>
          </form>
        </Rows>
      </div>
    </div>
  );
}
