import * as React from 'react';
import './ScoreboardView.css';
import { ScoreboardContenderList } from '../model/scoreboardContenderList';
import { Client } from '@stomp/stompjs';
import { ScoreboardPushItem } from '../model/scoreboardPushItem';
import { Api } from '../utils/Api';
import ScoreboardTotalListContainer from '../containers/ScoreboardTotalListContainer';
import ScoreboardFinalistListContainer from '../containers/ScoreboardFinalistListContainer';
import { ScoreboardClassHeaderComp } from './ScoreboardClassHeaderComp';
import Spinner from "./Spinner";

export interface Props {
   scoreboardData: ScoreboardContenderList[];
   match: {
      params: {
         id: number
      }
   }
   loadScoreboardData?: (id:number) => void;
   receiveScoreboardItem?: (scoreboardPushItem: ScoreboardPushItem) => void;
   updateScoreboardTimer?: () => void;
}

export default class ScoreboardView extends React.Component<Props> {

   client: Client;
   intervalId: number;

   componentDidMount() {
      document.title = "Scoreboard";
      const contestId = this.props.match.params.id;
      this.client = new Client({
         brokerURL: Api.getLiveUrl(),
         /*debug: function (str) {
            console.log("DEBUG: " + str);
         },*/
         heartbeatIncoming: 4000,
         heartbeatOutgoing: 4000
      });

      this.client.activate();
      this.client.onConnect = () => {
         this.props.loadScoreboardData!(contestId);
         this.client.subscribe("/topic/scoreboard/" + contestId, (message) => {
            console.log(message, JSON.parse(message.body));
            this.props.receiveScoreboardItem!(JSON.parse(message.body))
         });
      }
      
      // Start the timer:
      this.intervalId = window.setInterval(() => { 
         this.props.updateScoreboardTimer!();
      }, 1000)
   }

   componentWillUnmount() { 
      this.client.deactivate();
      window.clearInterval(this.intervalId);
   }

   render() {
      var scoreboardData = this.props.scoreboardData;
      
      if (scoreboardData) {
         var headers = scoreboardData.map(scoreboardList => <ScoreboardClassHeaderComp key={scoreboardList.compClass.name} compClass={scoreboardList.compClass} />);
         var finalistList = scoreboardData.map(scoreboardList => <ScoreboardFinalistListContainer key={scoreboardList.compClass.name} compClass={scoreboardList.compClass} />);
         var totalList = scoreboardData.map(scoreboardList => <ScoreboardTotalListContainer key={scoreboardList.compClass.name} compClass={scoreboardList.compClass} />);
         return (
            <div className="scoreboardView">
               <div className="scoreboardListContainer">{headers}</div>
               <div className="header">Finalister</div>
               <div className="scoreboardListContainer">{finalistList}</div>
               <div className="header">Totalpoäng</div>
               <div className="scoreboardListContainer total">{totalList}</div>
               <div className="logoContainer">
                  <img height="70" src="/logos/highSport.gif" />
                  <img height="70" src="/logos/klatterdomen.jpg" />
                  <img height="50" src="/logos/edelrid.png" />
               </div>
            </div>
         );
      } else { 
         return (
            <div className="maxWidth">
              <div className="view mainView">
                  <div style={{marginTop:50, textAlign:"center"}}>
                     <div style={{marginBottom:5}}>Vänta...</div>
                     <Spinner color={"#333"} />
                  </div>
               </div>
            </div>
         )
      }
   }
}