import { Line, Saparate,Rows } from "../../../Layouts/Line/Line"
import { DropDown } from "../../DropDown/DropDown";
import PersonIcon from '@mui/icons-material/Person';
import "./UserCard.css"
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { addContact, addNewChat, setSelectedChat } from "../../../../store/userSlice";
import { emitNewChat } from "../../../../services/socket";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { viewUserInfo } from "../../../../store/displaySlice";
import { customFetch } from "../../../utils/customFetch";
import { setIsChatVisible, setIsUserInfoVisible, setViewChat } from "../../../../store/chatDisplaySlice";

export const UserCard = (user) => {
    //console.log(user);
    const loggedInUser = useSelector(state => state.userSlice.user);
    const isMobile = useSelector((state) => state.chatDisplaySlice.isMobile);
    //console.log("loggedInUser:", loggedInUser);
    const dispatch = useDispatch()
    const options = ['message', 'add contact', 'add to chat', 'details'];
    const newChat = useRef({});
    const storedToken = localStorage.getItem("token");
    
    const fetchPrivateChat = async (user1Id, user2Id) => {
      const data = {user1Id, user2Id};
      const chat = await customFetch("data/fetchPrivateChat", "GET", data);
      return chat;
    }

    const messageAction = async () => {
        console.log('message action pressed');
        const user1Id = loggedInUser._id;
        const user2Id = user._id;
        const privateChat = await fetchPrivateChat(user1Id,user2Id);
        console.log(privateChat)
        if(privateChat === null){
          newChat.current = {
            participants: [loggedInUser, user],
            messages: [],
            admins:[loggedInUser],
            name:`private chat`,
            description: "",
            createdAt: Date.now()
          };
          emitNewChat(newChat.current);
          dispatch(setSelectedChat(newChat.current));
        } else{
          dispatch(setSelectedChat(privateChat))
        }

        dispatch(setIsChatVisible(true));
        if(isMobile){
          dispatch(setViewChat("chat"));
        }

    };
    const addContactAction = () =>{
  
    const updatedUser = {
      ...loggedInUser,
      friends: [...loggedInUser.friends, user]
    };
    customFetch("addContact", "put", {token: storedToken, user: updatedUser})
    .then((response) => {
      dispatch(addContact(user));
      console.log("Response:", response);
      console.log("Contact added successfully.");
    })
    .catch((error) => {
      console.log("Failed to add contact:", error);
    });
        
    };
    const addToChatAction = () =>{
        console.log('menu pressed')
    };
    const detailsAction = () =>{
      dispatch(viewUserInfo(user));
      dispatch(setIsUserInfoVisible(true));
      if(isMobile){
        dispatch(setViewChat("userInfo"));
      }
    }
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.username} />
            ) : (
              <PersonIcon />
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.username} secondary={user.email}/>
        <DropDown options={options} actions={[messageAction, addContactAction, addToChatAction,detailsAction]}/>
      </ListItem>
    );
}