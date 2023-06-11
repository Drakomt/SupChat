import { Fragment } from "react";

import "./Participant.css";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Line, Saparate } from "../../../../Layouts/Line/Line";
import { Button } from "../../../Button/Button";
export const Participant = ({ participant, admins, isUserAdmin, onRemove}) => {
  const isParticipantAdmin = admins.includes(participant._id);
  
    const removeParticipant = () =>{
    onRemove(participant);
    }
  return (
    <div className="Participant">
      <Line>
        <div className="participant" key={participant._id}>
            <Saparate>
              <div>{participant.username}</div>
              <div>{participant.email}</div>
            </Saparate>
        </div>
        {isUserAdmin && (
              <Button className={"minus"} onClick={removeParticipant}>
                <RemoveCircleOutlineIcon />
              </Button>
            )}
      </Line>
    </div>
  );
};
