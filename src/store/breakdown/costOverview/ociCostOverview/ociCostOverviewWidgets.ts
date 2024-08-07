import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import type { OciCostOverviewWidget } from 'store/breakdown/costOverview/ociCostOverview';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OciCostOverviewWidget = {
  chartName: 'ociCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'payer_tenant_id',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'product_service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['payer_tenant_id', 'product_service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: OciCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'product_service',
  },
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'payer_tenant_id', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
