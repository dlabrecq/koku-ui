import './costType.scss';

import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Select, SelectOption, SelectOptionObject, SelectVariant, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { CostTypes, getCostType, invalidateCostType, setCostType } from 'utils/localStorage';

import { styles } from './costType.styles';

interface CostTypeOwnProps {
  isDisabled?: boolean;
  onSelect?: (value: string) => void;
}

interface CostTypeDispatchProps {
  // TBD...
}

interface CostTypeStateProps {
  // TBD...
}

interface CostTypeState {
  isSelectOpen: boolean;
}

interface CostTypeOption extends SelectOptionObject {
  desc?: string;
  toString(): string; // label
  value?: string;
}

type CostTypeProps = CostTypeOwnProps & CostTypeDispatchProps & CostTypeStateProps & WrappedComponentProps;

const costTypeOptions: {
  desc: MessageDescriptor;
  label: MessageDescriptor;
  value: string;
}[] = [
  { desc: messages.CostTypeAmortizedDesc, label: messages.CostTypeAmortized, value: CostTypes.amortized },
  { desc: messages.CostTypeBlendedDesc, label: messages.CostTypeBlended, value: CostTypes.blended },
  { desc: messages.CostTypeUnblendedDesc, label: messages.CostTypeUnblended, value: CostTypes.unblended },
];

class CostTypeBase extends React.Component<CostTypeProps> {
  protected defaultState: CostTypeState = {
    isSelectOpen: false,
  };
  public state: CostTypeState = { ...this.defaultState };

  private getSelect = () => {
    const { isDisabled } = this.props;
    const { isSelectOpen } = this.state;

    const costType = getCostType(); // Get cost type from local storage
    const selectOptions = this.getSelectOptions();
    const selection = selectOptions.find((option: CostTypeOption) => option.value === costType);

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
    const { intl } = this.props;

    const options: CostTypeOption[] = [];

    costTypeOptions.map(option => {
      options.push({
        desc: intl.formatMessage(option.desc),
        toString: () => intl.formatMessage(option.label),
        value: option.value,
      });
    });
    return options;
  };

  private handleSelect = (event, selection: CostTypeOption) => {
    const { onSelect } = this.props;

    setCostType(selection.value); // Set cost type in local storage

    this.setState(
      {
        isSelectOpen: false,
      },
      () => {
        if (onSelect) {
          onSelect(selection.value);
        }
      }
    );
  };

  private handleToggle = isSelectOpen => {
    this.setState({ isSelectOpen });
  };

  public render() {
    const { intl } = this.props;

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

const mapStateToProps = createMapStateToProps<CostTypeOwnProps, CostTypeStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: CostTypeDispatchProps = {
  // TBD...
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(CostTypeBase);
const CostType = injectIntl(CostTypeConnect);

export { CostType };
