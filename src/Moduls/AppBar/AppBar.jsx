import { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import {
    Box, Toolbar, List, CssBaseline, Typography, Divider, IconButton,
    ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, MenuItem, Menu, MenuList, Paper
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ContentCut from '@mui/icons-material/ContentCut';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { AuthContext } from '../../App';
import { useQuery } from '@apollo/client';
import getPermissionUser from './AppBar.graphql';

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
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
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

const showIcons = (id) => {
    if (id === 1) {
        return <DashboardIcon />
    } else if (id === 2) {
        return <ViewListIcon />
    } else if (id === 3) {
        return <ViewColumnIcon />
    }
}

const AppBarProvider = ({ children }) => {
    // const theme = useTheme();
    const Auth = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [infoUser, setInfoUser] = useState();
    const [listMenu, setListMenu] = useState();
    const navigate = useNavigate();

    const handleOpenClose = () => {
        setOpen(!open);
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeTheme = () => {
        Auth.setThemeMode(!Auth.themeMode);
    }

    const handleCloseSesion = () => {
        handleClose();
        localStorage.clear();
        // navigate("/dashboard");
        // return <Navigate to="/login" replace />;
    }

    useEffect(() => {
        setInfoUser(Auth.Auth);
    }, [Auth?.Auth]);

    useQuery(getPermissionUser, {
        variables: {
            idUser: infoUser?.id,
        },
        onCompleted: (data) => {
            setListMenu(data.getPermissionUser);
        }
    });

    let activeStyle = {
        backgroundColor: "#8787973d",
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" elevation={0} sx={{
                background: !Auth.themeMode ? 'linear-gradient(90deg, rgba(47,41,149,1) 0%, rgba(24,24,150,1) 35%, rgba(0,212,255,1) 100%)' : ''
            }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleOpenClose}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img src='iconProject.png' width={28} style={{ marginRight: '12px', pointerEvents: 'none' }} loading="lazy" />
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Projects Software
                    </Typography>
                    <div>
                        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                            <Avatar alt={infoUser?.name || null} src="https://mui.com/static/images/avatar/2.jpg" />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleClose}>Theme</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                            <MenuList dense>
                                <MenuItem
                                    component={NavLink}
                                    to="/profile"
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem>
                                    <ListItemIcon>
                                        <SettingsIcon />
                                    </ListItemIcon>
                                    My account
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={changeTheme}>
                                    <ListItemIcon>
                                        {Auth.themeMode ? <LightModeIcon /> : <DarkModeIcon />}
                                    </ListItemIcon>
                                    Theme
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleCloseSesion}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} sx={{ borderRight: '1px solid #0000000d', borderRadius: 8 }}>
                <DrawerHeader />
                <List>
                    {listMenu && listMenu.map((item) => (
                        <ListItem key={item.herramienta.id} disablePadding sx={{ display: 'block', padding: '5px' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    borderRadius: '10px'
                                }}
                                component={NavLink}
                                to={item.herramienta.path}
                                style={({ isActive }) =>
                                    isActive ? activeStyle : undefined
                                }
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {
                                        showIcons(item.herramienta.id)
                                    }
                                </ListItemIcon>
                                <ListItemText primary={item.herramienta.nombre} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>

                    ))
                    }
                </List>
                {/* <Divider /> */}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}

export default AppBarProvider;