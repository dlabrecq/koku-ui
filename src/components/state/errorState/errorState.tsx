import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/js/icons/error-circle-o-icon';
import { LockIcon } from '@patternfly/react-icons/dist/js/icons/lock-icon';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './errorState.styles';

interface ErrorStateProps extends InjectedTranslateProps {
  error: AxiosError;
  icon?: any;
}

const ErrorStateBase: React.SFC<ErrorStateProps> = ({
  error,
  icon = ErrorCircleOIcon,
  t,
}) => {
  let title = t('error_state.unexpected_title');
  let subTitle = t('error_state.unexpected_desc');

  if (
    error &&
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    icon = LockIcon;
    title = t('error_state.unauthorized_title');
    subTitle = t('error_state.unauthorized_desc');
  }

  return (
    <div style={styles.container}>
      <PfEmptyState>
        <EmptyStateIcon icon={icon} />
        <Title headingLevel="h2" size="lg">
          {title}
        </Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

const ErrorState = translate()(ErrorStateBase);

export { ErrorState };
