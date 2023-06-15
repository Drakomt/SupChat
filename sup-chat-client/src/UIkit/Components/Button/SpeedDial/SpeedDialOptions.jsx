import React, { useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import SidebarIcon from '@mui/icons-material/ViewSidebar';
import { SpeedDialIcon } from '@mui/material';

export const SpeedDialOptions = ({ setView }) => {
    const [open, setOpen] = useState(false);

    const actions = [
        { icon: <ChatIcon />, name: 'New Chat', view: 'addChat' },
        { icon: <PersonIcon />, name: 'Profile', view: 'profile' },
        { icon: <SidebarIcon />, name: 'Sidebar', view: 'sidebar' },
    ];

    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const handleClick = (view) => {
        setView(view);
        handleClose();
    }

    return (
      <SpeedDial
        ariaLabel="SpeedDial"
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        sx={{ position: "absolute", bottom: "5%", left: "5%" }}
        icon={<SpeedDialIcon/>}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleClick(action.view)}
          />
        ))}
      </SpeedDial>
    );
};