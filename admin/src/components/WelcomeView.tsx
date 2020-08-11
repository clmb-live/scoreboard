import React, { useEffect } from "react";
import {
  Theme,
  Toolbar,
  Button,
  Paper,
  Typography,
  Grid,
} from "@material-ui/core";
import { connect } from "react-redux";
import { StoreState } from "../model/storeState";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles, createStyles, useTheme } from "@material-ui/core/styles";
import { RouteComponentProps, withRouter } from "react-router";
import * as qs from "qs";
import { login } from "../actions/asyncActions";

interface Props {
  login?: (code: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      backgroundColor: theme.palette.primary.dark,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    buttons: {
      marginLeft: "auto",
    },
    gridLine: {
      display: "flex",
    },
    screenshotContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    screenshot: {
      width: 500,
    },
    gridText: {
      padding: 10,
      flexBasis: 0,
      flexGrow: 1,
      flexShrink: 1,
    },
    paragraph: {
      marginBottom: 10,
    },
    gradient: {
      background: `linear-gradient(5deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%);`,
      //backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      height: "20rem",
      textAlign: "center",
      width: "100%",
      padding: "2rem 0",
    },
  })
);

const WelcomeView = (props: Props & RouteComponentProps) => {
  useEffect(() => {
    let query = qs.parse(props.location.hash, {
      ignoreQueryPrefix: true,
    });
    let credentials = query.access_token;

    if (credentials) {
      props.login!(credentials);
      props.history.push("/contests");
    } else {
      credentials = localStorage.getItem("credentials");

      if (credentials != null) {
        props.login!(credentials);
      }
    }
  }, []);

  const classes = useStyles();
  const theme = useTheme();

  const getUrl = (command: string) => {
    let url = "https://clmb.auth.eu-west-1.amazoncognito.com/";
    url += command;
    // Response type token or code
    url +=
      "?response_type=token&client_id=55s3rmvp8t26lmi0898n9d1lfn&redirect_uri=";
    url += encodeURIComponent(window.location.origin);
    return url;
  };

  const login = () => {
    window.location.href = getUrl("login");
  };

  const signup = () => {
    window.location.href = getUrl("signup");
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={login}
              style={{ marginRight: "0.4rem" }}
            >
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={signup}>
              Sign up
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
      <Grid container>
        <Grid item className={classes.gradient}>
          <Typography variant="h3">Welcome to ClimbLive™</Typography>
          <Typography variant="subtitle1">
            Bouldering contests made easy!
          </Typography>
          <blockquote>
            ClimbLive is targeting small boulder contests, where the contenders
            keep track of their results by themselves. Normally this is made
            with scoreboards on paper, but now you can replace or combine it
            with a web page.
            <br />
            Create your own contests easily in a web frontend. Please sign up
            above to try it out. It's completely free, and we have no plans to
            change it.
          </blockquote>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={signup}
            style={{ marginTop: "1rem" }}
          >
            Get started
          </Button>
        </Grid>

        <Grid
          item
          style={{
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            height: "100%",
            textAlign: "center",
            width: "100%",
            paddingTop: "1rem",
          }}
        >
          <Grid container direction="row">
            <Grid item xs={6} spacing={3} style={{ padding: "3rem" }}>
              <Grid container direction="row">
                <Grid item xs={6}>
                  <div className={classes.screenshotContainer}>
                    <img
                      className={classes.screenshot}
                      src="/screens/pixel_portrait_scorecard.png"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  No calculations required by the contenders, and the results
                  are available directly when the contest ends.
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} spacing={3} style={{ padding: "3rem" }}>
              <Grid container direction="row">
                <Grid item xs={6}>
                  <div className={classes.screenshotContainer}>
                    <img
                      className={classes.screenshot}
                      src="/screens/pixel_portrait_scoreboard.png"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  You get live results during the contests, with instant updates
                  when contenders reports progress. Easier to follow for
                  spectators, and more exciting for the contenders. People can
                  even follow contests remotely!
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/*
        <div style={{ flexBasis: 0, flexGrow: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 600, margin: "20px auto" }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              

              
            </div>
            <div className={classes!.gridLine}>
              <div className={classes!.gridText}></div>
              
            </div>
            <div className={classes!.gridLine}>
              
              <div className={classes!.gridText}>
                <div className={classes!.paragraph}>
                  
                </div>
                <div className={classes!.paragraph}>
                  
                </div>
              </div>
            </div>
            <div className={classes!.gridLine}>
              <div className={classes!.gridText}>
                <div className={classes!.paragraph}>
                  
                </div>
                <div className={classes!.paragraph}>
                  
                </div>
              </div>
            </div>
            <div className={classes!.gridLine}>
              <div className={classes!.gridText}>
                <div className={classes!.paragraph}>
                  
                </div>
                <div className={classes!.paragraph}>
                  
                </div>
              </div>
            </div>
          </div>
            </div>*/}
    </>
  );
};

export function mapStateToProps(state: StoreState, props: any): Props {
  return {};
}

const mapDispatchToProps = {
  login,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WelcomeView));
