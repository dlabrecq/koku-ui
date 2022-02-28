jest.mock('date-fns/format');

import { Chart, ChartArea } from '@patternfly/react-charts';
import { OcpReport, OcpReportData } from 'api/reports/ocpReports';
import { shallow } from 'enzyme';
import * as utils from 'pages/views/components/charts/common/chartDatumUtils';
import React from 'react';

import { HistoricalCostChart, HistoricalCostChartProps } from './historicalCostChart';

const currentMonthReport: OcpReport = createReport('1-15-18');
const previousMonthReport: OcpReport = createReport('12-15-17');

const currentCostData = utils.transformReport(currentMonthReport, utils.ChartType.daily, 'date', 'cost');
const currentInfrastructureCostData = utils.transformReport(
  currentMonthReport,
  utils.ChartType.daily,
  'date',
  'infrastructure'
);
const previousCostData = utils.transformReport(previousMonthReport, utils.ChartType.daily, 'date', 'cost');
const previousInfrastructureCostData = utils.transformReport(
  previousMonthReport,
  utils.ChartType.daily,
  'date',
  'infrastructure'
);

const props: HistoricalCostChartProps = {
  currentCostData,
  currentInfrastructureCostData,
  height: 100,
  previousCostData,
  previousInfrastructureCostData,
  title: 'Usage Title',
  formatter: jest.fn(),
  formatOptions: {},
};

test('reports are formatted to datums', () => {
  const view = shallow(<HistoricalCostChart {...props} />);
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(4);
  expect(charts.at(0).prop('data')).toMatchSnapshot('current month cost data');
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month infrastructure cost data');
  expect(charts.at(2).prop('data')).toMatchSnapshot('previous month cost data');
  expect(charts.at(3).prop('data')).toMatchSnapshot('previous month infrastructure cost data');
});

test('null previous and current reports are handled', () => {
  const view = shallow(
    <HistoricalCostChart
      {...props}
      currentCostData={null}
      currentInfrastructureCostData={null}
      previousCostData={null}
      previousInfrastructureCostData={null}
    />
  );
  const charts = view.find(ChartArea);
  expect(charts.length).toBe(4);
});

test('height from props is used', () => {
  const view = shallow(<HistoricalCostChart {...props} />);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('labels formats with datum and value formatted from props', () => {
  const view = shallow(<HistoricalCostChart {...props} />);
  const datum: utils.ChartDatum = {
    x: 1,
    y: 1,
    key: '1-1-1',
    units: 'hrs',
  };
  const group = view.find(Chart);
  group.props().containerComponent.props.labels({ datum });
  expect(props.formatter).toBeCalledWith(datum.y, datum.units, props.formatOptions);
  expect(view.find(Chart).prop('height')).toBe(props.height);
});

test('trend is a running total', () => {
  const multiDayReport: OcpReport = {
    data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
  };
  const view = shallow(<HistoricalCostChart {...props} currentCostData={multiDayReport.data} />);
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

test('trend is a daily value', () => {
  const multiDayReport: OcpReport = {
    data: [createReportDataPoint('1-15-18', 1), createReportDataPoint('1-16-18', 2)],
  };
  const view = shallow(<HistoricalCostChart {...props} currentCostData={multiDayReport.data} />);
  const charts = view.find(ChartArea);
  expect(charts.at(1).prop('data')).toMatchSnapshot('current month data');
});

function createReport(date: string): OcpReport {
  return {
    data: [createReportDataPoint(date)],
  };
}

function createReportDataPoint(date: string, usage = 1): OcpReportData {
  return {
    date,
    values: [{ date, usage: { value: usage, units: 'unit' } }],
  };
}
