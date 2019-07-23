import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import {CompClass} from "../model/compClass";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from "@material-ui/icons/Cancel";
import {ConfirmationDialog} from "./ConfirmationDialog";
import {DateTimePicker} from "@material-ui/pickers";

interface Props {
   compClasses:CompClass[],
   editCompClass?:CompClass,

   startEditCompClass?:(compClass:CompClass) => void
   cancelEditCompClass?:() => void
   saveEditCompClass?:() => void
   startAddCompClass?:() => void
   deleteCompClass?:(compClass:CompClass) => void
   updateEditCompClass?:(propName:string, propValue:any) => void
}

type State = {
   deleteCompClass?:CompClass
}

class CompClassesComp extends React.Component<Props, State> {
   public readonly state: State = {
   };

   constructor(props: Props) {
      super(props);
   }

   componentDidMount() {
   }

   deleteCompClass = (compClass:CompClass) => {
      this.state.deleteCompClass = compClass;
      this.setState(this.state);
   };

   onDeleteConfirmed = () => {
      this.props.deleteCompClass!(this.state.deleteCompClass!);
      this.state.deleteCompClass = undefined;
      this.setState(this.state)
   };

   onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditCompClass!("name", e.target.value);
   };

   onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.updateEditCompClass!("description", e.target.value);
   };

   onTimeBeginChange = (e: any) => {
      console.log(e);
   };

   onTimeEndChange = (e: any) => {
      console.log(e);
   };

   render() {
      let compClasses = this.props.compClasses;
      let editCompClass = this.props.editCompClass;
      if(!compClasses) {
         return (<CircularProgress/>)
      }
      let timeBegin = new Date();
      let timeEnd = new Date();
      return (
         <Paper>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell style={{width:"100%"}}>Description</TableCell>
                     <TableCell style={{minWidth:110}}>Start time</TableCell>
                     <TableCell style={{minWidth:110}}>End time</TableCell>
                     <TableCell style={{minWidth:96}}>
                        <IconButton color="inherit" aria-label="Menu" title="Add class" onClick={this.props.startAddCompClass}>
                           <AddIcon />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {compClasses.map(compClass => {
                     if(editCompClass == undefined || editCompClass.id != compClass.id) {
                        return (
                           <TableRow key={compClass.id}
                                     style={{cursor: 'pointer'}}
                                     hover
                                     onClick={() => console.log("click")}>
                              <TableCell component="th" scope="row">{compClass.name}</TableCell>
                              <TableCell>{compClass.description}</TableCell>
                              <TableCell>{compClass.timeBegin}</TableCell>
                              <TableCell>{compClass.timeEnd}</TableCell>
                              <TableCell>
                                 <IconButton color="inherit" aria-label="Menu" title="Edit"
                                             onClick={() => this.props.startEditCompClass!(compClass)}>
                                    <EditIcon/>
                                 </IconButton>
                                 <IconButton color="inherit" aria-label="Menu" title="Delete"
                                             onClick={() => this.deleteCompClass(compClass)}>
                                    <DeleteIcon/>
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        )
                     } else {
                        return (
                           <TableRow key={compClass.id}
                                     style={{cursor: 'pointer'}}
                                     hover
                                     onClick={() => console.log("click")}>
                              <TableCell component="th" scope="row">
                                 <input style={{}} value={editCompClass.name} placeholder="Name" onChange={this.onNameChange} />
                              </TableCell>
                              <TableCell>
                                 <input style={{}} value={editCompClass.description} onChange={this.onDescriptionChange} />
                              </TableCell>
                              <TableCell>
                                 <DateTimePicker ampm={false} value={timeBegin} onChange={this.onTimeBeginChange} />
                              </TableCell>
                              <TableCell>
                                 <DateTimePicker ampm={false} value={timeEnd} onChange={this.onTimeEndChange} />
                              </TableCell>
                              <TableCell>
                                 <IconButton color="inherit" aria-label="Menu" title="Save"
                                             onClick={this.props.saveEditCompClass!}>
                                    <CheckIcon/>
                                 </IconButton>
                                 <IconButton color="inherit" aria-label="Menu" title="Cancel"
                                             onClick={this.props.cancelEditCompClass!}>
                                    <CancelIcon/>
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        )
                     }
                  })}
               </TableBody>
            </Table>
            <ConfirmationDialog open={this.state.deleteCompClass != undefined}
                                title={"Delete class"}
                                message={"Do you wish to delete the selected class?"}
                                onClose={this.onDeleteConfirmed} />
         </Paper>
      );
   }
}

export default CompClassesComp;