import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import HookIntoProps from 'hook-into-props';
import { useTranslation } from 'react-i18next';

import EmptyStateBase from './emptyStateBase';

const NoCostModels = HookIntoProps(() => {
  const { t } = useTranslation();
  return {
    title: t('page_cost_models.no_cost_models_title'),
    description: t('page_cost_models.no_cost_models_description'),
    icon: PlusCircleIcon,
  };
})(EmptyStateBase);

export default NoCostModels;
