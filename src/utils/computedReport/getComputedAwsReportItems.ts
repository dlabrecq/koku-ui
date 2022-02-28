import { AwsQuery } from 'api/queries/awsQuery';
import { AwsReport, AwsReportItem } from 'api/reports/awsReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedAwsReportItemsParams extends ComputedReportItemsParams<AwsReport, AwsReportItem> {}

export function getIdKeyForGroupBy(groupBy: AwsQuery['group_by'] = {}): ComputedAwsReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.org_unit_id) {
    return 'org_unit_id';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
