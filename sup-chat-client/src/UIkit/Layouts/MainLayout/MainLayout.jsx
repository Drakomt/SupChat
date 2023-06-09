import { LayoutLine } from "../Line/Line";
import { SideBar } from "../../Components/SideBar/SideBar";
import { ChatArea } from "../../Components/ChatArea/ChatArea";
import { SpeedDialOptions } from "../../Components/Button/SpeedDial/SpeedDialOptions";
import { ChatInfo } from "../../Components/ChatInfo/ChatInfo";
import "./MainLayout.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { AddChat } from "../../../pages/addChat";
import { connectSocket, disconnectSocket } from "../../../services/socket";
import { logOut ,fetchUser} from "../../../store/userSlice";
import { Profile } from "../../../pages/profile";
import { UserInfo } from "../../Components/UserInfo/UserInfo";
import { Button } from "../../Components/Button/Button";
import { setViewChat, setIsMobile, setIsChatVisible, setIsInfoVisible } from "../../../store/chatDisplaySlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setDisplayChat } from "../../../store/displaySlice";

const BackButton = ({ onClick }) => (
  <Button className={"back"} onClick={onClick}>
    <ArrowBackIcon/>
  </Button>
);

export const MainLayout = () => {
  //const [view, setView] = useState('sidebar');
  //const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice.user);
  const display = useSelector((state) => state.displaySlice.display);
  const selectedChat = useSelector((state) => state.userSlice.selectedChat);
  const viewChat = useSelector((state) => state.chatDisplaySlice.viewChat);
  const isMobile = useSelector((state) => state.chatDisplaySlice.isMobile);
  const isChatVisible = useSelector((state) => state.chatDisplaySlice.isChatVisible);
  const isInfoVisible = useSelector((state) => state.chatDisplaySlice.isInfoVisible);

  useEffect(() => {
    if (user) {
      connectSocket(user);
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("NO Token Found. Redirecting to login page...");
      dispatch(logOut());
      navigate("/login");
    } else  {
      //console.log("Token Found:", storedToken);
      dispatch(fetchUser({token: storedToken}));
    }
  }, [navigate, dispatch]);

  const handleSetView = (view) => {
    dispatch(setViewChat(view));
  };

  const onClickBack = () => {
    dispatch(setViewChat("sidebar"));
    dispatch(setIsChatVisible(false));
    dispatch(setIsInfoVisible(false));
  }

  const handleResize = () => {
    const isMobileNow = window.innerWidth <= 768;
    dispatch(setIsMobile(isMobileNow));
    if (isChatVisible && isMobileNow) {
      dispatch(setViewChat("chat"));
    } else {
      dispatch(setViewChat("sidebar"));
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  },[dispatch]);

  // console.log(isChatVisible)
  // console.log(isInfoVisible)
  // console.log(isMobile)
  // console.log(viewChat)
  // console.log(display)
  return (
    <div className="MainLayout">
      {(isChatVisible || isInfoVisible) && isMobile && (viewChat === "chat" || viewChat === "chatInfo") ? (
        <BackButton onClick={onClickBack} />
      ) : (
        <SpeedDialOptions setView={handleSetView} />
      )}
      {/* <SpeedDialOptions setView={handleSetView} /> */}
      <LayoutLine>
        {viewChat === "addChat" && (
          <AddChat closeCb={() => dispatch(setViewChat("sidebar"))} />
        )}
        {(!isChatVisible || !isMobile) && viewChat === "sidebar" && <SideBar />}
        {viewChat === "profile" && <Profile user={user} />}
        {isInfoVisible && display === "chatInfo" && selectedChat && (
          <ChatInfo chat={selectedChat} />
        )}
        {isChatVisible && display === "chat" && selectedChat && <ChatArea chat={selectedChat}/>}
        {display === "userInfo" && <UserInfo />}
      </LayoutLine>
    </div>
  );
};
