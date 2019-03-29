import { createSelector } from 'reselect'
import { StoreState } from '../model/storeState';
import { ScoreboardListItem } from '../model/scoreboardListItem';
import {ScoreboardContender} from "../model/scoreboardContender";

const getScoreboardContenders = (state: StoreState, props: any) => {
   if (state.scoreboardData) {
      return state.scoreboardData.find(list => list.compClass.name == props.compClass.name)!.contenders;
   } else {
      return undefined;
   }
}

const createList = (getScore: (sc: ScoreboardContender) => number, maxCount: number, scoreboardContenders?: ScoreboardContender[]) => {
   console.log("makeGetTotalList");
   if (scoreboardContenders) {
      scoreboardContenders = scoreboardContenders.sort((a, b) => getScore(b) - getScore(a));
      let position = 0;
      let lastScore = -1;
      let maxFulfilled = false;
      let listItems = scoreboardContenders.map((sc, index) => {
         let score = getScore(sc);
         if(score != lastScore) {
            lastScore = score;
            position = index + 1;
            maxFulfilled = maxCount != 0 && index >= maxCount;
         }
         if(maxFulfilled) {
            return undefined;
         } else {
            let x: ScoreboardListItem = {
               contenderId: sc.contenderId,
               position: position,
               contenderName: sc.contenderName,
               score: score
            }
            return x;
         }
      }).filter(sc => sc) as ScoreboardListItem[]

      if(maxCount && listItems.length > 0 && !listItems[listItems.length - 1].score) {
         // Finalist list with score 0. Don't allow that...
         return [];
      } else {
         return listItems;
      }
   } else {
      return undefined;
   }
}

export const makeGetTotalList = () => {
   return createSelector(
      [getScoreboardContenders],
      (scoreboardContenders) => createList((sc: ScoreboardContender) => sc.totalScore, 0, scoreboardContenders)
   )
}

export const makeGetFinalistList = () => {
   return createSelector(
      [getScoreboardContenders],
      (scoreboardContenders) => createList((sc: ScoreboardContender) => sc.qualifyingScore, 5, scoreboardContenders)
   )
}