import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { Unavailable } from '@redhat-cloud-services/frontend-components/components/Unavailable';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface NoProvidersOwnProps {
  title?: string;
}

type NotAvailableProps = NoProvidersOwnProps & RouteComponentProps<void>;

const NotAvailable = ({ title }: NotAvailableProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <Main>
        <Unavailable />
      </Main>
    </>
  );
};

export default withRouter(NotAvailable);
