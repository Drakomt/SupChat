import { Menu, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const DropDown = ({ options, actions, Icon }) => {
  const menuList = [];
  for (let i = 0; i < options.length; i++) {
    menuList.push(
      <MenuItem
        key={i}
        onClick={(event) => {
          handleClose(event);
          actions[i]();
        }}
      >
        {options[i]}
      </MenuItem>
    );
  }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuList}
      </Menu>
    </div>
    // <Menu {...bindMenu(popupState)}>
    //     {menuList}
    // </Menu>
  );
};
