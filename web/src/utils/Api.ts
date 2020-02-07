import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';
import {Problem} from "../model/problem";
import {CompClass} from "../model/compClass";
import {Tick} from "../model/tick";
import {Color} from "../model/color";
import {ScoreboardDescription} from "../model/scoreboardDescription";

export class Api {

   private static useLocalhost = false;

   static getLiveUrl(): any {
      return (Api.useLocalhost ? "ws://localhost:8080/api": "wss://api.clmb.live") + "/live/websocket";
   }

   private static getBaseUrl(): string {
      return Api.useLocalhost ? "http://localhost:8080/api/" : "https://api.clmb.live/"
   }

   private static async handleErrors(data: Response): Promise<Response> {
      if(!data.ok) {
         let errorBody = await data.json();
         console.error(errorBody);
         throw errorBody.message;
         //throw Error("Failed: " + data.statusText);
      }
      return data;
   }

   private static getAuthHeader(activationCode?: string) : any {
      return activationCode ? {Authorization: "Regcode " + activationCode} : {}
   }

   private static async get(url: string, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            headers: Api.getAuthHeader(activationCode)
         });
      return (await this.handleErrors(response)).json();
   }

   private static async post(url: string, postData: any, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            }
         }
      );
      return (await this.handleErrors(response)).json();
   }

   private static async delete(url: string, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            },
         }
      );
      return this.handleErrors(response);
   }

   private static async put(url: string, postData: any, activationCode?: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "PUT",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader(activationCode)
            },
         }
      );
      return (await this.handleErrors(response)).json();
   }

   static getContest(contestId: number, activationCode?: string): Promise<Contest> {
      return this.get("contest/" + contestId, activationCode);
   }

   static getProblems(contestId: number, activationCode: string): Promise<Problem[]> {
      return this.get("contest/" + contestId + "/problem", activationCode);
   }

   static getCompClasses(contestId: number, activationCode: string): Promise<CompClass[]> {
      return this.get("contest/" + contestId + "/compClass", activationCode);
   }

   static getTicks(contenderId: number, activationCode: string): Promise<Tick[]> {
      return this.get("contender/" + contenderId + "/tick", activationCode);
   }

   static createTick(problemId: number, contenderId: number, isFlash: boolean, activationCode: string): Promise<Tick> {
      const newTick:Tick = {
         isFlash,
         contenderId,
         problemId
      };
      return this.post("tick", newTick, activationCode);
   }

   static updateTick(tick: Tick, activationCode: string): Promise<any> {
      return this.put("tick/" + tick.id, tick, activationCode);
   }

   static deleteTick(tick: Tick, activationCode: string): Promise<any> {
      return this.delete("tick/" + tick.id, activationCode);
   }

   static getColors(activationCode: string): Promise<Color[]> {
      return this.get("color", activationCode);
   }

   static getContender(code: string): Promise<ContenderData> {
      return this.get("contender/findByCode?code=" + code, code);
   }
 
   static setContender(contenderData : ContenderData, activationCode: string): Promise<ContenderData> {
      return this.put("contender/" + contenderData.id, contenderData, activationCode);
   }

   static getScoreboard(id:number): Promise<ScoreboardDescription> {
      return this.get("contest/" + id + "/scoreboard");
   }
}