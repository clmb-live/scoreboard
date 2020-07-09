import React, { useState } from "react";
import { Organizer } from "src/model/organizer";
import { connect } from "react-redux";
import { StoreState } from "../../model/storeState";
import { deleteOrganizer, selectOrganizer } from "../../actions/asyncActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import TableRow from "@material-ui/core/TableRow";
import { TableCell } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { CircularProgress } from "@material-ui/core";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import Chip from "@material-ui/core/Chip";

interface Props {
  isSelectedOrganizer: boolean;
  organizer?: Organizer;
  deleteOrganizer?: (organizer: Organizer) => Promise<void>;
  selectOrganizer?: (organizer: Organizer) => Promise<void>;
  onBeginEdit?: () => void;
}

const OrganizerView = (props: Props) => {
  let [deleting, setDeleting] = useState<boolean>(false);

  const onDelete = () => {
    setDeleting(true);
    props
      .deleteOrganizer?.(props.organizer!)
      .catch((error) => setDeleting(false));
  };

  const onSwitchOrganizer = () => {
    props.selectOrganizer?.(props.organizer!);
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {props.organizer?.name}
        {props.isSelectedOrganizer && (
          <Chip
            style={{ marginLeft: "5px" }}
            label="Selected"
            color="primary"
            size="small"
          />
        )}
      </TableCell>
      <TableCell component="th" scope="row">
        {props.organizer?.homepage}
      </TableCell>
      <TableCell className={"icon-cell"}>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Edit"
          disabled={deleting}
          onClick={props.onBeginEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Delete"
          onClick={onDelete}
          disabled={deleting || props.isSelectedOrganizer}
        >
          {deleting ? <CircularProgress size={24} /> : <DeleteIcon />}
        </IconButton>
        <IconButton
          color="inherit"
          aria-label="Menu"
          title="Switch"
          disabled={props.isSelectedOrganizer}
          onClick={onSwitchOrganizer}
        >
          <SyncAltIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

function mapStateToProps(state: StoreState, props: any): Props {
  return {
    isSelectedOrganizer: props.organizer?.id === state.selectedOrganizer?.id,
  };
}

const mapDispatchToProps = {
  deleteOrganizer,
  selectOrganizer,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganizerView);