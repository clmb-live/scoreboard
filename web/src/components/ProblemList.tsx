import * as React from "react";
import "./ProblemList.css";
import { Problem } from "../model/problem";
import ProblemComp from "./ProblemComp";
import { ProblemState } from "../model/problemState";
import { Color } from "../model/color";
import { Tick } from "../model/tick";

export interface ProblemListProps {
  problems: Problem[];
  ticks: Tick[];
  colors: Map<number, Color>;
  problemIdBeingUpdated?: number;
  setProblemStateAndSave?: (
    problem: Problem,
    problemState: ProblemState,
    tick?: Tick
  ) => void;
}

type State = {
  expandedProblem?: number;
};

export default class ProblemList extends React.Component<
  ProblemListProps,
  State
> {
  public readonly state: State = {
    expandedProblem: undefined,
  };

  constructor(props: ProblemListProps) {
    super(props);
  }

  toggle(p: Problem) {
    this.state.expandedProblem =
      p.id === this.state.expandedProblem ? undefined : p.id;
    this.setState(this.state);
  }

  getTick(p: Problem) {
    return this.props.ticks.find((tick) => tick.problemId == p.id);
  }

  render() {
    let problemsList = this.props.problems.map((p) => (
      <ProblemComp
        key={p.id}
        isUpdating={p.id === this.props.problemIdBeingUpdated}
        isExpanded={p.id === this.state.expandedProblem}
        setProblemState={this.props.setProblemStateAndSave}
        onToggle={() => this.toggle(p)}
        problem={p}
        tick={this.getTick(p)}
        colors={this.props.colors}
      />
    ));
    return <div className="problemList">{problemsList}</div>;
  }
}
