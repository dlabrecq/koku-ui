import { ToolbarChipGroup } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import messages from 'locales/messages';
import { DataToolbar } from 'pages/views/components/dataToolbar/dataToolbar';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

import { styles } from './exports.styles';

interface ExportsToolbarOwnProps {
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: Query;
}

interface ExportsToolbarStateProps {
  // TDB...
}

interface ExportsToolbarDispatchProps {
  // TDB...
}

type ExportsToolbarProps = ExportsToolbarOwnProps &
  ExportsToolbarStateProps &
  ExportsToolbarDispatchProps &
  WrappedComponentProps;

export class ExportsToolbarBase extends React.Component<ExportsToolbarProps> {
  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    return [{ name: intl.formatMessage(messages.FilterByValues, { value: 'name' }), key: 'name' }];
  };

  public render() {
    const { onFilterAdded, onFilterRemoved, pagination, query } = this.props;

    return (
      <DataToolbar
        categoryOptions={this.getCategoryOptions()}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        showFilter
        style={styles.toolbarContainer}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExportsToolbarOwnProps, ExportsToolbarStateProps>((state, props) => {
  return {};
});

const mapDispatchToProps: ExportsToolbarDispatchProps = {};

const ExportsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ExportsToolbarBase);
const ExportsToolbar = injectIntl(ExportsToolbarConnect);

export { ExportsToolbar, ExportsToolbarProps };
