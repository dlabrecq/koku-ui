import { Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useFlagsStatus, useUnleashClient, useUnleashContext } from '@unleash/proxy-client-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { featureFlagsActions } from 'store/featureFlags';

import { styles } from './featureFlags.styles';

interface FeatureFlagsOwnProps {
  children?: React.ReactNode;
}

type FeatureFlagsProps = FeatureFlagsOwnProps & RouteComponentProps<void>;

// eslint-disable-next-line no-shadow
const enum FeatureToggle {
  currency = 'cost-management.ui.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  excludes = 'cost-management.ui.negative-filtering', // Contains filter https://issues.redhat.com/browse/COST-2773
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.ui.oci', // Oracle Cloud Infrastructure https://issues.redhat.com/browse/COST-2358
}

let userId;
const insights = (window as any).insights;
if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
  insights.chrome.auth.getUser().then(user => {
    userId = user.identity.account_number;
  });
}

// The FeatureFlags component saves feature flags in store because Unleash hooks are only supported by function components
const FeatureFlagsBase: React.FC<FeatureFlagsProps> = ({ children = null }) => {
  const dispatch = useDispatch();
  const { flagsReady } = useFlagsStatus();
  const updateContext = useUnleashContext();
  const client = useUnleashClient();

  const isMounted = useRef(false);
  useMemo(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId && isMounted.current) {
      updateContext({
        userId,
      });
    }
  }, [userId]);

  useEffect(() => {
    // Wait for the new flags to pull in from the different context
    const fetchFlags = async () => {
      await updateContext({ userId }).then(() => {
        dispatch(
          featureFlagsActions.setFeatureFlags({
            isCurrencyFeatureEnabled: client.isEnabled(FeatureToggle.currency),
            isExcludesFeatureEnabled: client.isEnabled(FeatureToggle.excludes),
            isExportsFeatureEnabled: client.isEnabled(FeatureToggle.exports),
            isIbmFeatureEnabled: client.isEnabled(FeatureToggle.ibm),
            isOciFeatureEnabled: client.isEnabled(FeatureToggle.oci),
          })
        );
      });
    };
    if (userId && isMounted.current) {
      fetchFlags();
    }
  }, [userId]);

  if (flagsReady) {
    return <>{children}</>;
  }
  return (
    <Main>
      <div style={styles.content}>
        <Spinner />
      </div>
    </Main>
  );
};

const FeatureFlags = withRouter(FeatureFlagsBase);

export { FeatureFlags, FeatureToggle };
