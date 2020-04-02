/* eslint max-lines: "off" */
import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";
import Select from "react-select";

import { RemovableError } from "../../../RemovableError";
import mockPopsicle from "../../MockPopsicle";
import * as t from "../../jest-assertions";
import reduxUtils from "../../redux-test-utils";
import { buildInnerHTML, clickMainMenuButton, withGlobalJquery } from "../../test-utils";

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
const originalInnerWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerWidth");
const originalInnerHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHeight");

describe("DataViewer tests", () => {
  const { location, open, opener } = window;

  beforeAll(() => {
    delete window.location;
    delete window.open;
    delete window.opener;
    window.location = {
      reload: jest.fn(),
      pathname: "/dtale/iframe/1",
      assign: jest.fn(),
    };
    window.open = jest.fn();
    window.opener = { code_popup: { code: "test code", title: "Test" } };
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1205,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 775,
    });
    const mockBuildLibs = withGlobalJquery(() =>
      mockPopsicle.mock(url => {
        const { urlFetcher } = require("../../redux-test-utils").default;
        return urlFetcher(url);
      })
    );
    const mockChartUtils = withGlobalJquery(() => (ctx, cfg) => {
      const chartCfg = { ctx, cfg, data: cfg.data, destroyed: false };
      chartCfg.destroy = () => (chartCfg.destroyed = true);
      chartCfg.getElementsAtXAxis = _evt => [{ _index: 0 }];
      chartCfg.getElementAtEvent = _evt => [{ _datasetIndex: 0, _index: 0, _chart: { config: cfg, data: cfg.data } }];
      return chartCfg;
    });
    jest.mock("popsicle", () => mockBuildLibs);
    jest.mock("chart.js", () => mockChartUtils);
    jest.mock("chartjs-plugin-zoom", () => ({}));
    jest.mock("chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js", () => ({}));
  });

  afterAll(() => {
    window.location = location;
    window.open = open;
    window.opener = opener;
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
    Object.defineProperty(window, "innerWidth", originalInnerWidth);
    Object.defineProperty(window, "innerHeight", originalInnerHeight);
  });

  test("DataViewer: reshape aggregate 'By Column'", done => {
    const { DataViewer } = require("../../../dtale/DataViewer");
    const Reshape = require("../../../popups/reshape/Reshape").ReactReshape;
    const { Aggregate } = require("../../../popups/reshape/Aggregate");
    const store = reduxUtils.createDtaleStore();
    buildInnerHTML({ settings: "" }, store);
    const result = mount(
      <Provider store={store}>
        <DataViewer />
      </Provider>,
      { attachTo: document.getElementById("content") }
    );
    setTimeout(() => {
      result.update();
      clickMainMenuButton(result, "Summarize Data");
      setTimeout(() => {
        result.update();
        result
          .find(Reshape)
          .find("div.modal-body")
          .find("button")
          .first()
          .simulate("click");
        t.equal(result.find(Aggregate).length, 1, "should show reshape pivot");
        const aggComp = result.find(Aggregate).first();
        const aggInputs = aggComp.find(Select);
        aggInputs
          .first()
          .instance()
          .onChange({ value: "col1" });
        aggInputs
          .at(1)
          .instance()
          .onChange({ value: "col2" });
        aggInputs
          .at(2)
          .instance()
          .onChange({ value: "count" });
        aggComp
          .find("i")
          .first()
          .simulate("click");
        result
          .find("div.modal-body")
          .find("div.row")
          .last()
          .find("button")
          .last()
          .simulate("click");
        result
          .find("div.modal-footer")
          .first()
          .find("button")
          .first()
          .simulate("click");
        setTimeout(() => {
          result.update();
          t.equal(result.find(Reshape).length, 1, "should hide reshape");
          result
            .find("div.modal-body")
            .find("div.row")
            .last()
            .find("button")
            .first()
            .simulate("click");
          result
            .find("div.modal-footer")
            .first()
            .find("button")
            .first()
            .simulate("click");
          setTimeout(() => {
            result.update();
            t.equal(result.find(Reshape).length, 0, "should hide reshape");
            done();
          }, 400);
        }, 400);
      }, 400);
    }, 600);
  });

  test("DataViewer: reshape aggregate 'By Function'", done => {
    const { DataViewer } = require("../../../dtale/DataViewer");
    const Reshape = require("../../../popups/reshape/Reshape").ReactReshape;
    const { Aggregate } = require("../../../popups/reshape/Aggregate");
    const store = reduxUtils.createDtaleStore();
    buildInnerHTML({ settings: "" }, store);
    const result = mount(
      <Provider store={store}>
        <DataViewer />
      </Provider>,
      { attachTo: document.getElementById("content") }
    );
    setTimeout(() => {
      result.update();
      clickMainMenuButton(result, "Summarize Data");
      setTimeout(() => {
        result.update();
        result
          .find(Reshape)
          .find("div.modal-body")
          .find("button")
          .first()
          .simulate("click");
        t.equal(result.find(Aggregate).length, 1, "should show reshape pivot");
        const aggComp = result.find(Aggregate).first();
        const aggInputs = aggComp.find(Select);
        aggInputs
          .first()
          .instance()
          .onChange({ value: "col1" });
        aggComp
          .find("button")
          .last()
          .simulate("click");
        aggInputs
          .at(1)
          .instance()
          .onChange({ value: "count" });
        aggInputs
          .at(2)
          .instance()
          .onChange({ value: "col2" });
        result
          .find("div.modal-body")
          .find("div.row")
          .last()
          .find("button")
          .last()
          .simulate("click");
        result
          .find("div.modal-footer")
          .first()
          .find("button")
          .first()
          .simulate("click");
        setTimeout(() => {
          result
            .find("div.modal-body")
            .find("div.row")
            .last()
            .find("button")
            .first()
            .simulate("click");
          result
            .find("div.modal-footer")
            .first()
            .find("button")
            .first()
            .simulate("click");
          setTimeout(() => {
            result.update();
            t.equal(result.find(Reshape).length, 0, "should hide reshape");
            done();
          }, 400);
        }, 400);
      }, 400);
    }, 600);
  });

  test("DataViewer: reshape aggregate errors", done => {
    const { DataViewer } = require("../../../dtale/DataViewer");
    const Reshape = require("../../../popups/reshape/Reshape").ReactReshape;
    const { Aggregate } = require("../../../popups/reshape/Aggregate");
    const store = reduxUtils.createDtaleStore();
    buildInnerHTML({ settings: "" }, store);
    const result = mount(
      <Provider store={store}>
        <DataViewer />
      </Provider>,
      { attachTo: document.getElementById("content") }
    );
    setTimeout(() => {
      result.update();
      clickMainMenuButton(result, "Summarize Data");
      setTimeout(() => {
        result.update();
        result
          .find(Reshape)
          .find("div.modal-body")
          .find("button")
          .first()
          .simulate("click");
        result
          .find("div.modal-footer")
          .first()
          .find("button")
          .first()
          .simulate("click");
        result.update();
        t.equal(result.find(RemovableError).text(), "Missing an index selection!", "should render error");
        const aggComp = result.find(Aggregate).first();
        const aggInputs = aggComp.find(Select);
        aggInputs
          .first()
          .instance()
          .onChange({ value: "col1" });
        result
          .find("div.modal-footer")
          .first()
          .find("button")
          .first()
          .simulate("click");
        t.equal(result.find(RemovableError).text(), "Missing an aggregation selection!", "should render error");
        aggComp
          .find("button")
          .last()
          .simulate("click");
        result
          .find("div.modal-footer")
          .first()
          .find("button")
          .first()
          .simulate("click");
        t.equal(result.find(RemovableError).text(), "Missing an aggregation selection!", "should render error");
        done();
      }, 400);
    }, 600);
  });

  test("DataViewer: reshape aggregation cfg validation", done => {
    const { validateAggregateCfg } = require("../../../popups/reshape/Aggregate");
    const cfg = { index: null, agg: null };
    t.equal(validateAggregateCfg(cfg), "Missing an index selection!");
    cfg.index = ["x"];
    cfg.agg = { type: "func" };
    t.equal(validateAggregateCfg(cfg), "Missing an aggregation selection!");
    cfg.agg = { type: "col" };
    t.equal(validateAggregateCfg(cfg), "Missing an aggregation selection!");
    done();
  });
});