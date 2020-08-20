import React, { useState } from "react";
import { StyledComponentProps, TableCell, useTheme } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { loadCompClasses } from "../../actions/asyncActions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { CompClass } from "../../model/compClass";
import CompClassView from "./CompClassView";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Organizer } from "src/model/organizer";
import moment from "moment";
import { getSelectedOrganizer } from "../../selectors/selector";
import { OrderedMap } from "immutable";
import ResponsiveTableHead from "../ResponsiveTableHead";
import CompClassEdit from "./CompClassEdit";

interface Props {
  contestId?: number;
  compClasses?: OrderedMap<number, CompClass>;
  selectedOrganizer?: Organizer;

  loadCompClasses?: (contestId: number) => Promise<void>;
}

const breakpoints = new Map<number, string>().set(1, "smDown").set(2, "smDown");

const CompClassList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const theme = useTheme();

  const onCreateDone = () => {
    setShowCreate(false);
  };

  const refreshCompClasses = () => {
    setRefreshing(true);
    props
      .loadCompClasses?.(props.contestId!)
      .finally(() => setRefreshing(false));
  };

  const headings = [
    <TableCell>Name</TableCell>,
    <TableCell>Start time</TableCell>,
    <TableCell>End time</TableCell>,
  ];

  const toolbar = (
    <>
      <IconButton
        color="inherit"
        aria-label="Menu"
        title="Add"
        disabled={showCreate}
        onClick={() => setShowCreate(true)}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="Menu"
        title="Refresh"
        onClick={refreshCompClasses}
      >
        {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
      </IconButton>
    </>
  );

  return (
    <>
      <Table>
        <ResponsiveTableHead
          cells={headings}
          breakpoints={breakpoints}
          toolbar={toolbar}
        />
        <TableBody>
          {showCreate && (
            <TableRow selected>
              <TableCell padding="none" colSpan={4}>
                <div style={{ padding: theme.spacing(0, 2) }}>
                  <CompClassEdit
                    cancellable
                    onDone={onCreateDone}
                    compClass={{
                      name: "",
                      description: "",
                      contestId: props.contestId!,
                      timeBegin: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                      timeEnd: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
          {props.compClasses?.toArray()?.map((compClass: CompClass) => (
            <CompClassView
              key={compClass.id!}
              compClass={compClass}
              breakpoints={breakpoints}
            />
          ))}
        </TableBody>
      </Table>
      {(props.compClasses?.size ?? 0) == 0 && (
        <div className={"emptyText"}>
          <div>You have no contest classes.</div>
          <div>
            Please create at least one contest class by clicking the plus button
            above.
          </div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    selectedOrganizer: getSelectedOrganizer(state),
    compClasses: state.compClassesByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {
  loadCompClasses,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CompClassList));
