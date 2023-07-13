import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { Report, ReportItem } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { DataTable } from 'routes/components/dataTable';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface CostCategoryOwnProps extends RouterComponentProps, WrappedComponentProps {
  filterBy?: any;
  isAllSelected?: boolean;
  isLoading?: boolean;
  isReadOnly?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  report: Report;
  reportQueryString: string;
  selectedItems?: ComputedReportItem[];
}

interface CostCategoryState {
  columns?: any[];
  rows?: any[];
}

type CostCategoryProps = CostCategoryOwnProps;

export const CostCategoryColumnIds = {
  infrastructure: 'infrastructure',
  monthOverMonth: 'monthOverMonth',
  supplementary: 'supplementary',
};

class CostCategoryBase extends React.Component<CostCategoryProps, CostCategoryState> {
  public state: CostCategoryState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: CostCategoryProps) {
    const { report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (previousReport !== currentReport || prevProps.selectedItems !== selectedItems) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { intl, isAllSelected, isReadOnly, report, selectedItems } = this.props;
    if (!report) {
      return;
    }

    const rows = [];
    const computedItems = getUnsortedComputedReportItems<Report, ReportItem>({
      report,
      idKey: 'project' as any,
    });

    const columns = [
      {
        name: '', // Selection column
      },
      {
        orderBy: 'project', // Todo: update sort name
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'name' }),
        ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'status',
        name: intl.formatMessage(messages.detailsResourceNames, { value: 'status' }),
        ...(computedItems.length && { isSortable: true }),
      },
    ];

    computedItems.map(item => {
      const label = item && item.label !== null ? item.label : '';

      rows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: label,
          },
          {
            value: (
              <Label variant="outline" color="green">
                {intl.formatMessage(messages.enabled)}
              </Label>
            ),
          },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
        selectionDisabled: isReadOnly,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  public render() {
    const { filterBy, isLoading, onSelected, onSort, orderBy, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        filterBy={filterBy}
        isLoading={isLoading}
        onSelected={onSelected}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const CostCategoryTable = injectIntl(withRouter(CostCategoryBase));

export { CostCategoryTable };
