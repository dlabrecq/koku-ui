import { Title } from '@patternfly/react-core';
import { AngleLeftIcon } from '@patternfly/react-icons';
import {
  getQueryRoute,
  orgUnitDescriptionKey,
  orgUnitIdKey,
  orgUnitNameKey,
  Query,
} from 'api/queries/query';
import { Report, ReportPathsType } from 'api/reports/report';
import { TagLink } from 'pages/details/components/tag/tagLink';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getForDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';
import { breadcrumbOverride, styles } from './breakdownHeader.styles';

interface BreakdownHeaderOwnProps {
  filterBy: string | number;
  detailsURL?: string;
  description?: string;
  groupBy?: string;
  query: Query;
  report: Report;
  reportPathsType: ReportPathsType;
  tabs: React.ReactNode;
  title: string;
}

type BreakdownHeaderProps = BreakdownHeaderOwnProps & InjectedTranslateProps;

class BreakdownHeaderBase extends React.Component<BreakdownHeaderProps> {
  private buildDetailsLink = () => {
    const { detailsURL, groupBy, query } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Check for for org units used by the details page
    if (query[orgUnitIdKey]) {
      groupByKey = orgUnitIdKey;
      value = query[orgUnitIdKey];
    } else if (query.group_by[orgUnitIdKey]) {
      groupByKey = orgUnitIdKey;
      value = query.group_by[orgUnitIdKey];
    }

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: value,
      },
    };
    // Don't want these params when returning to the details page
    if (newQuery.filter) {
      newQuery[orgUnitDescriptionKey] = undefined;
      newQuery[orgUnitIdKey] = undefined;
      newQuery[orgUnitNameKey] = undefined;
    }
    return `${detailsURL}?${getQueryRoute(newQuery)}`;
  };

  private getTotalCost = () => {
    const { report } = this.props;

    const hasCost =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;
    const cost = formatValue(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD'
    );

    return cost;
  };

  public render() {
    const {
      description,
      filterBy,
      groupBy,
      reportPathsType,
      t,
      tabs,
      title,
    } = this.props;
    const showTags =
      groupBy === 'account' ||
      groupBy === 'project' ||
      groupBy === 'subscription_guid';

    return (
      <header style={styles.header}>
        <div>
          <nav
            aria-label="breadcrumb"
            className={`pf-c-breadcrumb ${breadcrumbOverride}`}
          >
            <ol className="pf-c-breadcrumb__list">
              <li className="pf-c-breadcrumb__item">
                <span className="pf-c-breadcrumb__item-divider">
                  <AngleLeftIcon />
                </span>
                <Link to={this.buildDetailsLink()}>
                  {t('breakdown.back_to_details', {
                    groupBy,
                    value: reportPathsType,
                  })}
                </Link>
              </li>
            </ol>
          </nav>
          <Title headingLevel="h2" style={styles.title} size="xl">
            {t('breakdown.title', { value: title })}
            {description && (
              <div style={styles.infoDescription}>{description}</div>
            )}
          </Title>
          <div style={styles.tabs}>
            {tabs}
            <div style={styles.tag}>
              {Boolean(showTags) && (
                <TagLink
                  filterBy={filterBy}
                  groupBy={groupBy}
                  id="tags"
                  reportPathsType={reportPathsType}
                />
              )}
            </div>
          </div>
        </div>
        <div style={styles.cost}>
          <div style={styles.costLabel}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              <span>{this.getTotalCost()}</span>
            </Title>
          </div>
          <div style={styles.costLabelDate}>
            {getForDateRangeString(groupBy, 'breakdown.total_cost_date')}
          </div>
        </div>
      </header>
    );
  }
}

const BreakdownHeader = translate()(BreakdownHeaderBase);

export { BreakdownHeader, BreakdownHeaderProps };
