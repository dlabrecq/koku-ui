import { ReportPathsType, ReportType } from 'api/reports/report';
import { getCostType } from 'utils/localStorage';

export const reportStateKey = 'report';

export function getReportId(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  // Todo: Show new features in beta environment only
  if (insights.chrome.isBeta()) {
    switch (reportType) {
      case ReportType.cost:
      case ReportType.database:
      case ReportType.network:
        return `${reportPathsType}--${reportType}--${getCostType()}--${query}`;
    }
  }
  return `${reportPathsType}--${reportType}--${query}`;
}
