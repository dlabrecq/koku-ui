import type { ReportPathsType, ReportType } from 'api/reports/report';

// eslint-disable-next-line no-shadow
export const enum HistoricalDataWidgetType {
  cost = 'cost', // This type displays historical cost chart
  network = 'network', // This type displays historical network chart
  trend = 'trend', // This type displays historical trend chart
  usage = 'usage', // This type displays historical usage chart
  volume = 'volume', // This type displays historical volume chart
}

export interface HistoricalDataWidget {
  chartName: string; // Will be the prefix for ids within the chart
  id: number;
  network?: {
    showWidgetOnGroupBy?: string[]; // Show network chart when group_by is matched
  };
  reportPathsType: ReportPathsType; // Report URL path
  reportType: ReportType; // Report type; cost, storage, etc.
  type: HistoricalDataWidgetType;
}
