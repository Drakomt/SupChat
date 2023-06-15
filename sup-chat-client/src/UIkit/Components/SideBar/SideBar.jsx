import { Rows } from "../../Layouts/Line/Line";
import { SearchBar } from "../SearchBar/SearchBar";
import { CardList } from "../Cards/CardList/CardList";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SideBarDropDown } from "./SideBarDropDown/SideBarDropDown";
import { useDispatch, useSelector } from "react-redux";
import { Saparate } from "../../Layouts/Line/Line";
import { logOut } from "../../../store/userSlice";
import { Button } from "../Button/Button";
import { fetchUsers } from "../../../store/sideBarDisplaySlice";
import LogoutIcon from "@mui/icons-material/Logout";
import "./SideBar.css";

const hasTerm = (string, subString) => {
  return string.toUpperCase().includes(subString.toUpperCase());
}
const filterItem = (item, text) => {
  return checkTextFieldsAny(item, text) || checkStringArrays(item, text);
}

function checkStringArrays(item, text) {
  if (!text) return true;
  let found = false;
  const arrays = Object.values(item).filter((v) => Array.isArray(v) && v);
  arrays.forEach((array) => {
    array.forEach((v) => {
      if (checkTextFieldsAll(v, text)) {
        found = true;
        return;
      }
      if (found) return;
    });
  });
  return found;
}

function checkTextFieldsAny(item, text) {
  if (!text) return true;
  const keyWords = text
    .trim()
    .split(" ")
    .filter((word) => word !== " " && word !== "");
  const stringValues = Object.values(item).filter((v) => typeof v == "string");
  let found = false;
  stringValues.forEach((v) => {
    keyWords.forEach((word) => {
      if (hasTerm(v, word)) {
        found = true;
        return;
      }
      if (found) return;
    });
  });
  return found;
}

function checkTextFieldsAll(item, text) {
  if (!text) return true;
  const stringValues = Object.values(item).filter((v) => typeof v == "string");
  let found = false;
  stringValues.forEach((v) => {
      if (hasTerm(v, text)) {
        found = true;
        return;
      }
  });
  return found;
}

export const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const cardType = useSelector((state) => state.SideBarDisplaySlice.cardType);
  const { data, isLoading, error, reFetch } = useSelector(
    (state) => state.SideBarDisplaySlice
  );
  const user = useSelector(state => state.userSlice.user);
  const filteredList =
    data && data.filter((item) => filterItem(item, searchTerm));

  const logoutButtonClick = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const onSearch = (text) => {
    if(reFetch) { 
      dispatch(fetchUsers({user, text:text || '..................'}));
    }
    setSearchTerm(text);
  }

  return (
    <div className="sideBar">
      <Rows>
          <Saparate sticky>
            <SideBarDropDown searchTerm={searchTerm}/>
            <Button onClick={logoutButtonClick} className={"logout"}>
              <LogoutIcon/>
            </Button>
          </Saparate>
          <SearchBar onSearch={onSearch} className={"sticky"}/>
        {!isLoading && !error && (
          <CardList items={data ? filteredList : data} cardType={cardType} />
        )}
      </Rows>
    </div>
  );
};
