import { Fragment } from "react";
import { Line, Saparate, Rows } from "../../../Layouts/Line/Line";
import "./ParticipantList.css";
import { Button } from "../../Button/Button";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Participant } from "./Participant/Participant";
import { Divider, List, ListItem } from "@mui/material";
export const ParticipantList = ({
  participants,
  admins,
  isAdmin = false,
  options,
  actions,
}) => {
  const participantList = participants?.map((p, index) => {
    return (
      <ListItem key={p._id}>
        <Participant
          participant={p}
          admins={admins}
          isUserAdmin={isAdmin}
          options={options}
          actions={actions}
          key={p._id}
        />
        {index !== participants.length - 1 && <Divider variant="inset" component="li"/>}
      </ListItem>
    );
  });
  return (
    <div className="ParticipantList">
      <List
        sx={{ width: "100%", maxWidth: "100%", bgcolor: "background.paper" }}
      >
        {participantList}
      </List>
    </div>
  );
};
