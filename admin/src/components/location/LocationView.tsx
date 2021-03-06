import { TableCell, Typography } from "@material-ui/core";
import React from "react";
import { CompLocation } from "src/model/compLocation";
import ResponsiveTableRow from "../ResponsiveTableRow";
import LocationEdit from "./LocationEdit";

interface Props {
  location: CompLocation;
  breakpoints?: Map<number, string>;
}

const LocationView = (props: Props) => {
  const cells = [
    <TableCell component="th" scope="row">
      {props.location.name}
    </TableCell>,
    <TableCell>{props.location.latitude}</TableCell>,
    <TableCell>{props.location.longitude}</TableCell>,
  ];

  return (
    <ResponsiveTableRow cells={cells} breakpoints={props.breakpoints}>
      <Typography color="textSecondary" display="block" variant="caption">
        Info
      </Typography>
      <LocationEdit location={props.location} removable />
    </ResponsiveTableRow>
  );
};

export default LocationView;
