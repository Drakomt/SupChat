import { Rows } from "../../Layouts/Line/Line";
import { SearchBar } from "../SearchBar/SearchBar";
import { CardList } from "../Cards/CardList/CardList";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SideBarDropDown } from "./SideBarDropDown/SideBarDropDown";
import { useDispatch ,useSelector } from "react-redux";
import { Saparate } from "../../Layouts/Line/Line";
import "./SideBar.css";
import { logOut } from "../../../store/userSlice";
import { Button } from "../Button/Button";

export const SideBar = () => {
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const cardType = useSelector(state => state.SideBarDisplaySlice.cardType);
    const {data, isLoading, error} = useSelector(state => state.SideBarDisplaySlice);
    console.log('sidebar data: ',data);

const filteredList = data && data.filter((item) => {
    const userItem = item.username && item.username.toUpperCase().includes(searchTerm.toUpperCase());
    const chatItem = (item.messages && item.messages.some((message) => message.text.toUpperCase().includes(searchTerm.toUpperCase()))) || (item.name && !searchTerm); 

    return userItem || chatItem;
  });

  const logoutButtonClick = () => {
    dispatch(logOut());
    navigate("/login");
  }

    return (
        <div className="sideBar">
            <Rows>
                <Saparate>
                    <SideBarDropDown/>
                    <Button onClick={logoutButtonClick}>Logout</Button>
                </Saparate>    
                <SearchBar onSearch={setSearchTerm}/>
                { !isLoading && !error && <CardList items={data ? filteredList : data} cardType={cardType}/>}
            </Rows>
        </div>
    )
}
