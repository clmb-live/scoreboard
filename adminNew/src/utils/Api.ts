import { ContenderData } from '../model/contenderData';
import { Contest } from '../model/contest';
import {Problem} from "../model/problem";
import {CompClass} from "../model/compClass";
import {Color} from "../model/color";
import {Organizer} from "../model/organizer";
import {CompLocation} from "../model/compLocation";

export class Api {

   static credentials?:string = "YWRtaW46bm90aW1lZm9yY2xpbWJpbmc=";

   static getLiveUrl(): any {
      let url: string = "";
      console.log(window.location.protocol);
      if (window.location.hostname === "localhost") {
         url = "ws://localhost:8080";
      } else {
         if (window.location.protocol.indexOf("https") === 0) {
            url = "wss"
         } else { 
            url = "ws"
         }
         url += "://" + window.location.hostname
      }
      url += "/api/live/websocket";
      return url;
   } 

   private static getBaseUrl(): string {
      return (window.location.hostname === "localhost" ?  "https://clmb.live" : "") + "/api/";
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

   private static getAuthHeader() : any {
      return this.credentials ? {Authorization: "Basic " + this.credentials} : {}
   }

   private static async get(url: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            headers: Api.getAuthHeader()
         });
      return (await this.handleErrors(response)).json();
   }

   private static async post(url: string, postData: any) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            }
         }
      );
      return (await this.handleErrors(response)).json();
   }

   private static async delete(url: string) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            },
         }
      );
      return this.handleErrors(response);
   }

   private static async put(url: string, postData: any) {
      let response = await fetch(this.getBaseUrl() + url,
         {
            method: "PUT",
            body: JSON.stringify(postData),
            headers: {
               "Content-Type": "application/json",
               ...Api.getAuthHeader()
            },
         }
      );
      return (await this.handleErrors(response)).json();
   }

   static setCredentials(credentials:string) {
      this.credentials = credentials
   }

   static getUser(code: string): Promise<String> {
      return this.get("user/" + code);
   }

   static getContests(): Promise<Contest[]> {
      return this.get("contest");
   }

   static getContest(contestId: number): Promise<Contest> {
      return this.get("contest/" + contestId);
   }

   static saveContest(contest: Contest): Promise<Contest> {
      if(contest.isNew) {
         return this.post("contest", contest);
      } else {
         return this.put("contest/" + contest.id, contest);
      }
   }

   static getProblems(contestId: number): Promise<Problem[]> {
      return this.get("contest/" + contestId + "/problem");
   }

   static getCompClasses(contestId: number): Promise<CompClass[]> {
      return this.get("contest/" + contestId + "/compClass");
   }

   static saveCompClass(compClass:CompClass): Promise<CompClass> {
      if(compClass.id == -1) {
         return this.post("compClass", compClass);
      } else {
         return this.put("compClass/" + compClass.id, compClass);
      }
   }

   static deleteCompClass(compClass: CompClass): Promise<any> {
      return this.delete("compClass/" + compClass.id);
   }

   static getContenders(contestId: number): Promise<ContenderData[]> {
      return this.get("contest/" + contestId + "/contender");
   }

   static getColors(): Promise<Color[]> {
      return this.get("color");
   }

   static getLocations(): Promise<CompLocation[]> {
      return this.get("location");
   }

   static getOrganizers(): Promise<Organizer[]> {
      return this.get("organizer");
   }

   static setContender(contenderData : ContenderData): Promise<ContenderData> {
      return this.put("contender/" + contenderData.id, contenderData);
   }
}