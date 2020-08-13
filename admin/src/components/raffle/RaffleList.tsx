import React, { useState, useEffect } from "react";
import { StyledComponentProps, TableCell, Theme } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import createStyles from "@material-ui/core/styles/createStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { StoreState } from "../../model/storeState";
import { connect } from "react-redux";
import { loadRaffles, saveRaffle } from "../../actions/asyncActions";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import { Raffle } from "../../model/raffle";
import RaffleView from "./RaffleView";
import RefreshIcon from "@material-ui/icons/Refresh";
import { OrderedMap } from "immutable";
import { ContenderData } from "../../model/contenderData";

const styles = () =>
  createStyles({
    root: {
      margin: 10,
    },
    table: {
      minWidth: 700,
    },
  });

interface Props {
  contestId?: number;
  raffles?: OrderedMap<number, Raffle>;
  contenders?: OrderedMap<number, ContenderData>;

  loadRaffles?: (contestId: number) => Promise<void>;
  saveRaffle?: (raffle: Raffle) => Promise<Raffle>;
}

const RaffleList = (
  props: Props & RouteComponentProps & StyledComponentProps
) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const createRaffle = () => {
    setCreating(true);
    props
      .saveRaffle?.({ contestId: props.contestId!, active: false })
      .finally(() => setCreating(false));
  };

  const refreshRaffles = () => {
    setRefreshing(true);
    props.loadRaffles?.(props.contestId!).finally(() => setRefreshing(false));
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: 120 }}>Id</TableCell>
            <TableCell style={{ width: "100%" }}>Winners</TableCell>
            <TableCell className={"icon-cell"} style={{ minWidth: 146 }}>
              <IconButton
                color="inherit"
                aria-label="Menu"
                title="Add"
                disabled={creating}
                onClick={createRaffle}
              >
                {creating ? <CircularProgress size={24} /> : <AddIcon />}
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Menu"
                title="Refresh"
                onClick={refreshRaffles}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.raffles?.toArray()?.map((raffle: Raffle) => (
            <RaffleView
              key={raffle.id!}
              raffle={raffle}
              contenders={props.contenders}
            />
          ))}
        </TableBody>
      </Table>
      {(props.raffles?.size ?? 0) === 0 && (
        <div className={"emptyText"}>
          <div>You have no raffles.</div>
          <div>Please create a raffle by clicking the plus button above.</div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    contenders: state.contendersByContest.get(props.contestId),
    raffles: state.rafflesByContest.get(props.contestId),
  };
}

const mapDispatchToProps = {
  loadRaffles,
  saveRaffle,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(RaffleList)));