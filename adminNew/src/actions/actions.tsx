
import {action, createAction, createStandardAction} from 'typesafe-actions'
import { Problem } from '../model/problem';
import { Contest } from '../model/contest';
import {CompClass} from "../model/compClass";
import {Color} from "../model/color";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";
import {ContenderData} from "../model/contenderData";

export const setErrorMessage = createStandardAction('SET_ERROR_MESSAGE')<string>();
export const clearErrorMessage = createStandardAction('CLEAR_ERROR_MESSAGE')();
export const setTitle = createStandardAction('SET_TITLE')<string>();
export const setLoggingIn = createStandardAction('SET_LOGGING_IN')<boolean>();
export const setLoggedInUser = createStandardAction('SET_LOGGED_IN_USER')<string>();
export const logout = createStandardAction('LOGOUT')();


export const setNewContest = createStandardAction('SET_NEW_CONTEST')();
export const updateContest = createStandardAction('UPDATE_CONTEST')<{propName:string, value:any}>();
export const receiveContests = createStandardAction('RECEIVE_CONTESTS')<Contest[]>();
export const receiveContest = createStandardAction('RECEIVE_CONTEST')<Contest>();

export const receiveLocations = createStandardAction('RECEIVE_LOCATIONS')<CompLocation[]>();

export const receiveOrganizers = createStandardAction('RECEIVE_ORGANIZERS')<Organizer[]>();

export const receiveColors = createStandardAction('RECEIVE_COLORS')<Color[]>();

export const receiveCompClasses = createStandardAction('RECEIVE_COMP_CLASSES')<CompClass[]>();
export const startEditCompClass = createStandardAction('START_EDIT_COMP_CLASS')<CompClass>();
export const cancelEditCompClass = createStandardAction('CANCEL_EDIT_COMP_CLASS')();
export const startAddCompClass = createStandardAction('START_ADD_COMP_CLASS')();
export const updateEditCompClass = createStandardAction('UPDATE_EDIT_COMP_CLASS')<{propName:string, value:any}>();

export const receiveProblems = createStandardAction('RECEIVE_PROBLEMS')<Problem[]>();
export const startEditProblem = createStandardAction('START_EDIT_PROBLEM')<Problem>();
export const cancelEditProblem = createStandardAction('CANCEL_EDIT_PROBLEM')();
export const startAddProblem = createStandardAction('START_ADD_PROBLEM')<Problem>();
export const updateEditProblem = createStandardAction('UPDATE_EDIT_PROBLEM')<{propName:string, value:any}>();

export const receiveContenders = createStandardAction('RECEIVE_CONTENDERS')<ContenderData[]>();