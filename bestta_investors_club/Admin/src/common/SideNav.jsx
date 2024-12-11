import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";
// import Link from '@mui/material';
// import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileInfoCard from "./ProfileMenu";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
// import NotificationCard from './NotificationCard';
import Link from "@mui/material/Link";
// import '../App.css'

import { Icon } from "@mui/material";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";

import StorefrontIcon from "@mui/icons-material/Storefront";
import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SellIcon from "@mui/icons-material/Sell";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import GroupsIcon from "@mui/icons-material/Groups";

import logo from '../assets/besstalogo.png'

const drawerWidth = 270;

// open Drawer func
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  // backgroundColor:"#F9B233",
  // backgroundColor:"#13375b",
  backgroundColor: "#c5e2f9",
  "&::-webkit-scrollbar": {
    width: "0px", // This hides the scrollbar
  },
});

// closed Drawer Func ---

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",

  // backgroundColor:"#F9B233",
  // backgroundColor:"#13375b",
  backgroundColor: "#c5e2f9",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down("md")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
    display: "none",
  },
  "&::-webkit-scrollbar": {
    width: "0px", // This hides the scrollbar
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,

  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [showCard, setShowCard] = React.useState(false);
  // const [showNotificationCard ,setNotificationCard] = React.useState(false

  const handleDrawerOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const handleProfileCard = () => {

    if (showNotificationCard) {
      setNotificationCard((prevState) => !prevState);
    }
    setShowCard((prevState) => !prevState);
  };
  const [showNotificationCard, setNotificationCard] = React.useState(false);
  const handleNotificationCard = () => {
   
    if (showCard) {
      setShowCard((prevState) => !prevState);
    }
    setNotificationCard((prevState) => {
      return !prevState;
    });
    // console.log(showNotificationCard)
  };

  function SideNavLinks(props) {
    const [isOpenCoachDropBtn, setOpenCoachDropBtn] = React.useState(false);

    const onClickCoachDropDown = () => {
      setOpenCoachDropBtn((prevState) => !prevState);
    };

    return (
      <Box>
        {open ? (
          <NavLink
            style={{ "text-decoration": "none", color: "#000" }}
            to={props.paths}
          >
            <List onClick={onClickCoachDropDown}>
              {/* <Link  style = {{"text-decoration":"none",color:"#d9d9d9"}}> */}
              <ListItem
                key={props.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      sx={{
                        color: "#000",
                        paddingBottom: "10px",
                        marginBottom: "5px",
                      }}
                    >
                      {props.iconText}
                    </Icon>
                    {/* <img src = "https://webmobrilmedia.com/scouthub/v2/assets/img/baseball.svg" alt = "base-ball" style = {{height:"25px"}}/> */}
                  </ListItemIcon>
                  <ListItemText
                    primary={props.text}
                    sx={{ color: "#000", opacity: open ? 1 : 0 }}
                  />
                  {/* {props.isAvailable && <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
         
          
          </ListItemIcon>} */}
                </ListItemButton>
              </ListItem>
              {/* </Link> */}
            </List>
          </NavLink>
        ) : (
          <Tooltip
            leaveDelay={2}
            PopperProps={{
              sx: {
                whiteSpace: "pre-line",
                "background-color": "#c5e2f9",
                // "& .MuiTooltip-arrow": {
                //   top: "-10px !important",
                //   "&::before": {
                //     backgroundColor: "blue",
                //   },
                // },
                "& .MuiTooltip-tooltip": {
                  backgroundColor: "#c5e2f9",
                },
              },
            }}
            placement="right"
            title={
              <NavLink
                to={props.paths}
                style={{
                  "text-decoration": "none",
                  "font-size": "15px",
                  "font-weight": 700,
                  color: "#000",
                }}
              >
                {props.text}
              </NavLink>
            }
          >
            <div
              style={{
                height: "75px",
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
              }}
            >
              {/* <img src = "https://webmobrilmedia.com/scouthub/v2/assets/img/baseball.svg" alt = "base-ball" style = {{height:"25px"}}/> */}
              <Icon
                sx={{
                  color: "#000",
                  paddingBottom: "10px",
                  marginBottom: "5px",
                }}
              >
                {props.iconText}
              </Icon>
            </div>
          </Tooltip>
        )}

        <Divider />
      </Box>
    );
  }

  function SideWithDropDown(props) {
    // console.log(props)
    const [isOpenCoachDropBtns, setOpenCoachDropBtns] = React.useState(false);
    const [isHovered, setHovered] = React.useState(false);

    const onClickCoachDropDown = () => {
      setOpenCoachDropBtns((prevState) => !prevState);
    };

    const onHovered = () => {
      setHovered((prevState) => prevState);
    };

    const unHonoured = () => {
      setHovered((prevState) => prevState);
    };
    const { iconText } = props;

    return open ? (
      <List onClick={onClickCoachDropDown}>
        <ListItem key="CCCCCC" disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              alignItems: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <Icon
                sx={{
                  color: "#000",
                  paddingBottom: "10px",
                  marginBottom: "5px",
                }}
              >
                {iconText}
              </Icon>
            </ListItemIcon>
            <ListItemText
              primary={props.text}
              sx={{
                opacity: open ? 1 : 0,
                color: "#000",
                textDecoration: "none",
              }}
            />
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {isOpenCoachDropBtns ? (
                <ExpandLessIcon sx={{ color: "#000" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "#000" }} />
              )}
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {isOpenCoachDropBtns &&
          props.data.map((each) => {
            return (
              <NavLink to={`${each.paths}`}>
                <ListItem
                  key={each.name}
                  sx={{ margin: "0px", padding: "0px", paddingLeft: "40px" }}
                >
                  <ListItemButton
                    sx={{
                      // minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "30px" }}>
                      <FontAwesomeIcon
                        onMouseEnter={onHovered}
                        onMouseLeave={unHonoured}
                        icon={faHandPointRight}
                        style={{
                          color: isHovered ? "#000" : "#000",
                          "padding-right": isHovered ? "5px" : "15px",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={each.name}
                      sx={{ opacity: open ? 1 : 0, color: "#000" }}
                    />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            );
          })}
      </List>
    ) : (
      <Tooltip
        leaveDelay={10}
        placement="right"
        PopperProps={{
          sx: {
            whiteSpace: "pre-line",
            margin: "0px",
            padding: "0px",
            "background-color": "#c5e2f9",

            "& .MuiTooltip-tooltip": {
              backgroundColor: "#c5e2f9",
              height: "40px",
              width: "200px",
              borderRadius: "10px",
            },
          },
        }}
        title={
          <div>
            {/* <h2 style = {{color:"orange",margin:"0px",padding:"0px","text-align":"center",backgroundColor:"#000"}}>{props.text}</h2> */}
            <div
              style={{
                "background-color": "#c5e2f9",
                margin: "0px",
                paddingLeft: "20px",
                width: "194px",
                paddingBottom: "10px",
              }}
            >
              <NavLink
                onMouseEnter={onHovered}
                onMouseLeave={unHonoured}
                style={{
                  "text-decoration": "none",
                  width: "130px",
                  color: isHovered ? "#000" : "#000",
                  "font-size": "13px",
                  "font-weight": 600,
                }}
                to={`${props.data[0].paths}`}
              >
                <p>
                  <FontAwesomeIcon
                    icon={faHandPointRight}
                    style={{
                      "padding-right": isHovered ? "9px" : "15px",
                      color: isHovered ? "#000" : "#000",
                    }}
                  />
                  {props.data[0].name}
                </p>
              </NavLink>
              <NavLink
                onMouseEnter={onHovered}
                onMouseLeave={unHonoured}
                style={{
                  "text-decoration": "none",
                  width: "130px",
                  color: isHovered ? "#000" : "#000",
                  "font-size": "13px",
                }}
                to={`${props.data[1].paths}`}
              >
                <p>
                  <FontAwesomeIcon
                    icon={faHandPointRight}
                    style={{
                      color: isHovered ? "#000" : "#000",
                      "padding-right": isHovered ? "5px" : "15px",
                    }}
                  />
                  {props.data[1].name}
                </p>
              </NavLink>
            </div>
          </div>
        }
      >
        <div
          style={{
            height: "75px",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
          }}
        >
          {/* <img src = "https://webmobrilmedia.com/scouthub/v2/assets/img/baseball.svg" alt = "base-ball" style = {{height:"25px"}}/>
           */}
          <Icon
            sx={{ color: "#000", paddingBottom: "10px", marginBottom: "5px" }}
          >
            {iconText}
          </Icon>
        </div>
      </Tooltip>
    );
  }

  const isMediumScreen = useMediaQuery("(max-width:900px)");

  const navWidth =
    isMediumScreen && !open
      ? "100%"
      : open
      ? `calc(100% - ${drawerWidth}px)`
      : `calc(100% - ${theme.spacing(7)} + 1px)`;
  return (
    <Box>
      <CssBaseline />
      <AppBar
        // open={open}
        // sx={{ width: navWidth, backgroundColor: "#f0f8ff}", zIndex: -1 ,position:"absolute"}}
        open={open} sx = {{width:navWidth,
          backgroundColor:"#f0f8ff",zIndex:1,
         }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: "56px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
            }}
          >
            <MenuIcon sx={{ color: "#000000" }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: "blue",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <NotificationsNoneIcon
              onClick={handleNotificationCard}
              sx={{ marginRight: "30px", fontSize: "24px", color: "#000" }}
            />
            <AccountCircleIcon
              onClick={handleProfileCard}
              sx={{ color: "#000000", fontSize: "30px", alignSelf: "flex-end" }}
            />
          </Typography>
        </Toolbar>
      </AppBar>
      {showCard && <ProfileInfoCard open={showCard} />}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ display: "flex", "justify-content": "center" }}>
          <NavLink to="/bestta-admin/">
            {/* {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
            <img src = {logo} alt = "logo" height = "35px"/>
          </NavLink>
        </DrawerHeader>
        <Divider />
        <Box>
          <Divider />
          {/* <SideWithDropDown text = "Reports"  
            data = { [ {
              name:"Team Data",
              path:"/panel/reports/teamdata"
          },
          {
            name:"Generate Reports",
            path:"/panel/reports/generatereports"
          }
        ]} 
            /> */}
          {/* <Divider /> */}
          <SideNavLinks
            text="Dashboard"
            paths="/bestta-admin"
            iconText={<DashboardIcon />}
          />
          <SideNavLinks
            text="Users"
            paths="/bestta-admin/users"
            iconText={<PeopleOutlinedIcon />}
          />
          <SideWithDropDown
            text="Store"
            iconText={<StorefrontIcon />}
            data={[
              {
                name: "Product Categories",
                paths: "/bestta-admin/productcategories",
              },
              {
                name: "Products",
                paths: "/bestta-admin/products",
              },
            ]}
          />
          <Divider />
          <SideWithDropDown
            text="Course"
            iconText={<LaptopChromebookIcon />}
            data={[
              {
                name: "Course Categories",
                paths: "/bestta-admin/coursecategories",
              },
              {
                name: "Courses",
                paths: "/bestta-admin/coaching_videos",
              },
            ]}
          />
          <Divider />
          <SideWithDropDown
            text="Plans"
            iconText={<SubscriptionsIcon />}
            data={[
              {
                name: "Plan Categories",
                paths: "/bestta-admin/plan_categories",
              },
              {
                name: "Plans",
                paths: "/bestta-admin/plans",
              },
            ]}
          />
          <Divider />

          {/* <SideNavLinks text = "Product Categories"  paths = "/productcategories" /> */}

          <SideNavLinks
            text="Coupons"
            paths="/bestta-admin/coupons"
            iconText={<ConfirmationNumberIcon />}
          />
          <SideNavLinks
            text="Events"
            paths="/bestta-admin/events"
            iconText={<EmojiEventsOutlinedIcon />}
          />
          {/* <SideNavLinks
            text="Prizes"
            paths="/bestta-admin/prizes"
            iconText={<EmojiEventsIcon />}
          /> */}
          {/* <SideNavLinks  text = "Content Management" paths = "/contents"  iconText ={<PolicyOutlinedIcon/>}/> */}

          <SideNavLinks
            text="Orders"
            paths="/bestta-admin/orders"
            iconText={<SellIcon />}
          />

          <SideWithDropDown
            text="Contents"
            iconText={<PolicyOutlinedIcon />}
            data={[
              {
                name: "Privacy Policy",
                paths: "/bestta-admin/privacypolicy",
              },
              {
                name: "Terms and Conditions",
                paths: "/bestta-admin/termsandcondition",
              },
              {
                name: "Members Terms And Condition",
                paths: "/bestta-admin/membershiptermsandcondition",
              }
            ]}
          />
          <Divider />
          <SideNavLinks
            text="About US"
            paths="/bestta-admin/aboutus"
            iconText={<GroupsIcon />}
          />
        </Box>
      </Drawer>
    </Box>
  );
}
