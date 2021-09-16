import './breakdownHeader.scss';

import { Title, TitleSizes } from '@patternfly/react-core';
import { AngleLeftIcon } from '@patternfly/react-icons/dist/esm/icons/angle-left-icon';
import { breakdownDescKey, breakdownTitleKey, getQueryRoute, orgUnitIdKey, Query } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { Currency } from 'components/currency/currency';
import messages from 'locales/messages';
import { TagLink } from 'pages/views/details/components/tag/tagLink';
import { getGroupByOrgValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { getForDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/format';

import { styles } from './breakdownHeader.styles';

interface BreakdownHeaderOwnProps {
  detailsURL?: string;
  description?: string;
  groupBy?: string;
  query: Query;
  report: Report;
  tabs: React.ReactNode;
  tagReportPathsType: TagPathsType;
  title: string;
}

type BreakdownHeaderProps = BreakdownHeaderOwnProps & WrappedComponentProps;

class BreakdownHeaderBase extends React.Component<BreakdownHeaderProps> {
  private buildDetailsLink = () => {
    const { detailsURL, groupBy, query } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Retrieve org unit used by the details page
    if (query[orgUnitIdKey]) {
      groupByKey = orgUnitIdKey;
      value = query[orgUnitIdKey];
    }

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: value,
      },
    };
    // Don't want these params when returning to the details page
    if (newQuery.filter) {
      newQuery.filter.account = undefined;
      newQuery[breakdownDescKey] = undefined;
      newQuery[orgUnitIdKey] = undefined;
      newQuery[breakdownTitleKey] = undefined;
    }
    return `${detailsURL}?${getQueryRoute(newQuery)}`;
  };

  private getTotalCost = () => {
    const { report } = this.props;

    const hasCost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total;
    const cost = formatCurrency(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD'
    );

    return cost;
  };

  public render() {
    const { description, groupBy, query, intl, tabs, tagReportPathsType, title } = this.props;

    const filterByAccount = query && query.filter ? query.filter.account : undefined;
    const groupByOrg = getGroupByOrgValue(query);
    const showTags =
      filterByAccount || groupBy === 'account' || groupBy === 'project' || groupBy === 'subscription_guid';

    // i18n groupBy key
    const groupByKey = groupBy ? groupBy : filterByAccount ? 'account' : groupByOrg ? orgUnitIdKey : undefined;

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <nav aria-label={intl.formatMessage(messages.BreakdownBackToDetailsAriaLabel)} className="breadcrumbOverride">
            <ol className="pf-c-breadcrumb__list">
              <li className="pf-c-breadcrumb__item">
                <span className="pf-c-breadcrumb__item-divider">
                  <AngleLeftIcon />
                </span>
                <Link to={this.buildDetailsLink()}>
                  {intl.formatMessage(messages.BreakdownBackToDetails, {
                    value: tagReportPathsType,
                    groupBy: groupByKey,
                  })}
                </Link>
              </li>
            </ol>
          </nav>
          <Currency />
        </div>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {intl.formatMessage(messages.BreakdownTitle, { value: title })}
            {description && <div style={styles.infoDescription}>{description}</div>}
          </Title>
          <div style={styles.cost}>
            <div style={styles.costLabel}>
              <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                <span>{this.getTotalCost()}</span>
              </Title>
            </div>
            <div style={styles.costLabelDate}>
              {getForDateRangeString(
                intl.formatMessage(messages.GroupByValuesTitleCase, { value: groupByKey, count: 2 }),
                messages.BreakdownTotalCostDate,
                0
              )}
            </div>
          </div>
        </div>
        <div>
          <div style={styles.tabs}>
            {tabs}
            <div style={styles.tag}>
              {Boolean(showTags) && <TagLink id="tags" tagReportPathsType={tagReportPathsType} />}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const BreakdownHeader = injectIntl(BreakdownHeaderBase);

export { BreakdownHeader, BreakdownHeaderProps };
