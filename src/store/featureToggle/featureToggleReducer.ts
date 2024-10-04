import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureToggleActions';
import { setFeatureToggle } from './featureToggleActions';

export type FeatureToggleAction = ActionType<typeof setFeatureToggle | typeof resetState>;

export type FeatureToggleState = Readonly<{
  hasFeatureToggle: boolean;
  isAccountInfoEmptyStateToggleEnabled: boolean;
  isAwsEc2InstancesToggleEnabled: boolean;
  isChartSkeletonToggleEnabled: boolean;
  isDebugToggleEnabled: boolean;
  isDetailsDateRangeToggleEnabled: boolean;
  isExportsToggleEnabled: boolean;
  isFinsightsToggleEnabled: boolean;
  isIbmToggleEnabled: boolean;
  isOcpCloudGroupBysToggleEnabled: boolean;
}>;

export const defaultState: FeatureToggleState = {
  hasFeatureToggle: false,
  isAccountInfoEmptyStateToggleEnabled: false,
  isAwsEc2InstancesToggleEnabled: false,
  isChartSkeletonToggleEnabled: false,
  isDebugToggleEnabled: false,
  isDetailsDateRangeToggleEnabled: false,
  isExportsToggleEnabled: false,
  isFinsightsToggleEnabled: false,
  isIbmToggleEnabled: false,
  isOcpCloudGroupBysToggleEnabled: false,
};

export const stateKey = 'FeatureToggle';

export function FeatureToggleReducer(state = defaultState, action: FeatureToggleAction): FeatureToggleState {
  switch (action.type) {
    case getType(setFeatureToggle):
      return {
        ...state,
        hasFeatureToggle: true,
        isAccountInfoEmptyStateToggleEnabled: action.payload.isAccountInfoEmptyStateToggleEnabled,
        isAwsEc2InstancesToggleEnabled: action.payload.isAwsEc2InstancesToggleEnabled,
        isChartSkeletonToggleEnabled: action.payload.isChartSkeletonToggleEnabled,
        isDebugToggleEnabled: action.payload.isDebugToggleEnabled,
        isDetailsDateRangeToggleEnabled: action.payload.isDetailsDateRangeToggleEnabled,
        isExportsToggleEnabled: action.payload.isExportsToggleEnabled,
        isFinsightsToggleEnabled: action.payload.isFinsightsToggleEnabled,
        isIbmToggleEnabled: action.payload.isIbmToggleEnabled,
        isOcpCloudGroupBysToggleEnabled: action.payload.isOcpCloudGroupBysToggleEnabled,
      };

    default:
      return state;
  }
}
