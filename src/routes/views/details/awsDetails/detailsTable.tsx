import 'routes/views/details/components/dataTable/dataTable.scss';

import type { AwsQuery } from 'api/queries/awsQuery';
import { getQuery } from 'api/queries/awsQuery';
import { tagPrefix } from 'api/queries/query';
import type { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { paths } from 'routes';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Actions } from 'routes/views/details/components/actions';
import { DataTable } from 'routes/views/details/components/dataTable';
import { styles } from 'routes/views/details/components/dataTable/dataTable.styles';
import { getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import { getOrgBreakdownPath } from 'routes/views/utils/paths';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dates';
import { formatCurrency, formatPercentage } from 'utils/format';

interface DetailsTableOwnProps {
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  query: AwsQuery;
  report: AwsReport;
  selectedItems?: ComputedReportItem[];
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WrappedComponentProps;

const reportPathsType = ReportPathsType.aws;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { query, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { isAllSelected, query, report, selectedItems, intl } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
    });

    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              name: '',
            },
            {
              name: groupByOrg
                ? intl.formatMessage(messages.names, { count: 2 })
                : intl.formatMessage(messages.tagNames),
            },
            {
              name: intl.formatMessage(messages.monthOverMonthChange),
            },
            {
              orderBy: 'cost',
              name: intl.formatMessage(messages.cost),
              style: styles.costColumn,
              ...(computedItems.length && { isSortable: true }),
            },
            {
              name: '',
            },
          ]
        : [
            {
              name: '',
            },
            {
              orderBy: groupById === 'account' ? 'account_alias' : groupById,
              name: intl.formatMessage(messages.detailsResourceNames, { value: groupById }),
              ...(computedItems.length && { isSortable: true }),
            },
            {
              name: intl.formatMessage(messages.monthOverMonthChange),
            },
            {
              orderBy: 'cost',
              name: intl.formatMessage(messages.cost),
              style: styles.costColumn,
              ...(computedItems.length && { isSortable: true }),
            },
            {
              name: '',
            },
          ];

    computedItems.map((item, index) => {
      const label = item && item.label && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item, index);

      let name = (
        <Link
          to={getOrgBreakdownPath({
            basePath: paths.awsDetailsBreakdown,
            description: item.id,
            groupBy: groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById,
            groupByOrg,
            id: item.id,
            orgUnitId: getGroupByOrgValue(query),
            query,
            title: item.label,
            type: item.type,
          })}
        >
          {label}
        </Link>
      );

      const selectable = !(label === `no-${groupById}` || label === `no-${groupByTagKey}`);
      if (!selectable) {
        name = label as any;
      }

      const desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;

      rows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: (
              <div>
                {name}
                {desc}
              </div>
            ),
          },
          { value: <div>{monthOverMonth}</div> },
          { value: <div>{cost}</div> },
          { value: <div>{actions}</div> },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
        selectionDisabled: !selectable,
      });
    });

    this.setState({
      columns,
      rows,
    });
  };

  private getActions = (item: ComputedReportItem, index: number, disabled: boolean = false) => {
    const { groupBy, query } = this.props;

    return (
      <Actions groupBy={groupBy} isDisabled={disabled} item={item} query={query} reportPathsType={reportPathsType} />
    );
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { intl } = this.props;
    const value = formatCurrency(Math.abs(item.cost.total.value - item.delta_value), item.cost.total.units);
    const percentage = item.delta_percent !== null ? formatPercentage(Math.abs(item.delta_percent)) : 0;

    const showPercentage = !(percentage === 0 || percentage === '0.00');
    const showValue = item.delta_percent !== null; // Workaround for https://github.com/project-koku/koku/issues/1395

    let iconOverride;
    if (showPercentage) {
      iconOverride = 'iconOverride';
      if (item.delta_percent !== null && item.delta_value < 0) {
        iconOverride += ' decrease';
      }
      if (item.delta_percent !== null && item.delta_value > 0) {
        iconOverride += ' increase';
      }
    }

    if (!showValue) {
      return getNoDataForDateRangeString();
    } else {
      return (
        <div className="monthOverMonthOverride">
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {showPercentage ? intl.formatMessage(messages.percent, { value: percentage }) : <EmptyValueState />}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value > 0) && (
              <span className="fa fa-sort-up" style={styles.infoArrow} key={`month-over-month-icon-${index}`} />
            )}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value < 0) && (
              <span
                className="fa fa-sort-down"
                style={{
                  ...styles.infoArrow,
                  ...styles.infoArrowDesc,
                }}
                key={`month-over-month-icon-${index}`}
              />
            )}
          </div>
          <div style={styles.infoDescription} key={`month-over-month-info-${index}`}>
            {getForDateRangeString(value)}
          </div>
        </div>
      );
    }
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost.total.value / cost) * 100).toFixed(2);

    return (
      <>
        {formatCurrency(item.cost.total.value, item.cost.total.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  public render() {
    const { isLoading, onSelected, onSort, query, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        isLoading={isLoading}
        onSelected={onSelected}
        onSort={onSort}
        query={query}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const DetailsTable = injectIntl(DetailsTableBase);

export { DetailsTable };
export type { DetailsTableProps };
