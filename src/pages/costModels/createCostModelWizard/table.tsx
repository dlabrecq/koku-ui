import { Checkbox, Stack, StackItem, Text, TextContent, TextVariants, Title, TitleSizes } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { addMultiValueQuery, removeMultiValueQuery } from 'pages/costModels/components/filterLogic';
import { PaginationToolbarTemplate } from 'pages/costModels/components/paginationToolbarTemplate';
import { WarningIcon } from 'pages/costModels/components/warningIcon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { AssignSourcesToolbar } from './assignSourcesToolbar';
import { CostModelContext } from './context';

const SourcesTable: React.SFC<WithTranslation> = ({ t }) => {
  return (
    <CostModelContext.Consumer>
      {({ loading, onSourceSelect, sources, perPage, page, type, query, fetchSources, filterName, onFilterChange }) => {
        const sourceType = type === 'AZURE' ? 'Azure' : type;
        return (
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h2" size={TitleSizes.xl}>
                {t(`cost_models_wizard.source.title`)}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{t('cost_models_wizard.source.sub_title')}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h3}>
                  {t('cost_models_wizard.source.caption', {
                    type: t(`source_details.type.${type}`),
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <AssignSourcesToolbar
                filter={{
                  onRemove: (category, chip) =>
                    fetchSources(sourceType, removeMultiValueQuery(query)(category, chip), 1, perPage),
                  onClearAll: () => fetchSources(sourceType, {}, 1, perPage),
                  query,
                }}
                filterInputProps={{
                  id: 'assign-source-search-input',
                  value: filterName,
                  onChange: onFilterChange,
                  onSearch: () => {
                    fetchSources(sourceType, addMultiValueQuery(query)('name', filterName), 1, perPage);
                  },
                }}
                paginationProps={{
                  isCompact: true,
                  itemCount: sources.length,
                  perPage,
                  page,
                  onSetPage: (_evt, newPage) => {
                    fetchSources(sourceType, query, newPage, perPage);
                  },
                  onPerPageSelect: (_evt, newPerPage) => fetchSources(sourceType, query, 1, newPerPage),
                }}
              />
              {loading ? (
                <LoadingState />
              ) : (
                <Table
                  aria-label={t('cost_models_wizard.source_table.table_aria_label')}
                  cells={['', t('name'), t('cost_models_wizard.source_table.column_cost_model')]}
                  rows={sources.map((r, ix) => {
                    return {
                      cells: [
                        <>
                          <Checkbox
                            onChange={isChecked => {
                              onSourceSelect(ix, isChecked);
                            }}
                            id={r.name}
                            key={r.name}
                            isChecked={r.selected}
                            isDisabled={Boolean(r.costmodel)}
                          />
                        </>,
                        <>
                          {r.name}{' '}
                          {Boolean(r.costmodel) && (
                            <WarningIcon
                              key={`wrng-${r.name}`}
                              text={t('cost_models_wizard.warning_source', {
                                cost_model: r.costmodel,
                              })}
                            />
                          )}
                        </>,
                        r.costmodel ? r.costmodel : '',
                      ],
                      selected: r.selected,
                    };
                  })}
                >
                  <TableHeader />
                  <TableBody />
                </Table>
              )}
              <PaginationToolbarTemplate
                aria-label="cost_models_wizard.source_table.pagination_section_aria_label"
                itemCount={sources.length}
                perPage={perPage}
                page={page}
                onSetPage={(_evt, newPage) => {
                  fetchSources(sourceType, query, newPage, perPage);
                }}
                onPerPageSelect={(_evt, newPerPage) => fetchSources(sourceType, query, 1, newPerPage)}
              />
            </StackItem>
          </Stack>
        );
      }}
    </CostModelContext.Consumer>
  );
};

export default withTranslation()(SourcesTable);
