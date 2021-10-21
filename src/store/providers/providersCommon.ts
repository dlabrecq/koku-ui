import { ProviderType } from 'api/providers';
import { ProvidersQuery } from 'api/queries/providersQuery';

export const stateKey = 'providers';
export const addProviderKey = 'add-provider';

export const awsProvidersQuery: ProvidersQuery = {
  type: 'AWS',
};

export const azureProvidersQuery: ProvidersQuery = {
  type: 'Azure',
};

export const gcpProvidersQuery: ProvidersQuery = {
  type: 'GCP',
};

export const ibmProvidersQuery: ProvidersQuery = {
  type: 'IBM',
};

export const ocpProvidersQuery: ProvidersQuery = {
  type: 'OCP',
};

export function getReportId(type: ProviderType, query: string) {
  return `${type}--${query}`;
}
