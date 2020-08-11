import React, { useEffect } from "react";
import {
  Button,
  InputLabel,
  StyledComponentProps,
  Box,
  Hidden,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import { RouteComponentProps, withRouter } from "react-router";
import * as qs from "qs";
import CircularProgress from "@material-ui/core/CircularProgress";
import { User } from "../model/user";
import { Organizer } from "../model/organizer";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { connect } from "react-redux";
import { login, selectOrganizer } from "../actions/asyncActions";
import { logout } from "../actions/actions";
import { getSelectedOrganizer } from "src/selectors/selector";
import { StoreState } from "../model/storeState";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";

export interface Props {
  loggingIn: boolean;
  loggedInUser?: User;
  organizers?: Organizer[];
  selectedOrganizer?: Organizer;

  logout?: () => void;
  selectOrganizer?: (organizerId: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authControl: {
      marginLeft: "auto",
    },
    adminLabel: {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  })
);

const TopMenu = (props: Props & RouteComponentProps & StyledComponentProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const onOrganizerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    let organizer = props.organizers!.find((o) => o.id == id)!;
    props.selectOrganizer?.(organizer.id!);
  };

  const logout = () => {
    localStorage.removeItem("credentials");
    props.logout!();
  };

  const loggingIn = props.loggingIn;
  const loggedInUser = props.loggedInUser;
  const organizers = props.organizers;
  return (
    <>
      <Hidden smDown implementation="css">
        {organizers && organizers.length > 1 && (
          <FormControl
            variant="outlined"
            style={{ minWidth: 200 }}
            size="small"
          >
            {props.selectedOrganizer != undefined && (
              <Select
                id="series-select"
                value={props.selectedOrganizer.id}
                onChange={onOrganizerChange}
                style={{ color: theme.palette.primary.contrastText }}
              >
                {organizers!.map((organizer) => (
                  <MenuItem key={organizer.id} value={organizer.id}>
                    {organizer.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        )}
      </Hidden>

      <div className={classes.authControl}>
        {loggingIn && <CircularProgress size={20} style={{ color: "white" }} />}
        {loggedInUser && (
          <div>
            {loggedInUser.name}
            {loggedInUser.admin && (
              <Chip
                className={classes.adminLabel}
                icon={<AccountCircleIcon />}
                label="Admin"
                color="secondary"
                size="small"
              />
            )}
            <Button variant="contained" onClick={logout} size="small">
              <ExitToAppIcon /> Logout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    loggingIn: state.loggingIn,
    loggedInUser: state.loggedInUser,
    organizers: state.organizers,
    selectedOrganizer: getSelectedOrganizer(state),
  };
}

const mapDispatchToProps = {
  login,
  logout,
  selectOrganizer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopMenu));
