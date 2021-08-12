import { Alert, Button, ButtonVariant, Form, FormGroup, Modal, Radio } from '@patternfly/react-core';
import { Query, tagPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { orderBy } from 'lodash';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { exportActions } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps extends WithTranslation {
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  queryString?: string;
  reportPathsType: ReportPathsType;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // monthly resolution filters are not valid with date range
  showTimeScope?: boolean; // timeScope filters are not valid with date range
}

interface ExportModalStateProps {
  // TBD...
}

interface ExportModalDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportModalState {
  error?: AxiosError;
  timeScope: number;
  resolution: string;
}

type ExportModalProps = ExportModalOwnProps & ExportModalDispatchProps & ExportModalStateProps & WithTranslation;

const resolutionOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'export.resolution_daily', value: 'daily' },
  { label: 'export.resolution_monthly', value: 'monthly' },
];

const timeScopeOptions: {
  label: string;
  value: number;
}[] = [
  { label: 'export.time_scope_current', value: -1 },
  { label: 'export.time_scope_previous', value: -2 },
];

export class ExportModalBase extends React.Component<ExportModalProps, ExportModalState> {
  protected defaultState: ExportModalState = {
    error: undefined,
    timeScope: -1,
    resolution: this.props.resolution || 'monthly',
  };
  public state: ExportModalState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleResolutionChange = this.handleResolutionChange.bind(this);
  }

  // Reset defult state upon close -- see https://issues.redhat.com/browse/COST-1134
  private handleClose = () => {
    this.setState({ ...this.defaultState }, () => {
      this.props.onClose(false);
    });
  };

  private handleError = (error: AxiosError) => {
    this.setState({ error });
  };

  public handleMonthChange = (_, event) => {
    this.setState({ timeScope: Number(event.currentTarget.value) });
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const {
      groupBy,
      isAllItems,
      items,
      query,
      reportPathsType,
      showAggregateType = true,
      showTimeScope = true,
      t,
    } = this.props;
    const { error, resolution, timeScope } = this.state;

    let sortedItems = [...items];
    if (this.props.isOpen) {
      if (items && items.length === 0 && isAllItems) {
        sortedItems = [
          {
            label: t('export.all') as string,
          },
        ];
      } else {
        sortedItems = orderBy(sortedItems, ['label'], ['asc']);
      }
    }

    let selectedLabel = t('export.selected', { groupBy });
    if (groupBy.indexOf(tagPrefix) !== -1) {
      selectedLabel = t('export.selected_tags');
    }

    const thisMonth = new Date();
    const lastMonth = new Date().setMonth(thisMonth.getMonth() - 1);
    const currentMonth = format(thisMonth, 'MMMM yyyy');
    const previousMonth = format(lastMonth - 1, 'MMMM yyyy');

    return (
      <Modal
        style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={t('export.title')}
        variant="small"
        actions={[
          <ExportSubmit
            groupBy={groupBy}
            isAllItems={isAllItems}
            items={items}
            key="confirm"
            timeScope={showTimeScope ? timeScope : undefined}
            onClose={this.handleClose}
            onError={this.handleError}
            query={query}
            reportPathsType={reportPathsType}
            resolution={resolution}
          />,
          <Button
            {...getTestProps(testIds.export.cancel_btn)}
            key="cancel"
            onClick={this.handleClose}
            variant={ButtonVariant.link}
          >
            {t('export.cancel')}
          </Button>,
        ]}
      >
        {error && <Alert variant="danger" style={styles.alert} title={t('export.error')} />}
        <div style={styles.title}>
          <span>{t('export.heading', { groupBy })}</span>
        </div>
        <Form style={styles.form}>
          {showAggregateType && (
            <FormGroup label={t('export.aggregate_type')} fieldId="aggregate-type">
              <React.Fragment>
                {resolutionOptions.map((option, index) => (
                  <Radio
                    key={index}
                    id={`resolution-${index}`}
                    isValid={option.value !== undefined}
                    label={t(option.label)}
                    value={option.value}
                    checked={resolution === option.value}
                    name="resolution"
                    onChange={this.handleResolutionChange}
                    aria-label={t(option.label)}
                  />
                ))}
              </React.Fragment>
            </FormGroup>
          )}
          {showTimeScope && (
            <FormGroup label={t('export.time_scope_title')} fieldId="timeScope">
              <React.Fragment>
                {timeScopeOptions.map((option, index) => (
                  <Radio
                    key={index}
                    id={`timeScope-${index}`}
                    isValid={option.value !== undefined}
                    label={t(option.label, { date: option.value === -2 ? previousMonth : currentMonth })}
                    value={option.value}
                    checked={timeScope === option.value}
                    name="timeScope"
                    onChange={this.handleMonthChange}
                    aria-label={t(option.label)}
                  />
                ))}
              </React.Fragment>
            </FormGroup>
          )}
          <FormGroup label={selectedLabel} fieldId="selected-labels">
            <ul>
              {sortedItems.map((groupItem, index) => {
                return <li key={index}>{groupItem.label}</li>;
              })}
            </ul>
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportModalOwnProps, unknown>(() => {
  return {};
});

const mapDispatchToProps: ExportModalDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportModalConnect = connect(mapStateToProps, mapDispatchToProps)(ExportModalBase);
const ExportModal = withTranslation()(ExportModalConnect);

export { ExportModal, ExportModalProps };
