import { FormGroup, Radio, Stack, StackItem, Text, TextContent, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Form } from 'routes/costModels/components/forms/form';

import { CostModelContext } from './context';
import { styles } from './wizard.styles';

class Distribution extends React.Component<WrappedComponentProps> {
  public render() {
    const { intl } = this.props;

    return (
      <CostModelContext.Consumer>
        {({
          handleDistributionChange,
          handleDistributePlatformUnallocatedChange,
          handleDistributeWorkersUnallocatedChange,
          distribution,
          distributePlatformUnallocated,
          distributeWorkersUnallocated,
        }) => {
          return (
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="xl" style={styles.titleWithLearnMore}>
                  {intl.formatMessage(messages.costDistribution)}
                </Title>
                {/* TODO: show when we get the new doc urls */}
                {/* <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.learnMore)}
                </a> */}
              </StackItem>
              <StackItem>
                <Title headingLevel="h3" size="md">
                  {intl.formatMessage(messages.distributionType)}
                </Title>
                <TextContent>
                  <Text style={styles.cardDescription}>{intl.formatMessage(messages.distributionModelDesc)}</Text>
                </TextContent>
              </StackItem>
              <StackItem isFilled>
                <Form>
                  <FormGroup isInline fieldId="cost-distribution-type" isRequired>
                    <Radio
                      isChecked={distribution === 'cpu'}
                      name="distributionType"
                      label={intl.formatMessage(messages.cpuTitle)}
                      aria-label={intl.formatMessage(messages.cpuTitle)}
                      id="cpuDistribution"
                      value="cpu"
                      onChange={handleDistributionChange}
                    />
                    <Radio
                      isChecked={distribution === 'memory'}
                      name="distributionType"
                      label={intl.formatMessage(messages.memoryTitle)}
                      aria-label={intl.formatMessage(messages.memoryTitle)}
                      id="memoryDistribution"
                      value="memory"
                      onChange={handleDistributionChange}
                    />
                  </FormGroup>
                </Form>
              </StackItem>
              {/* TODO: unhide after api implemented */}
              {false && (
                <>
                  <StackItem>
                    <Title headingLevel="h3" size="md">
                      {intl.formatMessage(messages.platformUnallocatedCapacity)}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>
                        {intl.formatMessage(messages.platformUnallocatedCapacityDescription)}
                      </Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution-platform-unallocated" isRequired>
                        <Radio
                          isChecked={distributePlatformUnallocated}
                          name="distributePlatformUnallocated"
                          label={intl.formatMessage(messages.distribute)}
                          aria-label={intl.formatMessage(messages.distribute)}
                          id="distributePlatformTrue"
                          value="true"
                          onChange={handleDistributePlatformUnallocatedChange}
                        />
                        <Radio
                          isChecked={!distributePlatformUnallocated}
                          name="distributePlatformUnallocated"
                          label={intl.formatMessage(messages.doNotDistribute)}
                          aria-label={intl.formatMessage(messages.doNotDistribute)}
                          id="distributePlatformFalse"
                          value="false"
                          onChange={handleDistributePlatformUnallocatedChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                  <StackItem>
                    <Title headingLevel="h3" size="md">
                      {intl.formatMessage(messages.workersUnallocatedCapacity)}
                    </Title>
                    <TextContent>
                      <Text style={styles.cardDescription}>
                        {intl.formatMessage(messages.workersUnallocatedCapacityDescription)}
                      </Text>
                    </TextContent>
                  </StackItem>
                  <StackItem isFilled>
                    <Form>
                      <FormGroup isInline fieldId="cost-distribution-workers-unallocated" isRequired>
                        <Radio
                          isChecked={distributeWorkersUnallocated}
                          name="distributeWorkersUnallocated"
                          label={intl.formatMessage(messages.distribute)}
                          aria-label={intl.formatMessage(messages.distribute)}
                          id="distributeWorkersTrue"
                          value="true"
                          onChange={handleDistributeWorkersUnallocatedChange}
                        />
                        <Radio
                          isChecked={!distributeWorkersUnallocated}
                          name="distributeWorkersUnallocated"
                          label={intl.formatMessage(messages.doNotDistribute)}
                          aria-label={intl.formatMessage(messages.doNotDistribute)}
                          id="distributeWorkersFalse"
                          value="false"
                          onChange={handleDistributeWorkersUnallocatedChange}
                        />
                      </FormGroup>
                    </Form>
                  </StackItem>
                </>
              )}
            </Stack>
          );
        }}
      </CostModelContext.Consumer>
    );
  }
}

export default injectIntl(Distribution);
