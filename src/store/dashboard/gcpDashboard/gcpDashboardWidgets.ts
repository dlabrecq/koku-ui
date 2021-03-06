import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { ForecastPathsType, ForecastType } from '../../../api/forecasts/forecast';
import { GcpDashboardTab, GcpDashboardWidget } from './gcpDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const computeWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.compute_title',
  forecastPathsType: ForecastPathsType.gcp,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'gcp_dashboard.usage_label',
  },
  filter: {
    service: 'Compute Engine',
  },
  tabsFilter: {
    service: 'Compute Engine',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'gcp_dashboard.compute_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.instanceType,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.instanceType,
};

export const costSummaryWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.gcp,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    appNavId: 'gcp',
    costKey: 'gcp_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.gcpDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: 'gcp_dashboard.daily_cost_trend_title',
    titleKey: 'gcp_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [GcpDashboardTab.services, GcpDashboardTab.projects, GcpDashboardTab.regions],
  chartType: DashboardChartType.dailyTrend,
  currentTab: GcpDashboardTab.services,
};

export const databaseWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.database_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.database,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service: 'Bigtable,Datastore,Database Migrations,Firestore,MemoryStore,Spanner,SQL',
  },
  tabsFilter: {
    service: 'Bigtable,Datastore,Database Migrations,Firestore,MemoryStore,Spanner,SQL',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'gcp_dashboard.database_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const networkWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.network_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.network,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service:
      'VPC network,Network services,Hybrid Connectivity,Network Service Tiers,Network Security,Network Intelligence',
  },
  tabsFilter: {
    service:
      'VPC network,Network services,Hybrid Connectivity,Network Service Tiers,Network Security,Network Intelligence',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'gcp_dashboard.network_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.services,
};

export const storageWidget: GcpDashboardWidget = {
  id: getId(),
  titleKey: 'gcp_dashboard.storage_title',
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  details: {
    costKey: 'gcp_dashboard.cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'gcp_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'gcp_dashboard.storage_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   GcpDashboardTab.services,
  //   GcpDashboardTab.accounts,
  //   GcpDashboardTab.regions,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: GcpDashboardTab.projects,
};
