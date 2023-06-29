import { Rows } from "../../../Layouts/Line/Line";
import { Fragment } from "react";
import { ChatCard } from "../ChatCard/ChatCard";
import { UserCard } from "../UserCard/UserCard";
import "./CardList.css";
import { Divider, List } from "@mui/material";

const componentMap = {
  ChatCard,
  UserCard,
};

export const CardList = ({items, cardType}) => {
  const Card = componentMap[cardType];
  return (
    <List sx={{width: '100%', maxWidth: "100%", bgcolor: 'background.paper'}}>
      {items?.map((item,index) => (
        <Fragment key={item._id}>
          <Card {...item} />
          {index !== items.length - 1 && <Divider variant="inset" component="li"/>}
        </Fragment>
      ))}
    </List>
  );
};