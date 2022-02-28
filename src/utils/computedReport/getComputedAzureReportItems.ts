import { AzureQuery } from 'api/queries/azureQuery';
import { AzureReport, AzureReportItem } from 'api/reports/azureReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedAzureReportItemsParams extends ComputedReportItemsParams<AzureReport, AzureReportItem> {}

export function getIdKeyForGroupBy(groupBy: AzureQuery['group_by'] = {}): ComputedAzureReportItemsParams['idKey'] {
  if (groupBy.subscription_guid) {
    return 'subscription_guid';
  }
  if (groupBy.resource_location) {
    return 'resource_location';
  }
  if (groupBy.service_name) {
    return 'service_name';
  }
  return 'date';
}
