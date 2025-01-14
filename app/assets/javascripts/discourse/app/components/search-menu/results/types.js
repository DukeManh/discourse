import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { wantsNewWindow } from "discourse/lib/intercept-click";
import DiscourseURL from "discourse/lib/url";

export default class Types extends Component {
  @service search;

  get filteredResultTypes() {
    // return only topic result types
    if (this.args.topicResultsOnly) {
      return this.args.resultTypes.filter(
        (resultType) => resultType.type === "topic"
      );
    }

    // return all result types minus topics
    return this.args.resultTypes.filter(
      (resultType) => resultType.type !== "topic"
    );
  }

  @action
  onClick(event) {
    this.routeToSearchResult(event);
  }

  @action
  onKeydown(event) {
    if (event.key === "Escape") {
      this.args.closeSearchMenu();
      event.preventDefault();
      return false;
    } else if (event.key === "Enter") {
      this.routeToSearchResult(event);
      return false;
    }

    this.search.handleResultInsertion(event);
    this.search.handleArrowUpOrDown(event);
  }

  @action
  routeToSearchResult(event) {
    if (wantsNewWindow(event)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    DiscourseURL.routeTo(event.target.href);
    this.args.closeSearchMenu();
  }
}
