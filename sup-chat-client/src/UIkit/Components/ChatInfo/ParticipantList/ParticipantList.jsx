import { Fragment } from "react";
import { Line, Saparate, Rows } from "../../../Layouts/Line/Line";
import "./ParticipantList.css";

export const ParticipantList = ({ participants, admins }) => {
  const List = participants?.map((p) => {
    return (
      <div className="participant" key={p._id}>
        <Saparate>
          <div>{p.email}</div>
          <div>{p.username}</div>
        </Saparate>
      </div>
    );
  });
  return (
    <div className='ParticipantList'>
      <Rows>{List}</Rows>
    </div>
  );
};
