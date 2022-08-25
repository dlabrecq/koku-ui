import { useFlag } from '@unleash/proxy-client-react';
import { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { featureFlagsActions } from 'store/featureFlags';

interface FeatureFlagsProps extends RouteComponentProps {
  children?: React.ReactNode;
}

// eslint-disable-next-line no-shadow
const enum FeatureToggle {
  currency = 'cost-management.ui.currency', // Currency support https://issues.redhat.com/browse/COST-1277
  exports = 'cost-management.ui.exports', // Async exports https://issues.redhat.com/browse/COST-2223
  ibm = 'cost-management.ui.ibm', // IBM https://issues.redhat.com/browse/COST-935
  oci = 'cost-management.ui.oci', // Oracle Cloud Infrastructure https://issues.redhat.com/browse/COST-2358
}

const FeatureFlagsBase: FunctionComponent<FeatureFlagsProps> = ({ children = null }): any => {
  const dispatch = useDispatch();
  const isCurrencyFeatureEnabled = useFlag(FeatureToggle.currency);
  const isExportsFeatureEnabled = useFlag(FeatureToggle.exports);
  const isIbmFeatureEnabled = useFlag(FeatureToggle.ibm);
  const isOciFeatureEnabled = useFlag(FeatureToggle.oci);

  useEffect(() => {
    dispatch(
      featureFlagsActions.setFeatureFlags({
        isCurrencyFeatureEnabled,
        isExportsFeatureEnabled,
        isIbmFeatureEnabled,
        isOciFeatureEnabled,
      })
    );
  }, []);

  return children;
};

const FeatureFlags = withRouter(FeatureFlagsBase);

export { FeatureFlags, FeatureToggle };
