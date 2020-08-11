import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import SideMenu from "./components/SideMenu";
import TopMenu from "./components/TopMenu";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { Snackbar } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { StoreState } from "./model/storeState";
import { connect } from "react-redux";
import { clearErrorMessage, logout } from "./actions/actions";
import { selectOrganizer } from "./actions/asyncActions";
import ContestList from "./components/contest/ContestList";
import ContestInfo from "./components/contest/ContestInfo";
import ColorList from "./components/color/ColorList";
import SeriesList from "./components/series/SeriesList";
import { User } from "./model/user";
import { Organizer } from "./model/organizer";
import WelcomeView from "./components/WelcomeView";
import OrganizerList from "./components/organizer/OrganizerList";
import LocationList from "./components/location/LocationList";
import { getSelectedOrganizer } from "src/selectors/selector";
import MainLayout from "./components/MainLayout";
import Alert from "@material-ui/lab/Alert";

export interface Props {
  isLoggedIn: boolean;
  errorMessage?: string;
  clearErrorMessage?: () => void;
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5f524a",
    },
    secondary: {
      main: "#eb0708",
    },
  },
});

const App = (props: Props) => {
  const handleClose = (event: any, reason?: any) => {
    props.clearErrorMessage!!();
  };

  return (
    <Router>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiThemeProvider theme={theme}>
          {props.isLoggedIn ? (
            <>
              <MainLayout />
              <Snackbar
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                style={{ bottom: 15 }}
                open={props.errorMessage != undefined}
                autoHideDuration={6000}
                onClose={handleClose}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={handleClose}
                  >
                    <Close />
                  </IconButton>,
                ]}
              >
                <Alert onClose={handleClose} severity="error">
                  {props.errorMessage}
                </Alert>
              </Snackbar>
            </>
          ) : (
            <WelcomeView />
          )}
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    </Router>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {
    errorMessage: state.errorMessage,
    isLoggedIn: state.loggedInUser != undefined,
  };
}

const mapDispatchToProps = {
  clearErrorMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
