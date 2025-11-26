import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemText from '@mui/material/ListItemText';


import home from '../assets/home.png';
import examination from '../assets/examination.png';
import medicalteam from '../assets/medical-team.svg';
import vr2 from '../assets/vr-glasses(1).svg';
import vr from '../assets/vr-glasses.png';
import settings from '../assets/settings.svg';
import logoutbtn from '../assets/logoutbtn.png';
import adminImg from '../assets/administrator-developer-icon.svg';
import { logout } from '../firebase/auth';
import logo from '../assets/OQ.png'
import cast from '../assets/cast.png'
import shc from '../assets/shc.png'

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 60,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuItems = [
  { title: 'Home', img: home },
  { title: 'Manage Patients', img: examination },
  { title: 'Therapy Schedules', img: shc },
  // { title: 'Manage Devices', img: vr2 },
  { title: 'Game Sessions', img: vr },
  // { title: 'Settings', img: settings },
  {title:'Cast',img:cast},
  { title: 'Logout', img: logoutbtn, action: logout },
];

const Navbar = ({ user, adminId, setPage, page }) => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <>
    
      <Box sx={{ display: 'flex' }}>
        <Drawer
    variant="permanent"
    open={open}
    sx={{
      '& .MuiDrawer-paper': {
        backgroundColor: 'var(--primary-color)',
        color: 'white'  // Optional: to make text/icons white
      }
    }}
  >
          <Box sx={{ display: 'flex',flexDirection:'column',gap:'50px', justifyContent: open ? 'flex-end' : 'center', p: 1 }}>
                    <img src={logo} alt="" width={'100%'} style={{filter:'brightness(100)'}}/>

            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
  
          <List>
            {menuItems.map((item, index) => (
              <Tooltip title={!open ? item.title : ''} placement="right" key={index}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => {
                      if (item.action) item.action();
                      else setPage(index);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '& img': {
                        filter: page === index ? 'invert(1)' : 'invert(0)',
                        backgroundColor: page === index ? 'black' : 'transparent',
                        padding: '4px',
                        borderRadius: '8px',
                        width: 30,
                        height: 30,
                        margin:'5px'
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={item.img} alt={item.title} />
                    </ListItemIcon>
  <ListItemText
    primary={item.title}
    primaryTypographyProps={{
      style: {
        color: 'white',
      },
    }}
    sx={{
      opacity: open ? 1 : 0,
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
    }}
  />
  
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
  
            {user === adminId && (
              <Tooltip title={!open ? 'Admin Settings' : ''} placement="right">
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => setPage(6)}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      backgroundColor: page === 6 ? 'white' : 'inherit',
                      '& img': {
                        filter: page === 6 ? 'invert(0)' : 'invert(1)',
                        backgroundColor: page === 6 ? 'white' : 'transparent',
                        padding: '4px',
                        borderRadius: '8px',
                        width: 24,
                        height: 24,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={adminImg} alt="Admin Settings" />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            )}
          </List>
        </Drawer>
      </Box>
      
    </>
  );
};

export default Navbar;
