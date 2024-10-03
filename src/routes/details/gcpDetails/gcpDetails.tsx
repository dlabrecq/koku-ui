import { Alert, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { GcpQuery } from 'api/queries/gcpQuery';
import { getQuery, parseQuery } from 'api/queries/gcpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { GcpReport } from 'api/reports/gcpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { routes } from 'routes';
import { ExportModal } from 'routes/components/export';
import { Loading } from 'routes/components/page/loading';
import { NoData } from 'routes/components/page/noData';
import { NoProviders } from 'routes/components/page/noProviders';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { ProviderDetails } from 'routes/details/components/providerDetails';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedGcpReportItems';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getGroupByTagKey } from 'routes/utils/groupBy';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from 'routes/utils/providers';
import { getRouteForQuery } from 'routes/utils/query';
import {
  handleOnCurrencySelect,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from 'routes/utils/queryNavigate';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getSinceDateRangeString } from 'utils/dates';
import { formatPath } from 'utils/paths';
import { noPrefix, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import { getCurrency } from 'utils/sessionStorage';

import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { styles } from './gcpDetails.styles';

interface GcpDetailsStateProps {
  currency?: string;
  isAccountInfoEmptyStateToggleEnabled?: boolean;
  isCurrentMonthData?: boolean;
  isDetailsDateRangeToggleEnabled?: boolean;
  isPreviousMonthData?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: GcpQuery;
  report: GcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
  timeScopeValue?: number;
}

interface GcpDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface GcpDetailsState {
  columns?: any[];
  isAllSelected?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

type GcpDetailsOwnProps = RouterComponentProps & WrappedComponentProps;

type GcpDetailsProps = GcpDetailsStateProps & GcpDetailsOwnProps & GcpDetailsDispatchProps;

const baseQuery: GcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
  },
  exclude: {},
  filter_by: {},
  group_by: {
    account: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.gcp;

class GcpDetails extends React.Component<GcpDetailsProps, GcpDetailsState> {
  protected defaultState: GcpDetailsState = {
    columns: [],
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: GcpDetailsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: GcpDetailsProps, prevState: GcpDetailsState) {
    const { report, reportError, reportQueryString, router } = this.props;
    const { selectedItems } = this.state;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { query, report, reportQueryString, timeScopeValue } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report?.meta ? report.meta.count : 0;

    // Omit items labeled 'no-project'
    const items = [];
    selectedItems.map(item => {
      if (!(item.label === `${noPrefix}${groupById}` || item.label === `${noPrefix}${groupByTagKey}`)) {
        items.push(item);
      }
    });
    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        items={items}
        onClose={this.handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, router, report } = this.props;

    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta?.filter?.limit ? report.meta.filter.limit : baseQuery.filter.limit;
    const offset = report?.meta?.filter?.offset ? report.meta.filter.offset : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(query, router, report, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.gcp),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { query, report, reportFetchStatus, reportQueryString, router, timeScopeValue } = this.props;
    const { isAllSelected, selectedItems } = this.state;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <DetailsTable
        basePath={formatPath(routes.gcpBreakdown.path)}
        breadcrumbPath={formatPath(`${routes.gcpDetails.path}${location.search}`)}
        filterBy={query.filter_by}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        groupByTagKey={groupByTagKey}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelect={this.handleonSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, router, report, timeScopeValue } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <DetailsToolbar
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelect={this.handleOnBulkSelect}
        onExportClicked={this.handleOnExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
        pagination={this.getPagination(isDisabled)}
        query={query}
        selectedItems={selectedItems}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private handleOnBulkSelect = (action: string) => {
    const { isAllSelected, selectedItems } = this.state;

    if (action === 'none') {
      this.setState({ isAllSelected: false, selectedItems: [] });
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      this.getComputedItems().map(val => {
        if (!newSelectedItems.find(item => item.id === val.id)) {
          newSelectedItems.push(val);
        }
      });
      this.setState({
        isAllSelected: false,
        selectedItems: newSelectedItems,
      });
    } else if (action === 'all') {
      this.setState({ isAllSelected: !isAllSelected, selectedItems: [] });
    }
  };

  private handleOnExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  private handleOnExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleOnGroupBySelect = groupBy => {
    const { query, router } = this.props;
    const groupByKey: keyof GcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: undefined, // Clear sort
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
  };

  private handleonSelect = (items: ComputedReportItem[], isSelected: boolean = false) => {
    const { isAllSelected, selectedItems } = this.state;

    let newItems = [...(isAllSelected ? this.getComputedItems() : selectedItems)];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.id !== item.id);
        });
      }
    }
    this.setState({ isAllSelected: false, selectedItems: newItems });
  };

  private updateReport = () => {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const {
      currency,
      intl,
      isAccountInfoEmptyStateToggleEnabled,
      isCurrentMonthData,
      isDetailsDateRangeToggleEnabled,
      isPreviousMonthData,
      providers,
      providersFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
      timeScopeValue,
    } = this.props;

    const computedItems = this.getComputedItems();
    const groupById = getIdKeyForGroupBy(query.group_by);
    const isDisabled = computedItems.length === 0;
    const title = intl.formatMessage(messages.gcpDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empty data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.gcp} title={title} />;
      }
      if (isDetailsDateRangeToggleEnabled ? !isCurrentMonthData && !isPreviousMonthData : !isCurrentMonthData) {
        return (
          <NoData
            detailsComponent={
              isAccountInfoEmptyStateToggleEnabled ? <ProviderDetails providerType={ProviderType.gcp} /> : undefined
            }
            title={title}
          />
        );
      }
    }

    return (
      <div style={styles.gcpDetails}>
        <DetailsHeader
          currency={currency}
          groupBy={groupById}
          isCurrentMonthData={isCurrentMonthData}
          isPreviousMonthData={isPreviousMonthData}
          onCurrencySelect={() => handleOnCurrencySelect(query, router)}
          onGroupBySelect={this.handleOnGroupBySelect}
          query={query}
          report={report}
          timeScopeValue={timeScopeValue}
        />
        <div style={styles.content}>
          <div style={styles.toolbarContainer}>
            {!isCurrentMonthData && isDetailsDateRangeToggleEnabled && (
              <Alert
                isInline
                title={intl.formatMessage(messages.noCurrentData, {
                  dateRange: getSinceDateRangeString(),
                })}
                variant="info"
              />
            )}
            {this.getToolbar(computedItems)}
          </div>
          {this.getExportModal(computedItems)}
          {reportFetchStatus === FetchStatus.inProgress ? (
            <Loading />
          ) : (
            <>
              <div style={styles.tableContainer}>{this.getTable()}</div>
              <div style={styles.paginationContainer}>
                <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GcpDetailsOwnProps, GcpDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<GcpQuery>(router.location.search);

  const currency = getCurrency();

  // Check for current and previous data first
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  // Fetch based on time scope value
  const filteredProviders = filterProviders(providers, ProviderType.gcp);
  const isCurrentMonthData = hasCurrentMonthData(filteredProviders);
  const isDetailsDateRangeToggleEnabled = FeatureToggleSelectors.selectIsDetailsDateRangeToggleEnabled(state);

  let timeScopeValue = getTimeScopeValue(queryFromRoute);
  timeScopeValue = Number(
    !isCurrentMonthData && isDetailsDateRangeToggleEnabled ? -2 : timeScopeValue !== undefined ? timeScopeValue : -1
  );

  const query: any = {
    ...baseQuery,
    ...queryFromRoute,
    filter: {
      ...queryFromRoute.filter,
      time_scope_value: timeScopeValue,
    },
  };
  const reportQuery = {
    currency,
    delta: 'cost',
    exclude: query.exclude,
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
    },
    filter_by: query.filter_by,
    group_by: query.group_by,
    order_by: query.order_by,
  };

  const reportQueryString = getQuery(reportQuery);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  return {
    currency,
    isAccountInfoEmptyStateToggleEnabled: FeatureToggleSelectors.selectIsAccountInfoEmptyStateToggleEnabled(state),
    isCurrentMonthData,
    isDetailsDateRangeToggleEnabled,
    isPreviousMonthData: hasPreviousMonthData(filteredProviders),
    providers: filteredProviders,
    providersError,
    providersFetchStatus,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    timeScopeValue,
  };
});

const mapDispatchToProps: GcpDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(GcpDetails)));
