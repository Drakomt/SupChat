import React,{ useState,useEffect, useRef, useCallback } from "react"
import { MessageCard } from "../Cards/MessageCard/MessageCard"
import { useSelector } from "react-redux";
import "./MessageList.css";
import { FixedSizeList } from "react-window";

export const MessageList = ({messages}) => {
    const user = useSelector(state => state.userSlice.user);
    const [displayMessages, setDisplayMessages] = useState([]);
    const [listHeight, setListHeight] = useState(window.innerHeight * 0.68);
    const listRef = useRef();

    const loadMoreMessages = useCallback(() => {
      if(displayMessages.length >= messages.length) return;
      const moreMessages = messages.slice(Math.max(0, messages.length - displayMessages.length - 10),
      messages.length - displayMessages.length);
      setDisplayMessages((prevDisplayMessages) => [
        ...moreMessages,
        ...prevDisplayMessages,
        ]);
    }, [displayMessages, messages]);

    const handleItemRendered = useCallback(({visibleStartIndex}) => {
      if(visibleStartIndex === 0) {
        loadMoreMessages();
      }
    },
    [loadMoreMessages]);

    useEffect(() => {
      const handleResize = () => setListHeight(window.innerHeight * 0.68);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      setDisplayMessages(messages.slice(-10));
    }, [messages]);

    useEffect(() => {
      if(listRef.current) {
        listRef.current.scrollToItem(displayMessages.length - 1, "end")
      }
    },[displayMessages]);

    const MessageCardRow = ({ index, style }) => {
      const message = displayMessages[index];
      return (
        <div style={style}>
          <MessageCard
            message={message}
            className={
              message.user._id === user._id ? "mymessage" : "othermessage"
            }
          />
        </div>
      );
    };

    return (
      <div className="messageList">
        <FixedSizeList
          height={listHeight}
          itemCount={displayMessages.length}
          itemSize={65}
          width={"100%"}
          ref={listRef}
          onItemsRendered={handleItemRendered }
          >
          {MessageCardRow}
        </FixedSizeList>
      </div>
    );
}