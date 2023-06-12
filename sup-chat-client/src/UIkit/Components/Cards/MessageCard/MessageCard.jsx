import { forwardRef, useLayoutEffect, useRef } from "react";
import { Line, Saparate,Rows } from "../../../Layouts/Line/Line";
import "./MessageCard.css";

export const MessageCard = forwardRef(({message, key, className, onHeightReady}, ref) => {
    
    const date =  new Date(message.dateTime)
    const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
    const messageRef = useRef();

    useLayoutEffect(() => {
        if(messageRef.current) {
            onHeightReady(messageRef.current.getBoundingClientRect().height);
        }
    },[]);
    return (
        <div className={`messageCard ${className}`} key={key} ref={messageRef}>
            <Rows>  
                <Saparate>
                    <div>{message.user?.username}</div>
                    <div>{message.user?.email} </div>
                </Saparate>
                <Saparate>
                    <div className="messageContent">{message.text}</div>
                    <div>{timeStr}</div>
                </Saparate>
            </Rows>
        </div>
    )
});