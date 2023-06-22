
import { Rows } from "../../Layouts/Line/Line";
import "./UserInfo.css";
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from "react-redux";


export const UserInfo = () => {
    const user = useSelector(state => state.displaySlice.selectedUser);
    const date = new Date(user.createdAt);
    const formattedDate = date.toLocaleDateString() + ", " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false});

    return(<div className="UserInfo">
        <Rows>
        {user.imageUrl && !user.imageUrl.toLowerCase().split('/').includes('undefined') ? (
              <img src={`http://localhost:8080${user.imageUrl}`} alt={user.username} className="imageDetails"/>
            ) : (
              <PersonIcon className="imageDetails"/>
            )}
            <h1>
                {user.username}
            </h1>
            <h2>
                {user.email}
            </h2>
            <h3>
               joined the site at {formattedDate}
            </h3>
        </Rows>
    </div>)
}