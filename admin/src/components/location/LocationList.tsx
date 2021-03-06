import { Button, TableCell } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import React, { useCallback, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { getSelectedOrganizer } from "src/selectors/selector";
import { setTitle } from "../../actions/actions";
import { reloadLocations } from "../../actions/asyncActions";
import { CompLocation } from "../../model/compLocation";
import { StoreState } from "../../model/storeState";
import ContentLayout from "../ContentLayout";
import { ProgressButton } from "../ProgressButton";
import ResponsiveTableHead from "../ResponsiveTableHead";
import ResponsiveTableSpanningRow from "../ResponsiveTableSpanningRow";
import LocationEdit from "./LocationEdit";
import LocationView from "./LocationView";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyText: { padding: theme.spacing(2) },
  })
);

const breakpoints = new Map<number, string>().set(1, "smDown").set(2, "smDown");

const LocationList = (props: Props & PropsFromRedux) => {
  const { setTitle, reloadLocations } = props;

  React.useEffect(() => {
    setTitle("Location");
  }, [setTitle]);

  const refreshLocation = useCallback(() => {
    setRefreshing(true);
    reloadLocations().finally(() => setRefreshing(false));
  }, [reloadLocations]);

  React.useEffect(() => {
    if (props.locations === undefined) {
      refreshLocation();
    }
  }, [props.locations, refreshLocation]);

  const classes = useStyles();

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const buttons = [
    <Button
      variant="contained"
      color="secondary"
      size="small"
      disabled={showCreate}
      onClick={() => setShowCreate(true)}
      startIcon={<AddIcon />}
    >
      Add
    </Button>,
    <ProgressButton
      variant="contained"
      color="secondary"
      size="small"
      onClick={refreshLocation}
      startIcon={<RefreshIcon />}
      loading={refreshing}
    >
      Refresh
    </ProgressButton>,
  ];

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Latitude</TableCell>,
    <TableCell>Longitude</TableCell>,
  ];

  return (
    <ContentLayout buttons={buttons}>
      <Table>
        <ResponsiveTableHead cells={headings} breakpoints={breakpoints} />
        <TableBody>
          {showCreate && (
            <ResponsiveTableSpanningRow colSpan={4}>
              <LocationEdit
                onDone={onCreateDone}
                cancellable
                location={{
                  name: "",
                  organizerId: props.selectedOrganizer?.id!,
                }}
              />
            </ResponsiveTableSpanningRow>
          )}

          {props.locations?.toArray()?.map((location: CompLocation) => (
            <LocationView
              key={location.id!}
              location={location}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
      {!showCreate && props.locations?.size === 0 && (
        <div className={classes.emptyText}>
          Use the plus button to create your first location.
        </div>
      )}
    </ContentLayout>
  );
};

const mapStateToProps = (state: StoreState, props: Props) => ({
  locations: state.locations,
  selectedOrganizer: getSelectedOrganizer(state),
});

const mapDispatchToProps = {
  reloadLocations,
  setTitle,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LocationList);
