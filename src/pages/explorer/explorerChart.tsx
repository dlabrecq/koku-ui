import { Title } from '@patternfly/react-core';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { getQuery, orgUnitIdKey, parseQuery, Query, tagPrefix } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ChartDatum, ComputedReportItemType, isFloat, isInt } from 'components/charts/common/chartDatumUtils';
import { HistoricalExplorerChart } from 'components/charts/historicalExplorerChart';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';

import { chartStyles, styles } from './explorerChart.styles';
import {
  baseQuery,
  getGroupByDefault,
  getPerspectiveDefault,
  getReportPathsType,
  getReportType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerChartOwnProps extends RouteComponentProps<void>, WithTranslation {
  computedReportItemType?: ComputedReportItemType;
}

interface ExplorerChartStateProps {
  perspective: PerspectiveType;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface ExplorerChartDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface ExplorerChartState {
  // TBD...
}

type ExplorerChartProps = ExplorerChartStateProps & ExplorerChartOwnProps & ExplorerChartDispatchProps;

class ExplorerChartBase extends React.Component<ExplorerChartProps> {
  protected defaultState: ExplorerChartState = {};
  public state: ExplorerChartState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidMount() {
    this.fetchReport();
  }

  public componentDidUpdate(prevProps: ExplorerChartProps) {
    const { report, reportError, queryString } = this.props;

    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;

    if (newQuery || noReport) {
      this.fetchReport();
    }
  }

  private createReportDatum = (
    value: number,
    computedItem: ComputedReportItem,
    reportItem: string = 'cost',
    reportItemValue: string = 'total'
  ): ChartDatum => {
    const { t } = this.props;

    const xVal = t('chart.date', { date: getDate(computedItem.date), month: getMonth(computedItem.date) });
    const yVal = isFloat(value) ? parseFloat(value.toFixed(2)) : isInt(value) ? value : 0;
    return {
      x: xVal,
      y: value === null ? null : yVal, // For displaying "no data" labels in chart tooltips
      key: computedItem.id,
      name: computedItem.label,
      units: computedItem[reportItem]
        ? computedItem[reportItem][reportItemValue]
          ? computedItem[reportItem][reportItemValue].units // cost, infrastructure, supplementary
          : computedItem[reportItem].units // capacity, limit, request, usage
        : undefined,
    };
  };

  private fetchReport = () => {
    const { fetchReport, perspective, queryString } = this.props;

    const reportPathsType = getReportPathsType(perspective);
    const reportType = getReportType(perspective);

    fetchReport(reportPathsType, reportType, queryString);
  };

  private getChartDatums = (computedItems: ComputedReportItem[]) => {
    const { computedReportItemType = ComputedReportItemType.cost } = this.props;

    const reportItem = computedReportItemType;
    const reportItemValue = 'total';
    const chartDatums = [];

    computedItems.map(computedItem => {
      const datums = [];

      if (computedItem instanceof Map) {
        const items = Array.from(computedItem.values());
        items.map(i => {
          const val = i[reportItem][reportItemValue] ? i[reportItem][reportItemValue].value : i[reportItem].value;
          datums.push(this.createReportDatum(val, i, reportItem, reportItemValue));
        });
      }
      chartDatums.push(datums);
    });
    return chartDatums;
  };

  private getChartTitle = (perspective: string) => {
    let result;
    switch (perspective) {
      case PerspectiveType.allCloud:
        result = 'explorer.title.all_cloud';
        break;
      case PerspectiveType.aws:
        result = 'explorer.title.aws';
        break;
      case PerspectiveType.awsCloud:
        result = 'explorer.title.aws_cloud';
        break;
      case PerspectiveType.azure:
        result = 'explorer.title.azure';
        break;
      case PerspectiveType.azureCloud:
        result = 'explorer.title.azure_cloud';
        break;
      case PerspectiveType.gcp:
        result = 'explorer.title.gcp';
        break;
      case PerspectiveType.ocp:
        result = 'explorer.title.ocp';
        break;
      case PerspectiveType.ocpSupplementary:
        result = 'explorer.title.ocp_supplementary';
        break;
      case PerspectiveType.ocpUsage:
        result = 'explorer.title.ocp_usage';
        break;
      default:
        result = undefined;
        break;
    }
    return result;
  };

  private getComputedItems = () => {
    const { report } = this.props;

    return getUnsortedComputedReportItems({
      report,
      idKey: this.getGroupBy(),
      daily: true,
    });
  };

  private getGroupBy = () => {
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = this.getGroupByOrg();
    const groupByTagKey = this.getGroupByTagKey();

    return groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById;
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      if (groupBy === orgUnitIdKey) {
        groupByOrg = query.group_by[orgUnitIdKey];
        break;
      }
    }
    return groupByOrg;
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTagKey;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
    return groupByTagKey;
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} size="md" />
        <Skeleton style={styles.legendSkeleton} size="xs" />
      </>
    );
  };

  public render() {
    const { perspective, reportFetchStatus, t } = this.props;

    const datums = this.getChartDatums(this.getComputedItems());

    // Todo: get title from perspective menu
    return (
      <>
        <div style={styles.titleContainer}>
          <Title headingLevel="h3" size="md">
            {t(this.getChartTitle(perspective))}
          </Title>
        </div>
        <div style={styles.chartContainer}>
          <div style={styles.costChart}>
            {reportFetchStatus === FetchStatus.inProgress ? (
              this.getSkeleton()
            ) : (
              <HistoricalExplorerChart
                adjustContainerHeight
                containerHeight={chartStyles.chartContainerHeight}
                formatDatumValue={formatValue}
                formatDatumOptions={{}}
                height={chartStyles.chartHeight}
                top1stData={datums.length > 0 ? datums[0] : []}
                top2ndData={datums.length > 1 ? datums[1] : []}
                top3rdData={datums.length > 2 ? datums[2] : []}
                top4thData={datums.length > 3 ? datums[3] : []}
                top5thData={datums.length > 4 ? datums[4] : []}
                top6thData={datums.length > 5 ? datums[5] : []}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerChartOwnProps, ExplorerChartStateProps>((state, props) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute);
  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
      limit: 5,
      offset: undefined,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || { [getGroupByDefault(perspective)]: '*' } || baseQuery.group_by,
    order_by: {
      cost: 'desc',
    },
    perspective,
  };
  const queryString = getQuery({
    ...query,
    perspective: undefined,
  });

  const reportPathsType = getReportPathsType(perspective);
  const reportType = getReportType(perspective);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  return {
    perspective,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: ExplorerChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const ExplorerChart = withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ExplorerChartBase)));

export { ExplorerChart, ExplorerChartProps };
