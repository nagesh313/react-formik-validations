import { Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ExitToApp } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    grow: {
      flexGrow: 1,
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    sectionDesktop: {
      display: "flex",
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export function NavbarComponent(props: Props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const history = useHistory();
  function navigateToDashboard() {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    history.push("/dashboard");
  }
  function navigateToCreateNewOrder() {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    history.push("/createOrder");
  }
  function navigateToCreateRetailer() {
    history.push("/create-retailer");
  }

  const logout = () => {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    sessionStorage.removeItem("user");
    history.push("/");
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem
          button
          key={"Dashboard"}
          onClick={() => {
            navigateToDashboard();
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={"Dashboard"} />
        </ListItem>
        <ListItem
          button
          key={"Create"}
          onClick={() => {
            navigateToCreateNewOrder();
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={"Create"} />
        </ListItem>
        <ListItem
          button
          key={"Create"}
          onClick={() => {
            navigateToCreateRetailer();
            handleDrawerToggle();
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={"Create Retailer"} />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="static" style={{ marginBottom: "40px" }}>
          <Toolbar variant="dense">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              color="inherit"
              style={{ cursor: "pointer" }}
              onClick={navigateToDashboard}
            >
              Hustler
            </Typography>
            <Hidden xsDown implementation="css">
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  borderColor: "white",
                }}
                onClick={navigateToDashboard}
              >
                Dashboard
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  borderColor: "white",
                }}
                onClick={navigateToCreateNewOrder}
              >
                Create
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="outlined"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  borderColor: "white",
                }}
                onClick={navigateToCreateRetailer}
              >
                Create Retailer
              </Button>
            </Hidden>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={logout}
                color="inherit"
              >
                <ExitToApp></ExitToApp>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <Hidden smUp implementation="css">
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
        </Hidden>
      </div>
    </React.Fragment>
  );
}
