import { Card, CardBody, CardTitle, Grid, GridItem, Title } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import {
  HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

import { HistoricalDataCostChart } from './historicalDataCostChart';
import { HistoricalDataTrendChart } from './historicalDataTrendChart';
import { HistoricalDataUsageChart } from './historicalDataUsageChart';

interface HistoricalDataOwnProps {
  groupBy: string;
  groupByValue: string | number;
  query?: Query;
}

interface HistoricalDataStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type HistoricalDataProps = HistoricalDataOwnProps & HistoricalDataStateProps & WithTranslation;

class HistoricalDataBase extends React.Component<HistoricalDataProps> {
  // Returns cost chart
  private getCostChart = (widget: HistoricalDataWidget) => {
    const { groupBy, groupByValue, t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataCostChart
            groupBy={groupBy}
            groupByValue={groupByValue}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns trend chart
  private getTrendChart = (widget: HistoricalDataWidget) => {
    const { groupBy, groupByValue, query, t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataTrendChart
            groupBy={groupBy}
            groupByValue={groupByValue}
            query={query}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns usage chart
  private getUsageChart = (widget: HistoricalDataWidget) => {
    const { groupBy, groupByValue, t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataUsageChart
            groupBy={groupBy}
            groupByValue={groupByValue}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns rendered widget based on type
  private renderWidget(widget: HistoricalDataWidget) {
    switch (widget.type) {
      case HistoricalDataWidgetType.cost:
        return this.getCostChart(widget);
      case HistoricalDataWidgetType.trend:
        return this.getTrendChart(widget);
      case HistoricalDataWidgetType.usage:
        return this.getUsageChart(widget);
      default:
        return null;
    }
  }

  public render() {
    const { selectWidgets, widgets } = this.props;

    return (
      <Grid hasGutter>
        {widgets.map(widgetId => {
          const widget = selectWidgets[widgetId];
          return <GridItem key={`widget-${widgetId}`}>{this.renderWidget(widget)}</GridItem>;
        })}
      </Grid>
    );
  }
}

export { HistoricalDataBase };
