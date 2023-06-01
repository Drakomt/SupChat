import { Fragment } from "react";
import { Line, Saparate, Rows } from "../../../Layouts/Line/Line";
import "./ParticipantList.css";
import { Button } from "../../Button/Button";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Participant } from "./Participant/Participant";
export const ParticipantList = ({ participants, admins, isAdmin = false, onRemove }) => {
  const List = participants?.map((p) => {
    return (
      <Participant participant={p} admins={admins} isUserAdmin={isAdmin} onRemove={onRemove}/>
    );
  });
  return (
    <div className="ParticipantList">
      <Rows>{List}</Rows>
    </div>
  );
};
