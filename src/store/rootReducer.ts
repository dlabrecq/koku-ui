import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { combineReducers } from 'redux';
import { costModelsReducer, costModelsStateKey } from 'store/costModels';
import { onboardingReducer, onboardingStateKey } from 'store/onboarding';
import { priceListReducer, priceListStateKey } from 'store/priceList';
import {
  deleteDialogReducer,
  deleteDialogStateKey,
} from 'store/sourceDeleteDialog';
import { sourcesReducer, sourcesStateKey } from 'store/sourceSettings';
import { StateType } from 'typesafe-actions';
import { awsDashboardReducer, awsDashboardStateKey } from './awsDashboard';
import { awsExportReducer, awsExportStateKey } from './awsExport';
import { awsReportsReducer, awsReportsStateKey } from './awsReports';
import {
  azureDashboardReducer,
  azureDashboardStateKey,
} from './azureDashboard';
import { azureExportReducer, azureExportStateKey } from './azureExport';
import { azureReportsReducer, azureReportsStateKey } from './azureReports';
import { ocpDashboardReducer, ocpDashboardStateKey } from './ocpDashboard';
import { ocpExportReducer, ocpExportStateKey } from './ocpExport';
import {
  ocpOnCloudDashboardReducer,
  ocpOnCloudDashboardStateKey,
} from './ocpOnCloudDashboard';
import {
  ocpOnCloudExportReducer,
  ocpOnCloudExportStateKey,
} from './ocpOnCloudExport';
import {
  ocpOnCloudReportsReducer,
  ocpOnCloudReportsStateKey,
} from './ocpOnCloudReports';
import { ocpReportsReducer, ocpReportsStateKey } from './ocpReports';
import { providersReducer, providersStateKey } from './providers';
import { sessionReducer, sessionStateKey } from './session';
import { uiReducer, uiStateKey } from './ui';

export type RootState = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  [awsDashboardStateKey]: awsDashboardReducer,
  [awsExportStateKey]: awsExportReducer,
  [awsReportsStateKey]: awsReportsReducer,
  [azureDashboardStateKey]: azureDashboardReducer,
  [azureExportStateKey]: azureExportReducer,
  [azureReportsStateKey]: azureReportsReducer,
  [ocpDashboardStateKey]: ocpDashboardReducer,
  [ocpExportStateKey]: ocpExportReducer,
  [ocpOnCloudDashboardStateKey]: ocpOnCloudDashboardReducer,
  [ocpOnCloudDashboardStateKey]: ocpOnCloudDashboardReducer,
  [ocpOnCloudExportStateKey]: ocpOnCloudExportReducer,
  [ocpOnCloudReportsStateKey]: ocpOnCloudReportsReducer,
  [ocpReportsStateKey]: ocpReportsReducer,
  [priceListStateKey]: priceListReducer,
  [providersStateKey]: providersReducer,
  [sessionStateKey]: sessionReducer,
  [sourcesStateKey]: sourcesReducer,
  [costModelsStateKey]: costModelsReducer,
  [deleteDialogStateKey]: deleteDialogReducer,
  [uiStateKey]: uiReducer,
  [onboardingStateKey]: onboardingReducer,
  notifications,
});
