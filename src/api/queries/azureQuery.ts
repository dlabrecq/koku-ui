import * as utils from './query';

export interface AzureFilters extends utils.Filters {
  subscription_guid?: string | number;
}

type AzureGroupByValue = string | string[];

interface AzureGroupBys {
  service_name?: AzureGroupByValue;
  subscription_guid?: AzureGroupByValue;
  instance_type?: AzureGroupByValue;
  resource_location?: AzureGroupByValue;
}

interface AzureOrderBys {
  subscription_guid?: string;
  resource_location?: string;
  service_name?: string;
  cost?: string;
  usage?: string;
}

export interface AzureQuery extends utils.Query {
  delta?: string;
  filter?: AzureFilters;
  group_by?: AzureGroupBys;
  order_by?: AzureOrderBys;
}

export function getQueryRoute(query: AzureQuery) {
  return utils.getQueryRoute(query);
}

export function getQuery(query: AzureQuery) {
  return utils.getQuery(query);
}

export function parseQuery<T = any>(query: string): T {
  return utils.parseQuery(query);
}
