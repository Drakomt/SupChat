import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Line, Saparate,Rows } from "../../../Layouts/Line/Line";
import "./MessageCard.css";
import { useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";

export const MessageCard = forwardRef(({message, key, className, onHeightReady}, ref) => {
    const isMobile = useSelector((state) => state.chatDisplaySlice.isMobile); 
    const date =  new Date(message.dateTime)
    const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
    const messageRef = useRef();
    const [openModal, setOpenModal] = useState(false);
    const [imageHeight, setImageHeight] = useState(0);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    // const onLoad = () => {
    //     if(ref.current){
    //         onHeightReady(ref.current.getBoundingClientRect().height);
    //     }
    // }

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width:"auto",
        height:"auto",
        border: "2px solid black",
    }

    const imageStyle = {
      width: "auto",
      height: "auto",
      maxWidth: "100%"
    };

    useEffect(() => {
      if (messageRef.current) {
        onHeightReady(messageRef.current.getBoundingClientRect().height);
      }
    }, []);

    useEffect(() => {
        const img = messageRef.current?.querySelector('img');
        if(!img) return;

        const resizeObserver = new ResizeObserver(entries => {
            for(let entry of entries) {
                if(entry.target === img) {
                    setImageHeight(entry.contentRect.height);
                }
            }
        });
        resizeObserver.observe(img);

        return () => resizeObserver.disconnect();
    },[])

    useEffect(() => {
        if(messageRef.current && imageHeight) {
            onHeightReady(messageRef.current.getBoundingClientRect().height);
        }
    },[imageHeight]);

    return (
      <div className={`messageCard ${className}`} key={key} ref={messageRef}>
        <Rows>
          <Saparate>
            <div>{message.user?.username}</div>
            <div>{message.user?.email} </div>
          </Saparate>
          <Saparate>
            {message.image ? (
              <img
                src={`http://localhost:8080${message.image}`}
                alt="message"
                className={`imageMessage ${isMobile ? "mobileImg" : ""}`}
                onClick={handleOpen}
              />
            ) : (
              <div className="messageContent">{message.text}</div>
            )}
            {/* <div className="messageContent">{message.text}</div> */}
            <div>{timeStr}</div>
          </Saparate>
        </Rows>

        <Modal open={openModal} onClose={handleClose}>
          <Box sx={modalStyle}>
            <img src={`http://localhost:8080${message.image}`} alt="message" style={imageStyle}/>
          </Box>
        </Modal>
      </div>
    );
});