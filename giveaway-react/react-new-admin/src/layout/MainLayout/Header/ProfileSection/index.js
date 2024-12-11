import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// third-party
// import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'components/ui-component/cards/MainCard';
import Transitions from 'components/ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import useAuth from 'hooks/useAuth';
import useConfig from 'hooks/useConfig';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useSelector, dispatch } from 'store';
import { LogoutSuccess } from 'store/slices/auth';

const User1 = '/assets/images/users/user-round.svg';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const auth = useSelector((state) => state.auth);
  const theme = useTheme();
  const router = useRouter();
  const { borderRadius } = useConfig();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('admin');
  const [data, setData] = useState({ name: '', profile: '' });
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const cookieValue = `${encodeURIComponent(value)} ; expires=  ${expirationDate.toUTCString()} + ; path=/`;

    document.cookie = `${name} = ${cookieValue}`;
  }
  const handleLogout = async () => {
    try {
      // await logout();
      // setCookie('companyToken', undefined, 0);
      setCookie('adminToken', undefined, 0);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('profile');
      dispatch(LogoutSuccess());
      // eslint-disable-next-line no-restricted-globals
      location.reload();

      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListItemClick = (event, index, url) => {
    // setSelectedIndex(index);
    handleClose(event);
    router.push(url);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('role');
      setRole(name);
    }
    const profileDisplay = auth?.profile;
    const nameDisplay = auth?.name;
    setData({ ...data, name: nameDisplay, profile: profileDisplay });
  }, [auth]);
  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={data?.profile}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
            alt="user images"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h4">Welcome,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {data?.name}
                          </Typography>
                        </Stack>
                        {/* <Typography variant="subtitle2">Project {role}</Typography> */}
                      </Stack>
                      {/* <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" color={theme.palette.grey[500]} />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{
                          'aria-label': 'weight'
                        }}
                      /> */}
                      <Divider />
                    </Box>
                    <div style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        {/* <UpgradePlanCard /> */}
                        {/* <Divider /> */}
                        {/* <Card
                          sx={{
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
                            my: 2
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={3} direction="column">
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Start DND Mode</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      color="primary"
                                      checked={sdm}
                                      onChange={(e) => setSdm(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Allow Notifications</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      checked={notification}
                                      onChange={(e) => setNotification(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card> */}
                        <Divider />
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 300,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '10px',
                            [theme.breakpoints.down('md')]: {
                              minWidth: '100%'
                            },
                            '& .MuiListItemButton-root': {
                              mt: 0.5
                            }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0, `/${role}/profile`)}
                          >
                            <ListItemIcon>
                              <IconSettings stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Change Password</Typography>} />
                          </ListItemButton>
                          {/* <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 0, `/${role}/profile`)}
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Grid container spacing={1} justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="body2">
                                      <FormattedMessage id="change-password" />
                                    </Typography>
                                  </Grid>
                                </Grid>
                              }
                            />
                          </ListItemButton> */}
                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4} onClick={handleLogout}>
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                          </ListItemButton>
                        </List>
                      </Box>
                    </div>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
