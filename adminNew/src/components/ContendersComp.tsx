import * as React from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SaveIcon from '@material-ui/icons/SaveAlt';
import ClearIcon from '@material-ui/icons/Clear';
import {ContenderData} from "../model/contenderData";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {ConfirmationDialog} from "./ConfirmationDialog";
import {CompClass} from "../model/compClass";
import moment from "moment";
import {Problem} from "../model/problem";
import {Color} from "../model/color";

interface Props {
   contenders:ContenderData[],
   compClassMap:Map<number,CompClass>
   problemMap:Map<number,Problem>
   colorMap:Map<number,Color>

   createContenders?: (nContenders:number) => void,
   exportResults?: () => void
   resetContenders?: () => void
   /*editCompClass?:CompClass,
   startEditCompClass?:(compClass:CompClass) => void
   cancelEditCompClass?:() => void
   saveEditCompClass?:() => void
   startAddCompClass?:() => void
   deleteCompClass?:(compClass:CompClass) => void
   updateEditCompClass?:(propName:string, propValue:any) => void*/
}

type State = {
   showAddContendersPopup:boolean
   addContendersErrorMessage?:string
   showResetConfirmationPopup:boolean
   nNewContenders:string
   dialogContender?:ContenderData
   //deleteCompClass?:CompClass
}

class ContendersComp extends React.Component<Props, State> {
   public readonly state: State = {
      showAddContendersPopup: false,
      showResetConfirmationPopup: false,
      nNewContenders: ""
   };

   constructor(props: Props) {
      super(props);
   }


   readonly MAX_CONTENDER_COUNT = 500;

   componentDidMount() {
   }

   private getCompClassName(id?: number) {
      let compClass = id ? this.props.compClassMap.get(id!) : undefined;
      return compClass ? compClass.name : "-";
   }

   startAddContenders = () => {
      this.state.showAddContendersPopup = true;
      this.state.addContendersErrorMessage = undefined;
      this.setState(this.state);
   };

   closePopups = () => {
      this.state.showAddContendersPopup = false;
      this.state.showResetConfirmationPopup = false;
      this.setState(this.state);
   };

   onNNewContendersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.state.nNewContenders = e.target.value;
      this.setState(this.state);
   };

   addContendersConfirmed = () => {
      const nContenders = parseInt(this.state.nNewContenders);
      if(nContenders) {
         if (this.props.contenders.length + nContenders > this.MAX_CONTENDER_COUNT) {
            this.state.addContendersErrorMessage = "Maximum number of contenders exceeded!"
         } else {
            this.props.createContenders!(nContenders);
            this.state.showAddContendersPopup = false;
            this.state.nNewContenders = "";
         }
      } else {
         this.state.addContendersErrorMessage = "Illegal input!"
      }
      this.setState(this.state);
   };

   resetAllContenders = () => {
      this.state.showResetConfirmationPopup = true;
      this.setState(this.state);
   };

   resetContendersConfirmed = (confirmed:boolean) => {
      this.state.showResetConfirmationPopup = false;
      this.setState(this.state);
      if(confirmed) {
         this.props.resetContenders!();
      }
   };

   showContenderDialog = (contender:ContenderData) => {
      this.state.dialogContender = contender;
      this.setState(this.state);
   };

   hideContenderDialog = () => {
      this.state.dialogContender = undefined;
      this.setState(this.state);
   };

   /*deleteCompClass = (compClass:CompClass) => {
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
   };*/

   render() {
      let contenders = this.props.contenders;
      //let editCompClass = this.props.editCompClass;
      if(!contenders) {
         return (<CircularProgress/>)
      }
      return (
         <Paper style={{flexGrow:1, display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", marginTop:14, alignItems:"center"}}>
               <div style={{marginLeft:16, marginRight:"auto"}}>{contenders.length} contenders:</div>
               <IconButton color="inherit" aria-label="Menu" title="Add contenders" onClick={this.startAddContenders}>
                  <AddIcon />
               </IconButton>
               <IconButton color="inherit" aria-label="Menu" title="Export results" onClick={this.props.exportResults}>
                  <SaveIcon />
               </IconButton>
               <IconButton color="inherit" aria-label="Menu" title="Reset all contenders" onClick={this.resetAllContenders}>
                  <ClearIcon />
               </IconButton>
            </div>
            <div style={{flexBasis:0, flexGrow:1, overflowY:"auto"}} >
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell style={{width:"100%"}}>Name</TableCell>
                        <TableCell style={{minWidth:110}}>Competition class</TableCell>
                        <TableCell style={{minWidth:110}}>Total score</TableCell>
                        <TableCell style={{minWidth:110}}>Qualifying score</TableCell>
                        <TableCell style={{minWidth:100}}></TableCell>
                        <TableCell style={{minWidth:110}}># ticks</TableCell>
                        <TableCell style={{minWidth:110}}>Registration code</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {contenders.map(contender => {
                        //if(editCompClass == undefined || editCompClass.id != compClass.id) {
                           return (
                              <TableRow key={contender.id}
                                        style={{cursor: 'pointer'}}
                                        hover
                                        onClick={() => this.showContenderDialog(contender)}>
                                 <TableCell component="th" scope="row">{contender.name}</TableCell>
                                 <TableCell component="th" scope="row">{this.getCompClassName(contender.compClassId)}</TableCell>
                                 <TableCell component="th" scope="row">{contender.totalScore} ({contender.totalPosition})</TableCell>
                                 <TableCell component="th" scope="row">{contender.qualifyingScore} ({contender.qualifyingPosition})</TableCell>
                                 <TableCell component="th" scope="row">{contender.isFinalist ? "finalist" : ""}</TableCell>
                                 <TableCell component="th" scope="row">{contender.ticks!.length}</TableCell>
                                 <TableCell component="th" scope="row">{contender.registrationCode}</TableCell>
                              </TableRow>
                           )
                        /*} else {
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
                        }*/
                     })}
                  </TableBody>
               </Table>
            </div>
            {/*<ConfirmationDialog open={this.state.deleteCompClass != undefined}
                                title={"Delete class"}
                                message={"Do you wish to delete the selected class?"}
                                onClose={this.onDeleteConfirmed} />*/}
            <Dialog
               open={this.state.showAddContendersPopup}
               disableBackdropClick
               disableEscapeKeyDown
               maxWidth="xs"
               aria-labelledby="addcontender-dialog-title"
               >
               <DialogTitle id="addcontender-dialog-title">Create contenders</DialogTitle>
               <DialogContent>
                  <div>Before a contest starts, you have to create activation codes enough for all contenders.</div>
                  <div style={{marginTop:5}}>Currently you have {contenders.length} activation codes.</div>
                  <div style={{marginTop:5, marginBottom:20}}>You can create a maximum of {this.MAX_CONTENDER_COUNT} activation codes per contest.</div>
                  <TextField style={{width:250}}label="Number of contenders to create" value={this.state.nNewContenders} onChange={this.onNNewContendersChange}/>
                  {this.state.addContendersErrorMessage && <div style={{marginTop:5,color:"red",fontWeight:"bold"}}>{this.state.addContendersErrorMessage}</div>}
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.closePopups} color="primary">Cancel</Button>
                  <Button onClick={this.addContendersConfirmed} color="primary">Create</Button>
               </DialogActions>
            </Dialog>
            <ConfirmationDialog
               open={this.state.showResetConfirmationPopup}
               title="Reset all contenders"
               message="Do you really want to reset all contenders? All ticks and data will be lost."
               onClose={this.resetContendersConfirmed}/>
            <Dialog
               open={this.state.dialogContender != undefined}
               aria-labelledby="contender-dialog-title"
               >
               <DialogTitle id="contender-dialog-title">{this.state.dialogContender && this.state.dialogContender.name}</DialogTitle>
               <div style={{display:"flex", fontWeight: "bold", margin: "0px 24px", borderBottom: "1px solid grey"}}>
                  <div style={{width:200}}>Problem</div>
                  <div style={{width:100, textAlign:"right"}}>Points</div>
                  <div style={{width:150, marginLeft:10}}>Time</div>
               </div>
               <DialogContent>
                  {this.state.dialogContender && this.state.dialogContender!.ticks!.map(tick => {
                     let problem = this.props.problemMap.get(tick.problemId);
                     let color = this.props.colorMap.get(problem!.colorId!);
                     return(
                        <div style={{display:"flex", marginBottom:2}}>
                           <div style={{width:50}}>{problem!.number}</div>
                           <div style={{width:150}}>{color!.name}</div>
                           <div style={{width:100, textAlign:"right"}}>{problem!.points}</div>
                           <div style={{width:150, marginLeft:10}}>{moment(tick.timestamp).format("HH:mm")}</div>
                        </div>
                     );
                  })}
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.hideContenderDialog} color="primary">Ok</Button>
               </DialogActions>

            </Dialog>

         </Paper>
      );
   }
}

export default ContendersComp;
