import './costType.scss';

import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import { CostType } from 'api/costType';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costTypeActions, costTypeSelectors } from 'store/costType';
import { getCostType, invalidateCostType, setCostType } from 'utils/localStorage';

import { styles } from './costType.styles';

interface CostTypeOwnProps {
  isDisabled?: boolean;
}

interface CostTypeDispatchProps {
  fetchCostType?: typeof costTypeActions.fetchCostType;
}

interface CostTypeStateProps {
  costType: CostType;
  costTypeError: AxiosError;
  costTypeFetchStatus?: FetchStatus;
}

interface CostTypeState {
  currentItem: string;
  isSelectOpen: boolean;
}

interface CostTypeOption extends SelectOptionObject {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostTypeProps = CostTypeOwnProps & CostTypeDispatchProps & CostTypeStateProps & WrappedComponentProps;

// eslint-disable-next-line no-shadow
const enum CostTypes {
  amortized = 'savingsplan_effective_cost',
  blended = 'blended_cost',
  unblended = 'unblended_cost',
}

class CostTypeBase extends React.Component<CostTypeProps> {
  protected defaultState: CostTypeState = {
    currentItem: CostTypes.unblended,
    isSelectOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchCostType } = this.props;

    fetchCostType();
  }

  private getCurrentItem = () => {
    const { currentItem } = this.state;

    const costType = getCostType(); // Get currency units from local storage
    return costType ? costType : currentItem;
  };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const currentItem = this.getCurrentItem();
    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostTypeOption) => option.value === currentItem);

    return (
      <Select
        className="selectOverride"
        id="costTypeSelect"
        isDisabled={isDisabled}
        isOpen={isSelectOpen}
        onSelect={this.handleSelect}
        onToggle={this.handleToggle}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption description={option.desc} key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getSelectOptions = (): CostTypeOption[] => {
    const { costType, intl } = this.props;

    const options: CostTypeOption[] = [];

    if (costType) {
      costType.data.map(val => {
        switch (val.code) {
          case CostTypes.amortized:
            options.push({
              desc: intl.formatMessage(messages.CostTypeAmortizedDesc),
              toString: () => intl.formatMessage(messages.CostTypeAmortized),
              value: CostTypes.amortized,
            });
            break;
          case CostTypes.blended:
            options.push({
              desc: intl.formatMessage(messages.CostTypeBlendedDesc),
              toString: () => intl.formatMessage(messages.CostTypeBlended),
              value: CostTypes.blended,
            });
            break;
          case CostTypes.unblended:
            options.push({
              desc: intl.formatMessage(messages.CostTypeUnblendedDesc),
              toString: () => intl.formatMessage(messages.CostTypeUnblended),
              value: CostTypes.unblended,
            });
            break;
        }
      });
    } else {
      options.push({
        desc: intl.formatMessage(messages.CostTypeUnblendedDesc),
        toString: () => intl.formatMessage(messages.CostTypeUnblended),
        value: CostTypes.unblended,
      });
    }
    return options;
  };

  private handleSelect = (event, selection: CostTypeOption) => {
    this.setState({
      currentItem: selection.value,
      isSelectOpen: false,
    });
    setCostType(selection.value); // Set currency units via local storage
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

    // Todo: Show new features in beta environment only
    if (!insights.chrome.isBeta()) {
      return null;
    }

    // Clear local storage value if current session is not valid
    invalidateCostType();

    return (
      <div style={styles.costSelector}>
        <Title headingLevel="h3" size="md" style={styles.costLabel}>
          {intl.formatMessage(messages.CostTypeLabel)}
        </Title>
        {this.getSelect()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<CostTypeOwnProps, CostTypeStateProps>(state => {
  const costType = costTypeSelectors.selectCostType(state);
  const costTypeError = costTypeSelectors.selectCostTypeError(state);
  const costTypeFetchStatus = costTypeSelectors.selectCostTypeFetchStatus(state);

  return {
    costType,
    costTypeError,
    costTypeFetchStatus,
  };
});

const mapDispatchToProps: CostTypeDispatchProps = {
  fetchCostType: costTypeActions.fetchCostType,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(CostTypeBase);
const CostType = injectIntl(CostTypeConnect);

export { CostType };
