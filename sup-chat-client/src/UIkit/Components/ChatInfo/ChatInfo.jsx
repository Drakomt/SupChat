import { useCallback, useEffect, useRef, useState } from "react";
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
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { emitUpdateChat } from "../../../services/socket";
import { updateChat } from "../../../store/userSlice";
import { Badge, Button, Drawer } from "@mui/material";
import { Input } from "../Input/Input/Input"
import { customFetch } from "../../utils/customFetch";
import { FileInput } from "../Input/FileInput/FileInput";

export const ChatInfo = ({chat}) => {
  const dispatch = useDispatch();
  const participants = useSelector(state => state.chatDisplaySlice.participantList);
  const error = useSelector(state => state.chatDisplaySlice.error);
  const isLoading = useSelector(state => state.chatDisplaySlice.isLoading);
  const user_id = useSelector((state) => state?.userSlice?.user?._id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editedChat, saveChat] = useState(chat);
  useEffect(() => saveChat(chat),[chat])
  const [dialogData, setDialogData] = useState({ open: false });
  const [openConfirm, setOpenConfirm] = useState(false);
  const didChange = useRef(false);
  const fileInput = useRef(null);
  const isAdmin = chat?.admins?.includes(user_id);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleFileInput = () => {
    if(fileInput.current){
      fileInput.current.click();
    }else {
      console.log("cant do that")
    }
  }

  if ((!participants || participants.length === 0) && !error && !isLoading){
    dispatch(fetchUserList(chat.participants));
  }

  const removeParticipant = (removedParticipant) =>{
    const copy = {...editedChat}
    copy.participants = copy.participants.filter((p) => {
      return p !== removedParticipant._id
    });
    didChange.current = true
    saveChat(copy);
  }

  const handleChange = useCallback(async (event) => {
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await customFetch(`data/upload/${chat._id}`, "POST", formData);
        console.log("upload successful",response);

        const updatedCChatData = {
          ...chat,
          imageUrl: response.imageUrl,
        };
        dispatch(updateChat(updatedCChatData));
      } catch (error) {
        console.error("upload failed", error);
      }
    }else{
      console.log("no file chosen!!!");
    }
  }, [chat._id, dispatch]);

  if (isLoading){
    return (
      <div className="ChatInfo">
        <Loading />
      </div>
    );  
  }

  if (error) {
  }
  return (
    <div className="ChatInfo">
       <SetDialog
        startOpen={dialogData.open}
        action={() => (didChange.current = true)}
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
          {chat.imageUrl ? <img src={`http://localhost:8080${chat.imageUrl}`} alt="chat" className="imageDetails"/> :<GroupsIcon className="imageDetails" />}
        </Badge>
        <Drawer anchor="bottom" open={drawerOpen} onClose={handleDrawerClose}>
          <div className="cameraDrawer">
            <CameraAltIcon style={{ fontSize: 40 }} />
            <CollectionsIcon style={{ fontSize: 40 }} onClick={handleFileInput}/>
            <FileInput className={"file"} forwardedref={fileInput} onTextChange={handleChange}/>
            {/* <Input type={"file"} className={"file"} forwardedref={fileInput}  onTextChange={handleChange}/> */}
          </div>
        </Drawer>

        <h1>
          {editedChat.name}
          {isAdmin && (
            <Button
              onClick={() => setDialogData({ open: true, field: "name" })}
            >
              <EditIcon />
            </Button>
          )}
        </h1>
        <h3>
          {editedChat.description}
          {isAdmin && (
            <Button
              onClick={() =>
                setDialogData({ open: true, field: "description" })
              }
            >
              <EditIcon />
            </Button>
          )}
        </h3>
        <h3>participants: </h3>
        <ParticipantList
          participants={participants.filter((p) => editedChat.participants.includes(p._id)
          )}
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
