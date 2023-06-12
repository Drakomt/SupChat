import { Rows } from "../../../Layouts/Line/Line";
import { Fragment } from "react";
import { ChatCard } from "../ChatCard/ChatCard";
import { UserCard } from "../UserCard/UserCard";
//import { MessageCard } from "../MessageCard/MessageCard";
import "./CardList.css";
import { Divider, List } from "@mui/material";

const componentMap = {
  ChatCard,
  UserCard,
  //MessageCard,
};

export const CardList = ({items, cardType}) => {
  const Card = componentMap[cardType];
  return (
    // <div className="cardList">
    //   <Rows>
    //     {items?.map((item) => <Fragment key={item._id}> <Card {...item} /> </Fragment> )}
    //   </Rows>
    // </div>
    <List sx={{width: '100%', maxWidth: "100%", bgcolor: 'background.paper'}}>
      {items?.map((item,index) => (
        <Fragment key={item._id}>
          <Card {...item} />
          {index !== item.length - 1 && <Divider variant="inset" component="li"/>}
        </Fragment>
      ))}
    </List>
  );
};