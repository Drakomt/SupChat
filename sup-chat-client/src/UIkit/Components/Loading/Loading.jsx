import { Rows } from "../../Layouts/Line/Line";
import { CircularProgress } from "@mui/material";
import './Loading.css'
export const Loading = ({ text = "" }) => {
  return (
    <div className="Loading">
      <Rows>
        <div>{text || "loading..."}</div>
        <CircularProgress />
      </Rows>
    </div>
  );
};
