import React, { useCallback, useRef, useState } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  TextField,
  Typography,
  Badge,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Button } from "../UIkit/Components/Button/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/userSlice";
import { emitUpdateUser } from "../services/socket";
import { FileInput } from "../UIkit/Components/Input/FileInput/FileInput";
import CollectionsIcon from "@mui/icons-material/Collections";
import { customFetch } from "../UIkit/utils/customFetch";

export const Profile = ({ user }) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const fileInput = useRef(null);

  const handleUsernameClick = () => {
    setIsEditing("username");
  };

  const handleEmailClick = () => {
    setIsEditing("email");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFileInput = () => {
    if (fileInput.current) {
      fileInput.current.click();
    } else {
      console.log("cant do that");
    }
  };

  const saveChanges = () => {
    if (email !== user.email || username !== user.username) {
      dispatch(updateUser({ email, username }));
      emitUpdateUser({ ...user, email, username });
    }
  };

  const handleChange = useCallback(async (event) => {
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await customFetch(`uploadUserImage/${user._id}`, "POST", formData);
        console.log("upload successful",response);

        const updatedUserData = {
          ...user,
          imageUrl: response.imageUrl,
        };
        dispatch(updateUser(updatedUserData));
      } catch (error) {
        console.error("upload failed", error);
      }
    }else{
      console.log("no file chosen!!!");
    }
  }, [user._id, dispatch]);

  return (
    <div className="profile">
      <Badge
        color="info"
        style={{ fontSize: 40 }}
        badgeContent={<CollectionsIcon />}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClick={handleFileInput}
      >
        <Avatar
          alt={username}
          src={`http://localhost:8080${user.imageUrl}`}
          style={{ height: "100px", width: "100px" }}
        />
        <FileInput className={"file"} ref={fileInput} onTextChange={handleChange}/>
      </Badge>
      {/* <ListItem>
        <CollectionsIcon style={{ fontSize: 40 }} onClick={handleFileInput} />
        <FileInput
          className={"file"}
          forwardedref={fileInput}
          onTextChange={handleChange}
        />
      </ListItem> */}
      <ListItem>
        <ListItemAvatar>
          <Avatar />
        </ListItemAvatar>
        <ListItemText
          primary="Username"
          secondary={
            isEditing === "username" ? (
              <TextField
                defaultValue={username}
                onChange={handleUsernameChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <Typography onClick={handleUsernameClick}>{username}</Typography>
            )
          }
        />
      </ListItem>
      {/* <Divider variant="inset" component="li" /> */}
      <ListItem>
        <ListItemAvatar>
          <EmailIcon />
        </ListItemAvatar>
        <ListItemText
          primary="Email"
          secondary={
            isEditing === "email" ? (
              <TextField
                defaultValue={email}
                onChange={handleEmailChange}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <Typography onClick={handleEmailClick}>{email}</Typography>
            )
          }
        />
      </ListItem>
      <ListItem>
        <Button onClick={() => saveChanges()} className={"saveBtn"}>save</Button>
      </ListItem>
    </div>
  );
};
