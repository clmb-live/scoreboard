import { InputLabel, TextField, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import LockIcon from "@material-ui/icons/Lock";
import SaveIcon from "@material-ui/icons/Save";
import Alert from "@material-ui/lab/Alert";
import { saveAs } from "file-saver";
import { OrderedMap } from "immutable";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { CompClass } from "src/model/compClass";
import { ContenderData } from "src/model/contenderData";
import { Organizer } from "src/model/organizer";
import { Problem } from "src/model/problem";
import { Api } from "src/utils/Api";
import { setErrorMessage, setTitle } from "../../actions/actions";
import {
  deleteContest,
  loadContest,
  reloadLocations,
  reloadSeries,
  saveContest,
} from "../../actions/asyncActions";
import { Environment } from "../../environment";
import { CompLocation } from "../../model/compLocation";
import { Contest } from "../../model/contest";
import { Series } from "../../model/series";
import { StoreState } from "../../model/storeState";
import { getSelectedOrganizer } from "../../selectors/selector";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { CreatePdfDialog } from "../CreatePdfDialog";
import { ProgressButton } from "../ProgressButton";
import RichTextEditor from "../RichTextEditor";

interface Props {
  contestId?: number;
  contests?: OrderedMap<number, Contest>;
  series?: OrderedMap<number, Series>;
  locations?: OrderedMap<number, CompLocation>;
  selectedOrganizer?: Organizer;
  problems?: OrderedMap<number, Problem>;
  compClasses?: OrderedMap<number, CompClass>;
  contenders?: OrderedMap<number, ContenderData>;
  loading?: boolean;
  setTitle?: (title: string) => void;
  saveContest?: (contest: Contest) => Promise<Contest>;
  deleteContest?: (contest: Contest) => Promise<void>;
  loadLocations?: () => Promise<void>;
  loadSeries?: () => Promise<void>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      margin: theme.spacing(2, 0),
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
    inputFields: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

const ContestEdit = (props: Props & RouteComponentProps) => {
  let [saving, setSaving] = useState<boolean>(false);
  let [deleting, setDeleting] = useState<boolean>(false);
  let [compilingPdf, setCompilingPdf] = useState<boolean>(false);
  let [showPopup, setShowPopup] = useState<boolean>(false);
  let [requestingDelete, setRequestingDelete] = useState<boolean>(false);
  let [contest, setContest] = useState<Contest>({
    organizerId: props.selectedOrganizer?.id!,
    protected: false,
    name: "",
    description: "",
    finalEnabled: true,
    qualifyingProblems: 10,
    finalists: 5,
    rules: "",
    gracePeriod: 15,
  });

  useEffect(() => {
    if (props.locations === undefined) {
      props.loadLocations?.();
    }
    if (props.series === undefined) {
      props.loadSeries?.();
    }
  }, [props.series, props.locations, props.loadLocations, props.loadSeries]);

  useEffect(() => {
    if (props.contestId !== undefined) {
      let contest = props.contests?.get(props.contestId);
      if (contest !== undefined) {
        setContest(contest);
      }
    }
  }, [props.contestId, props.contests]);

  useEffect(() => {
    let title = contest?.id === undefined ? "Add contest" : contest.name;
    props.setTitle?.(title);
  }, [contest, props.setTitle]);

  const classes = useStyles();
  const theme = useTheme();

  const contestIssues = useMemo(() => {
    let issues: any[] = [];

    if (props.loading || contest.id === undefined) {
      return issues;
    }

    if ((props.problems?.size ?? 0) === 0) {
      issues.push({
        description: "Please add problems",
        link: `/contests/${props.contestId}/problems`,
      });
    }
    if ((props.compClasses?.size ?? 0) === 0) {
      issues.push({
        description: "Please add at least one competition class",
        link: `/contests/${props.contestId}/classes`,
      });
    }
    if ((props.contenders?.size ?? 0) === 0) {
      issues.push({
        description: "Please add contenders",
        link: `/contests/${props.contestId}/contenders`,
      });
    }
    return issues;
  }, [
    contest,
    props.problems,
    props.compClasses,
    props.contenders,
    props.loading,
    props.contestId,
  ]);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, name: e.target.value });
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, description: e.target.value });
  };

  const onQualifyingProblemsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContest({
      ...contest,
      qualifyingProblems: Number.parseInt(e.target.value),
    });
  };

  const onFinalistsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, finalists: Number.parseInt(e.target.value) });
  };

  const onGracePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, gracePeriod: Number.parseInt(e.target.value) });
  };

  const onFinalEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContest({ ...contest, finalEnabled: e.target.checked });
  };

  const onRulesChange = (rules: string) => {
    setContest({ ...contest, rules });
  };

  const onLocationChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const locationId =
      e.target.value === "None"
        ? undefined
        : parseInt(e.target.value as string);
    setContest({ ...contest, locationId });
  };

  const onSeriesChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const seriesId =
      e.target.value === "None"
        ? undefined
        : parseInt(e.target.value as string);
    setContest({ ...contest, seriesId });
  };

  const onSave = () => {
    setSaving(true);
    props
      .saveContest?.(contest)
      .then((contest) => {
        if (isNew) {
          props.history.push("/contests/" + contest.id);
        }
      })
      .finally(() => setSaving(false));
  };

  const onDelete = () => {
    setRequestingDelete(true);
  };

  const onDeleteConfirmed = (result: boolean) => {
    if (result) {
      setDeleting(true);
      props
        .deleteContest?.(contest)
        .then(() => props.history.push("/contests"))
        .catch((error) => setDeleting(false));
    }

    setRequestingDelete(false);
  };

  const startPdfCreate = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const isNew = contest.id === undefined;

  const createPdfFromTemplate = (file: Blob) => {
    let reader = new FileReader();
    reader.onload = (evt: any) => {
      let arrayBuffer = evt.currentTarget.result;
      setCompilingPdf(true);
      Api.createPdfFromTemplate(contest.id!, arrayBuffer)
        .then((response) => {
          saveAs(response, "contest.pdf");
        })
        .catch((error) => {
          setErrorMessage(error);
        })
        .finally(() => setCompilingPdf(false));
    };

    reader.onerror = (evt: any) => {
      setErrorMessage("Failed to load file: " + evt);
    };

    reader.readAsArrayBuffer(file);
  };

  const createPdf = () => {
    setCompilingPdf(true);
    Api.createPdf(contest.id!)
      .then((response) => {
        saveAs(response, "contest.pdf");
      })
      .catch((error) => {
        setErrorMessage(error);
      })
      .finally(() => setCompilingPdf(false));
  };

  let scoreboardUrl =
    "https://" + Environment.siteDomain + "/scoreboard/" + contest.id;

  return (
    <>
      {contestIssues.map((issue) => (
        <div
          key={issue.link}
          style={{
            marginTop: theme.spacing(1),
          }}
        >
          <Link to={issue.link}>
            <Alert severity="warning">{issue.description}</Alert>
          </Link>
        </div>
      ))}
      <div>
        {!isNew && contestIssues.length === 0 && (
          <div className={classes.buttons}>
            <ProgressButton
              size="small"
              variant="contained"
              color="secondary"
              onClick={startPdfCreate}
              loading={compilingPdf}
              startIcon={<DescriptionIcon />}
            >
              Create PDF
            </ProgressButton>
            <Button
              size="small"
              href={scoreboardUrl}
              target="_blank"
              variant="contained"
              color="secondary"
            >
              Open scoreboard
            </Button>
          </div>
        )}
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <div
            className={classes.inputFields}
            style={{
              minWidth: 296,
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
              marginRight: theme.spacing(0.5),
            }}
          >
            <TextField
              label="Name"
              value={contest.name}
              onChange={onNameChange}
              disabled={props.loading}
            />
            <TextField
              label="Description"
              value={contest.description}
              onChange={onDescriptionChange}
              disabled={props.loading}
            />
            {(props.locations?.size ?? 0) > 0 && (
              <FormControl>
                <InputLabel shrink htmlFor="location-select">
                  Location
                </InputLabel>
                <Select
                  id="location-select"
                  value={contest.locationId ?? "None"}
                  onChange={onLocationChange}
                  disabled={props.loading}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.locations?.toArray()?.map((location: CompLocation) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {(props.series?.size ?? 0) > 0 && (
              <FormControl>
                <InputLabel shrink htmlFor="series-select">
                  Series
                </InputLabel>
                <Select
                  id="series-select"
                  value={contest.seriesId ?? "None"}
                  onChange={onSeriesChange}
                  disabled={props.loading}
                >
                  <MenuItem value="None">
                    <em>None</em>
                  </MenuItem>
                  {props.series?.toArray()?.map((series: Series) => (
                    <MenuItem key={series.id} value={series.id}>
                      {series.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={contest.finalEnabled}
                  onChange={onFinalEnabledChange}
                />
              }
              label="Enable finals"
              labelPlacement="end"
              disabled={props.loading}
            />
            {contest.finalEnabled && (
              <>
                <TextField
                  label="Number of qualifying problems"
                  value={contest.qualifyingProblems}
                  onChange={onQualifyingProblemsChange}
                  disabled={props.loading}
                />
                <TextField
                  label="Number of finalists"
                  value={contest.finalists}
                  onChange={onFinalistsChange}
                  disabled={props.loading}
                />
              </>
            )}
            <TextField
              label="Grace period (minutes)"
              value={contest.gracePeriod}
              onChange={onGracePeriodChange}
              disabled={props.loading}
            />
          </div>
          <div
            className={classes.inputFields}
            style={{
              minWidth: 296,
              maxWidth: 600,
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <RichTextEditor
              title="Rules"
              value={contest.rules}
              onChange={onRulesChange}
            />
          </div>
        </div>
        <div className={classes.buttons}>
          <ProgressButton
            variant="contained"
            color="secondary"
            onClick={onSave}
            loading={saving}
            startIcon={<SaveIcon />}
          >
            {isNew ? "Create" : "Save"}
          </ProgressButton>
          {!isNew && (
            <ProgressButton
              variant="contained"
              color="primary"
              disabled={contest.protected}
              onClick={onDelete}
              loading={deleting}
              startIcon={
                contest.protected ? <LockIcon /> : <DeleteForeverRoundedIcon />
              }
            >
              Delete
            </ProgressButton>
          )}
        </div>
      </div>
      <CreatePdfDialog
        open={showPopup}
        createPdf={createPdf}
        createPdfFromTemplate={createPdfFromTemplate}
        onClose={closePopup}
      />
      <ConfirmationDialog
        open={requestingDelete}
        title={"Delete contest"}
        message={`Do you really wish to delete the contest together with all its classes, problems, contenders, raffles and results? This action is irreversible and cannot be undone!`}
        onClose={onDeleteConfirmed}
      />
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contests: state.contests,
    series: state.series,
    locations: state.locations,
    selectedOrganizer: getSelectedOrganizer(state),
    problems: state.problemsByContest.get(props.contestId),
    compClasses: state.compClassesByContest.get(props.contestId),
    contenders: state.contendersByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {
  saveContest,
  deleteContest,
  setTitle,
  loadContest,
  setErrorMessage,
  loadLocations: reloadLocations,
  loadSeries: reloadSeries,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContestEdit));
