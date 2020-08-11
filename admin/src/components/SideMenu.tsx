import * as React from "react";
import { Link } from "react-router-dom";
import { Palette, TableChart } from "@material-ui/icons";
import { Divider, Typography } from "@material-ui/core";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import { User } from "../model/user";
import { Environment } from "src/environment";
import HomeIcon from "@material-ui/icons/Home";
import ExploreIcon from "@material-ui/icons/Explore";
import PeopleIcon from "@material-ui/icons/People";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import { StoreState } from "../model/storeState";
import Chip from "@material-ui/core/Chip";

export interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    menuItem: {
      color: theme.palette.primary.contrastText,
    },
  })
);

const items = [
  {
    name: "Contests",
    icon: <TableChart />,
    path: "/contests",
  },
  {
    name: "Colors",
    icon: <Palette />,
    path: "/colors",
    divider: true,
  },
  {
    name: "Locations",
    icon: <ExploreIcon />,
    path: "/locations",
  },
  {
    name: "Organizers",
    icon: <PeopleIcon />,
    path: "/organizers",
  },
  {
    name: "Series",
    icon: <LibraryBooksIcon />,
    path: "/series",
  },
];

function SideMenu(props: Props) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.toolbar}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            style={{
              width: 65,
            }}
            src="/clmb_MainLogo_NoShadow.png"
          />
        </div>
      </div>
      <Divider />
      <List>
        {items.map(({ name, icon, path, divider }) => {
          return (
            <React.Fragment key={path}>
              <ListItem
                button
                component={Link}
                to={path}
                className={classes.menuItem}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
              {divider && <Divider />}
            </React.Fragment>
          );
        })}
      </List>

      <div style={{ margin: "auto 10px 20px 10px", textAlign: "center" }}>
        <div>Questions, requests or just want to chat?</div>
        <div style={{ marginTop: 5 }}>
          Please{" "}
          <a target={"_NEW"} href={"https://www.facebook.com/CLMB.live"}>
            <u>click here</u>
          </a>{" "}
          to visit us on Facebook
        </div>
        <Chip
          style={{ marginTop: "1rem" }}
          label={`v.${Environment.projectVersion}`}
          color="primary"
          size="small"
        />
      </div>
    </>
  );
}

export function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
