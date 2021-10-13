import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";

import { MenuItem } from "./MenuItem";

class SummarizeOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MenuItem description={this.props.t("menu_description:reshape")} onClick={this.props.open}>
        <span className="toggler-action">
          <button className="btn btn-plain">
            <i className="fas fa-tools ml-2 mr-4" />
            <span className="font-weight-bold">{this.props.t("Summarize Data", { ns: "menu" })}</span>
          </button>
        </span>
      </MenuItem>
    );
  }
}
SummarizeOption.displayName = "SummarizeOption";
SummarizeOption.propTypes = {
  open: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(["menu", "menu_description"])(SummarizeOption);
