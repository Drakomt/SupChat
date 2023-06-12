
import { Rows } from "../../Layouts/Line/Line";
import { Loading } from "../Loading/Loading";
import "./UserInfo.css";

import { useSelector, useDispatch } from "react-redux";


export const UserInfo = () => {
    const user = useSelector(state => state.displaySlice.selectedUser);
    return(<div className="UserInfo">
        <Rows>
            <h1>
                {user.username}
            </h1>
            <h2>
                {user.email}
            </h2>
            <h3>
               joined the site at {user.createdAt}
            </h3>
        </Rows>
    </div>)
}