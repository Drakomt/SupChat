import { useEffect, useRef, useState } from "react";
import { fetchUserList } from "../../../store/chatDisplaySlice";
import { Line, Saparate, Rows } from "../../Layouts/Line/Line";
import { Loading } from "../Loading/Loading";
import "./ChatInfo.css";
import { ParticipantList } from "./ParticipantList/ParticipantList";
import GroupsIcon from "@mui/icons-material/Groups";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CollectionsIcon from "@mui/icons-material/Collections";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import { SetDialog } from "../SetDialog/SetDialog";
import { Button } from "../Button/Button";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { emitUpdateChat } from "../../../services/socket";
import { updateChat } from "../../../store/userSlice";
import { Badge, Button, Drawer } from "@mui/material";

export const ChatInfo = (chat) => {
  chat = chat.chat;
  const dispatch = useDispatch();
  const participants = useSelector(state => state.chatDisplaySlice.participantList);
  const error = useSelector(state => state.chatDisplaySlice.error);
  const isLoading = useSelector(state => state.chatDisplaySlice.isLoading);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editedChat, saveChat] = useState(chat);
  const [dialogData, setDialogData] = useState({ open: false });
  const didChange = useRef(false);
  // const [didChange, setChange] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  console.log("did change: ", didChange);

  const user_id = useSelector((state) => state?.userSlice?.user?._id);
  const isAdmin = chat?.admins?.includes(user_id);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  }
  
  const removeParticipant = (removedParticipant) =>{
    const copy = {...editedChat}
    copy.participants = copy.participants.filter((p) => {
      return p != removedParticipant._id
    });
    didChange.current = true
    saveChat(copy);
  }

  if ((!participants || participants.length === 0) && !error && !isLoading){
    dispatch(fetchUserList(chat.participants));
  }

  const removeParticipant = (removedParticipant) =>{
    const copy = {...editedChat}
    copy.participants = copy.participants.filter((p) => {
      return p != removedParticipant._id
    });
    didChange.current = true
    saveChat(copy);
  }
  if (isLoading){
    return (
      <div className="ChatInfo">
        <Loading />
      </div>
    );  }
  if (error) {
  }
  return (
    <div className="ChatInfo">
       <SetDialog
        startOpen={dialogData.open}
        action={() => didChange.current = true}
        close={() => setDialogData({ ...dialogData, open: false })}
        data={dialogData}
        object={editedChat}
        setObject={saveChat}
      />
      <ConfirmDialog
        close={() => setOpenConfirm(false)}
        startOpen={openConfirm}
        action={() => {
          emitUpdateChat(editedChat);
          dispatch(updateChat(editedChat));
          didChange.current = false;
        }}
      />
    
      <Rows>
        <Badge
          color="secondary"
          style={{ fontSize: 40 }}
          badgeContent={<CameraAltIcon />}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          onClick={handleDrawerOpen}
        >
          <GroupsIcon className="imageDetails" />
        </Badge>
        <Drawer anchor="bottom" open={drawerOpen} onClose={handleDrawerClose}>
          <div className="cameraDrawer">
            <CameraAltIcon style={{ fontSize: 40 }} />
            <CollectionsIcon style={{fontSize: 40}}/>
          </div>
        </Drawer>
        
        <h1>{editedChat.name}</h1>
        {isAdmin && (
            <Button
              onClick={() => setDialogData({ open: true, field: "name" })}
            >
              <EditIcon />
            </Button>
         )}
        <h3>{editedChat.description} </h3>
        {isAdmin && (
            <Button
              onClick={() =>
                setDialogData({ open: true, field: "description" })
              }
            >
              <EditIcon />
            </Button>
        )}
        <h3>participants: </h3>
        <ParticipantList
          participants={participants.filter(p => editedChat.participants.includes(p._id))}
          admins={chat.admins}
          isAdmin={isAdmin}
          onRemove={removeParticipant}
        ></ParticipantList>

        <div>created at :{chat.createdAt}</div>
        {didChange.current && (
          <Button onClick={() => setOpenConfirm(true)}> save </Button>
        )}
      </Rows>
    </div>
  );
};
