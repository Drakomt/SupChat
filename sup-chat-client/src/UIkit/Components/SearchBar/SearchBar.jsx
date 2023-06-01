import { Line } from "../../Layouts/Line/Line";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input/Input";
import SearchIcon from "@mui/icons-material/Search";
import "./SearchBar.css";
import React, { useState } from "react";

export const SearchBar = ({ onSearch }) => {
  const [text, setText] = useState("");
  return (
    <div className="searchBar">
          <Line>
            <Input onTextChange={setText} placeholder={"Search..."} name={"search"} className={"searchInput"}/>
            <Button onClick={() => onSearch(text)} className={"searchBtn"}>
              <SearchIcon/>
            </Button>
          </Line>
    </div>
  );
};