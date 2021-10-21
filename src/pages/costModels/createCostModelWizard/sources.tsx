import { LoadingState } from 'components/state/loadingState/loadingState';
import { SourceStepErrorState } from 'pages/costModels/components/errorState';
import React from 'react';

import { CostModelContext } from './context';
import SourcesTable from './table';

class Sources extends React.Component {
  fetchData = () => null;
  constructor(props) {
    super(props);
    this.fetchData = () => {
      const { type, query, page, perPage, fetchSources } = this.context;
      const sourceType = type === 'Azure' ? 'Azure' : type;
      fetchSources(sourceType, query, page, perPage);
    };
  }

  public componentDidMount() {
    const { dataFetched } = this.context;
    if (dataFetched) {
      return;
    }
    this.fetchData();
  }

  public renderContent() {
    if (this.context.loading) {
      return <LoadingState />;
    }

    if (this.context.apiError) {
      return <SourceStepErrorState onRefresh={this.fetchData} />;
    }
    return <SourcesTable />;
  }

  public render() {
    return this.renderContent();
  }
}

Sources.contextType = CostModelContext;

export default Sources;
