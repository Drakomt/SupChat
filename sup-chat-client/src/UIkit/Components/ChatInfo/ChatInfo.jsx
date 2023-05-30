import { useEffect } from "react";
import { fetchUserList } from "../../../store/chatDisplaySlice";
import { Line, Saparate, Rows } from "../../Layouts/Line/Line";
import { Loading } from "../Loading/Loading";
import "./ChatInfo.css";
import { ParticipantList } from "./ParticipantList/ParticipantList";
import GroupsIcon from "@mui/icons-material/Groups";
import { useSelector, useDispatch } from "react-redux";
export const ChatInfo = (chat) => {
  chat = chat.chat;
  const dispatch = useDispatch();
  const participants = useSelector(state => state.chatDisplaySlice.participantList);
  const error = useSelector(state => state.chatDisplaySlice.error);
  const isLoading = useSelector(state => state.chatDisplaySlice.isLoading);

  console.log('participants from selector : ', participants)

  if ((!participants || participants.length === 0) && !error && !isLoading){
    dispatch(fetchUserList(chat.participants));
  }
  if (isLoading){
    return (
      <div className="ChatInfo">
        <Loading />
      </div>
    );
  }
  if (error){
  }
  return (
    <div className='ChatInfo'>
      <Rows>
        <div className="imageDetails">
          <GroupsIcon />
        </div>

        <h1>{chat.name}</h1>
        <h3>{chat.description} </h3>
        <h3>participants: </h3>
        <ParticipantList
          participants={participants}
          admins={chat.admins}
        ></ParticipantList>
        <div>created at :{chat.createdAt}</div>
      </Rows>
    </div>
  );
};
