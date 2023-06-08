import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { resetState } from './featureFlagsActions';
import { setFeatureFlags } from './featureFlagsActions';

export type FeatureFlagsAction = ActionType<typeof setFeatureFlags | typeof resetState>;

export type FeatureFlagsState = Readonly<{
  hasFeatureFlags: boolean;
  isCostCategoriesFeatureEnabled: boolean;
  isCostDistributionFeatureEnabled: boolean;
  isExportsFeatureEnabled: boolean;
  isFinsightsFeatureEnabled: boolean;
  isIbmFeatureEnabled: boolean;
  isRosFeatureEnabled: boolean;
  isSettingsFeatureEnabled: boolean;
  isSettingsPlatformFeatureEnabled: boolean;
}>;

export const defaultState: FeatureFlagsState = {
  hasFeatureFlags: false,
  isCostCategoriesFeatureEnabled: false,
  isCostDistributionFeatureEnabled: false,
  isExportsFeatureEnabled: false,
  isFinsightsFeatureEnabled: false,
  isIbmFeatureEnabled: false,
  isRosFeatureEnabled: false,
  isSettingsFeatureEnabled: false,
  isSettingsPlatformFeatureEnabled: false,
};

export const stateKey = 'featureFlags';

export function featureFlagsReducer(state = defaultState, action: FeatureFlagsAction): FeatureFlagsState {
  switch (action.type) {
    case getType(setFeatureFlags):
      return {
        ...state,
        hasFeatureFlags: true,
        isCostCategoriesFeatureEnabled: action.payload.isCostCategoriesFeatureEnabled,
        isCostDistributionFeatureEnabled: action.payload.isCostDistributionFeatureEnabled,
        isExportsFeatureEnabled: action.payload.isExportsFeatureEnabled,
        isFinsightsFeatureEnabled: action.payload.isFinsightsFeatureEnabled,
        isIbmFeatureEnabled: action.payload.isIbmFeatureEnabled,
        isRosFeatureEnabled: action.payload.isRosFeatureEnabled,
        isSettingsFeatureEnabled: action.payload.isSettingsFeatureEnabled,
        isSettingsPlatformFeatureEnabled: action.payload.isSettingsPlatformFeatureEnabled,
      };

    default:
      return state;
  }
}
