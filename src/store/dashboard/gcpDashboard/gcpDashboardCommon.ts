import { GcpFilters, GcpQuery, getQuery } from 'api/queries/gcpQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const gcpDashboardStateKey = 'gcpDashboard';
export const gcpDashboardDefaultFilters: GcpFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const gcpDashboardTabFilters: GcpFilters = {
  ...gcpDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum GcpDashboardTab {
  accounts = 'accounts',
  gcpProjects = 'gcp_projects',
  instanceType = 'instance_type',
  projects = 'projects',
  regions = 'regions',
  services = 'services',
}

export interface GcpDashboardWidget extends DashboardWidget<GcpDashboardTab> {}

export function getGroupByForTab(widget: GcpDashboardWidget): GcpQuery['group_by'] {
  switch (widget.currentTab) {
    case GcpDashboardTab.services:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        service: widget.tabsFilter && widget.tabsFilter.service ? widget.tabsFilter.service : '*',
      };
    case GcpDashboardTab.accounts:
      return { account: '*' };
    case GcpDashboardTab.gcpProjects:
      return { gcp_project: '*' };
    case GcpDashboardTab.projects:
      return { project: '*' };
    case GcpDashboardTab.regions:
      return { region: '*' };
    case GcpDashboardTab.instanceType:
      return { instance_type: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: GcpFilters = gcpDashboardDefaultFilters, props?) {
  const query: GcpQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(widget: GcpDashboardWidget, filter: GcpFilters = gcpDashboardDefaultFilters) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === GcpDashboardTab.services && widget.tabsFilter && widget.tabsFilter.service) {
    newFilter.service = undefined;
  }
  const query: GcpQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
