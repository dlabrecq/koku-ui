import './reportSummary.scss';

import { Card, CardBody, CardFooter, CardTitle, Skeleton, Title, TitleSizes } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { skeletonWidth } from 'utils/skeleton';

interface ReportSummaryProps extends WithTranslation {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  title: string;
}

const ReportSummaryBase: React.SFC<ReportSummaryProps> = ({ children, detailsLink, title, subTitle, status }) => (
  <Card className="reportSummary">
    <CardTitle>
      <Title headingLevel="h2" size={TitleSizes.lg}>
        {title}
      </Title>
      {Boolean(subTitle) && <p className="subtitle">{subTitle}</p>}
    </CardTitle>
    <CardBody>
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton width="16%" />
          <Skeleton className="chartSkeleton" width={skeletonWidth.md} />
          <Skeleton width="33%" />
          <Skeleton className="legendSkeleton" width={skeletonWidth.xs} />
        </>
      ) : (
        children
      )}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const ReportSummary = withTranslation()(ReportSummaryBase);

export { ReportSummary, ReportSummaryProps };
