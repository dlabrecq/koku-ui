import {
  Alert,
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { countDecimals, formatPercentageMarkup, isPercentageFormatValid, unFormat } from 'utils/format';

import { styles } from './costCalc.styles';

interface Props extends WrappedComponentProps {
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  current: CostModel;
}

interface State {
  markup: string;
  isDiscount: boolean;
}

class UpdateMarkupModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const initialMarkup = Number(this.props.current.markup.value || 0); // Drop trailing zeros from API value
    const isNegative = initialMarkup < 0;
    const markupValue = isNegative ? initialMarkup.toString().substring(1) : initialMarkup.toString();

    this.state = {
      isDiscount: isNegative,
      markup: formatPercentageMarkup(Number(markupValue)),
    };
  }

  private handleSignChange = (_, event) => {
    const { value } = event.currentTarget;
    this.setState({ isDiscount: value === 'true' });
  };

  private handleMarkupDiscountChange = (_, event) => {
    const { value } = event.currentTarget;

    this.setState({ markup: value });
  };

  private handleOnKeyDown = event => {
    // Prevent 'enter', '+', and '-'
    if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
      event.preventDefault();
    }
  };

  private markupValidator = () => {
    const { markup } = this.state;

    if (!isPercentageFormatValid(markup)) {
      return messages.MarkupOrDiscountNumber;
    }
    // Test number of decimals
    const decimals = countDecimals(markup);
    if (decimals > 10) {
      return messages.MarkupOrDiscountTooLong;
    }
    return undefined;
  };

  public render() {
    const { error, current, intl, isLoading, onClose, updateCostModel } = this.props;
    const { isDiscount } = this.state;

    const helpText = this.markupValidator();
    const validated = helpText ? 'error' : 'default';
    const markup = `${isDiscount ? '-' : ''}${unFormat(this.state.markup)}`;

    return (
      <Modal
        title={intl.formatMessage(messages.EditMarkupOrDiscount)}
        isOpen
        onClose={() => onClose({ name: 'updateMarkup', isOpen: false })}
        variant={ModalVariant.medium}
        actions={[
          <Button
            key="proceed"
            variant="primary"
            onClick={() => {
              const newState = {
                ...current,
                source_uuids: current.sources.map(provider => provider.uuid),
                source_type: current.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
                markup: {
                  value: markup,
                  unit: 'percent',
                },
              };
              updateCostModel(current.uuid, newState, 'updateMarkup');
            }}
            isDisabled={
              isLoading ||
              validated === 'error' ||
              markup.trim().length === 0 ||
              Number(markup) === Number(current.markup.value)
            }
          >
            {intl.formatMessage(messages.Save)}
          </Button>,
          <Button
            key="cancel"
            variant="link"
            onClick={() => onClose({ name: 'updateMarkup', isOpen: false })}
            isDisabled={isLoading}
          >
            {intl.formatMessage(messages.Cancel)}
          </Button>,
        ]}
      >
        <Stack hasGutter>
          <StackItem>{error && <Alert variant="danger" title={`${error}`} />}</StackItem>
          <StackItem>
            <TextContent>
              <Text style={styles.cardDescription}>{intl.formatMessage(messages.MarkupOrDiscountModalDesc)}</Text>
            </TextContent>
          </StackItem>
          <StackItem>
            <TextContent>
              <Title headingLevel="h2" size="md">
                {intl.formatMessage(messages.MarkupOrDiscount)}
              </Title>
            </TextContent>
            <Flex style={styles.markupRadioContainer}>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <Radio
                    isChecked={!isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.MarkupPlus)}
                    aria-label={intl.formatMessage(messages.MarkupPlus)}
                    id="markup"
                    value="false" // "+"
                    onChange={this.handleSignChange}
                    style={styles.markupRadio}
                  />
                  <Radio
                    isChecked={isDiscount}
                    name="discount"
                    label={intl.formatMessage(messages.DiscountMinus)}
                    aria-label={intl.formatMessage(messages.DiscountMinus)}
                    id="discount"
                    value="true" // '-'
                    onChange={this.handleSignChange}
                  />
                </FlexItem>
              </Flex>
              <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <Form>
                    <FormGroup
                      fieldId="markup-input-box"
                      helperTextInvalid={helpText ? intl.formatMessage(helpText) : undefined}
                      style={styles.rateContainer}
                      validated={validated}
                    >
                      <InputGroup>
                        <InputGroupText style={styles.sign}>
                          {isDiscount
                            ? intl.formatMessage(messages.DiscountMinus)
                            : intl.formatMessage(messages.MarkupPlus)}
                        </InputGroupText>
                        <TextInput
                          aria-label={intl.formatMessage(messages.Rate)}
                          id="markup-input-box"
                          isRequired
                          onKeyDown={this.handleOnKeyDown}
                          onChange={this.handleMarkupDiscountChange}
                          placeholder={'0'}
                          style={styles.inputField}
                          type="text"
                          validated={validated}
                          value={this.state.markup}
                        />
                        <InputGroupText style={styles.percent}>
                          {intl.formatMessage(messages.PercentSymbol)}
                        </InputGroupText>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </FlexItem>
              </Flex>
            </Flex>
          </StackItem>
          <StackItem />
          <StackItem>
            <TextContent>
              <Title headingLevel="h3" size="md">
                {intl.formatMessage(messages.ExamplesTitle)}
              </Title>
            </TextContent>
            <List>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesNoAdjust)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesDoubleMarkup)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceZero)}</ListItem>
              <ListItem>{intl.formatMessage(messages.CostModelsExamplesReduceSeventyfive)}</ListItem>
            </List>
          </StackItem>
        </Stack>
      </Modal>
    );
  }
}

// Fixes issue with Typescript:
// https://github.com/microsoft/TypeScript/issues/25103#issuecomment-412806226
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
};

export default injectIntl(
  connect(
    createMapStateToProps(state => {
      return {
        isLoading: costModelsSelectors.updateProcessing(state),
        error: costModelsSelectors.updateError(state),
      };
    }),
    {
      onClose: costModelsActions.setCostModelDialog,
      updateCostModel: costModelsActions.updateCostModel,
    },
    mergeProps
  )(UpdateMarkupModelBase)
);
