import { ForecastPathsType, ForecastType } from 'api/forecasts/forecast';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedForecastItemType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartDatumUtils';
import { paths } from 'routes';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';

import { AzureDashboardTab, AzureDashboardWidget } from './azureDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.cost_title',
  forecastPathsType: ForecastPathsType.azure,
  forecastType: ForecastType.cost,
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  details: {
    adjustContainerHeight: true,
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
    viewAllPath: paths.azureDetails,
  },
  tabsFilter: {
    limit: 3,
  },
  trend: {
    computedForecastItem: ComputedForecastItemType.cost,
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    dailyTitleKey: 'azure_dashboard.daily_cost_trend_title',
    titleKey: 'azure_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    AzureDashboardTab.service_names,
    AzureDashboardTab.subscription_guids,
    AzureDashboardTab.resource_locations,
  ],
  chartType: DashboardChartType.dailyTrend,
  currentTab: AzureDashboardTab.service_names,
};

export const databaseWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.database_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.database,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service_name: 'Database,Cosmos DB,Cache for Redis',
  },
  tabsFilter: {
    service_name: 'Database,Cosmos DB,Cache for Redis',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.service_names,
};

export const networkWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.network_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.network,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
  },
  filter: {
    service_name: 'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  tabsFilter: {
    service_name: 'Virtual Network,VPN,DNS,Traffic Manager,ExpressRoute,Load Balancer,Application Gateway',
  },
  trend: {
    computedReportItem: ComputedReportItemType.cost,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'dashboard.cumulative_cost_comparison',
    type: ChartType.rolling,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.service_names,
};

export const storageWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'dashboard.storage_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  filter: {
    service_name: 'Storage',
  },
  tabsFilter: {
    service_name: 'Storage',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.service_names,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.subscription_guids,
};

export const virtualMachineWidget: AzureDashboardWidget = {
  id: getId(),
  titleKey: 'azure_dashboard.compute_title',
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  details: {
    costKey: 'cost',
    formatOptions: {
      fractionDigits: 2,
    },
    showUnits: true,
    showUsageFirst: true,
    showUsageLegendLabel: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'dashboard.usage',
  },
  filter: {
    service_name: 'Virtual Machines',
  },
  tabsFilter: {
    service_name: 'Virtual Machines',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'dashboard.daily_usage_comparison',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   AzureDashboardTab.instanceType,
  //   AzureDashboardTab.subscription_guids,
  //   AzureDashboardTab.resource_locations,
  // ],
  chartType: DashboardChartType.trend,
  currentTab: AzureDashboardTab.instanceType,
};
