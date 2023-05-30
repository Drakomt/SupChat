import { Line, Saparate,Rows } from "../../../Layouts/Line/Line"
import { DropDown } from "../../DropDown/DropDown";
import PersonIcon from '@mui/icons-material/Person';
import "./UserCard.css"
import { useSelector, useDispatch } from "react-redux";
import { UseFetch } from "../../../../CustomHooks/useFetch";
import { useState, useRef } from "react";
import { addContact, addNewChat } from "../../../../store/userSlice";
import { emitNewChat } from "../../../../services/socket";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

export const UserCard = (user) => {
    //console.log(user);
    const loggedInUser = useSelector(state => state.userSlice.user);
    //console.log("state:",logeedInUser)
    const dispatch = useDispatch()
    const options = ['message', 'add contact', 'add to chat'];
    const [isAddContact,setIsAddContact] = useState(false);
    const newChat = useRef({});
    UseFetch('addContact', 'put',loggedInUser,[isAddContact],isAddContact);
    
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
        dispatch(addContact(user));
        setIsAddContact(true);
    };
    const addToChatAction = () =>{
        console.log('menu pressed')
    };
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
        <DropDown options={options} actions={[messageAction, addContactAction, addToChatAction]}/>
      </ListItem>
      // <div className="UserCard">
      //     <Rows>
      //         <Saparate>
      //             <div className="image">
      //                 {user.imageUrl ? <img src={user.imageUrl} alt={user.username}/> : <PersonIcon/>}
      //             </div>
      //             <Line>
      //                 <div>{user.username}</div>
      //                 <DropDown
      //                  options={options}
      //                  actions={[ messageAction, addContactAction, addToChatAction ]}/>
      //                 </Line>
      //         </Saparate>
      //         <div>{user.email}</div>
      //     </Rows>
      // </div>
    );
}