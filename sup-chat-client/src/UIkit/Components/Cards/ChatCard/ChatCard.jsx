import { Line, Saparate, Rows } from "../../../Layouts/Line/Line";
import GroupsIcon from "@mui/icons-material/Groups";
import "./ChatCard.css";
import { useDispatch, useSelector } from "react-redux";
import { selectNewMessageCount, setSelectedChat, viewChat } from "../../../../store/userSlice";
import { useEffect, useState } from "react";
import { resetParticipants, setDisplay, setIsChatVisible, setIsInfoVisible, setViewChat } from "../../../../store/chatDisplaySlice";
import { DropDown } from "../../DropDown/DropDown";
import { ConfirmDialog } from "../../ConfirmDialog/ConfirmDialog";
import { removeSelfFromChatRoom } from "../../../../services/socket";
import { Avatar, Badge, Grid, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { viewChatInfo, viewChatMessages } from "../../../../store/displaySlice";
import { PrivateChatCard } from "./PrivateChatCard/PrivateChatCard";

export const ChatCard = (chat, key) => {
  const [dots, setDots] = useState(".");
  const dispatch = useDispatch();
  const isTyping = Array.isArray(chat.typingUsers) && chat.typingUsers.length > 0;
  const lastMessage = chat.messages?.slice(-1)[0] ? chat.messages?.slice(-1)[0] : { dateTime: new Date(), text: "last message" };
  const date = new Date(lastMessage.dateTime);
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false,});
  const options = ["details", "exit chat"];
  const [openExitChat, setOpenExitChat] = useState(false);
  const newMessages = useSelector(state => selectNewMessageCount(state,chat));
  const isMobile = useSelector((state) => state.chatDisplaySlice.isMobile);
  const isInfoVisible = useSelector((state) => state.chatDisplaySlice.isInfoVisible);

  useEffect(() => {
    let typingInterval;
    if (isTyping) {
      typingInterval = setInterval(() => {
        setDots((prevDots) => {
          return prevDots.length < 3 ? prevDots + "." : "";
        });
      }, 500);
    } else {
      setDots(".");
    }

    return () => clearInterval(typingInterval);
  }, [isTyping]);
  const infoAction = () => {
    dispatch(setSelectedChat(chat));
    dispatch(resetParticipants());
    dispatch(viewChatInfo(chat));
    dispatch(setIsInfoVisible(true));
    if(isMobile){
      dispatch(setViewChat("chatInfo"));
    }
  };
  const openLeaveDialog = () => {
    setOpenExitChat(true);
  };

  const leaveChat = () =>{
    removeSelfFromChatRoom(chat);
  }
  const onClick = () => {
    dispatch(setSelectedChat(chat));
    dispatch(viewChatMessages(chat));
    dispatch(setIsChatVisible(true));
    if(isMobile){
      dispatch(setViewChat('chat'));
    }
  };
  const shorter = (item) => {
    return item.length > 15 ? item.substring(0, 15) + "..." : item
  }
  const chatCardUI = <div onClick={onClick} key={key}>
  <ConfirmDialog
    startOpen={openExitChat}
    action={leaveChat}
    close={() => setOpenExitChat(false)}
  />
  <ListItem onClick={onClick} key={key} alignItems="flex-start">
    <ListItemAvatar>
      <Avatar>
        {chat.imageUrl ? (
          <img
            src={`http://localhost:8080${chat.imageUrl}`}
            alt="chat"
            className="image"
          />
        ) : (
          <GroupsIcon />
        )}
      </Avatar>
    </ListItemAvatar>
    <Grid container justifyContent={"space-between"}>
      <Grid item>
        <ListItemText
          primary={shorter(chat.name)}
          secondary={
            <Typography sx={{color: isTyping ? "blue" : "inherit"}}>
              {isTyping ? `Typing${dots}` : shorter(lastMessage.text)} 
            </Typography>
          }
        />
      </Grid>
      <Grid item>
        <Typography variant="body2">{timeStr}</Typography>
        <Badge badgeContent={newMessages > 100 ? "99+" : newMessages} color="primary" invisible={newMessages === 0}/>
      </Grid>
    </Grid>
    <DropDown options={options} actions={[infoAction, openLeaveDialog]} />
  </ListItem>
</div>
  return chat.name !== 'private chat' && chatCardUI || <PrivateChatCard chat={chat} key={key}/>;
};
