import { Line, Saparate,Rows } from "../../../Layouts/Line/Line"
import { DropDown } from "../../DropDown/DropDown";
import PersonIcon from '@mui/icons-material/Person';
import "./UserCard.css"
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { addContact, addNewChat } from "../../../../store/userSlice";
import { emitNewChat } from "../../../../services/socket";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { viewUserInfo } from "../../../../store/displaySlice";
import { customFetch } from "../../../utils/customFetch";

export const UserCard = (user) => {
    //console.log(user);
    const loggedInUser = useSelector(state => state.userSlice.user);
    //console.log("loggedInUser:", loggedInUser);
    const dispatch = useDispatch()
    const options = ['message', 'add contact', 'add to chat', 'details'];
    const newChat = useRef({});
    const storedToken = localStorage.getItem("token");
    
    const messageAction = ()=>{
        console.log('message action pressed');
         newChat.current = {
            participants: [loggedInUser, user],
            messages: [],
            admins:[loggedInUser],
            name:`private chat`,
            description: "",
            createdAt: Date.now()
        };
        emitNewChat(newChat.current);

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