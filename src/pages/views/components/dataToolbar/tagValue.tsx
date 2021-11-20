import {
  Button,
  ButtonVariant,
  InputGroup,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  TextInput,
  ToolbarChipGroup,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { getQuery, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Tag, TagPathsType, TagType } from 'api/tags/tag';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { tagActions, tagSelectors } from 'store/tags';

interface TagValueOwnProps extends WrappedComponentProps {
  isDisabled?: boolean;
  onTagValueSelect(event, selection);
  onTagValueInput(event);
  onTagValueInputChange(value: string);
  selections?: SelectOptionObject[];
  tagKey: string;
  tagKeyValue: string;
  tagQueryString?: string;
  tagReportPathsType: TagPathsType;
}

interface TagValueStateProps {
  endDate?: string;
  groupBy: string;
  groupByValue: string | number;
  startDate?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
}

interface TagValueDispatchProps {
  fetchTag?: typeof tagActions.fetchTag;
}

interface TagValueState {
  isTagValueExpanded: boolean;
}

type TagValueProps = TagValueOwnProps & TagValueStateProps & TagValueDispatchProps;

const tagReportType = TagType.tag;

// If the number of tag keys are greater or equal, then show text input Vs select
// See https://github.com/project-koku/koku/pull/2069
const tagKeyValueLimit = 50;

class TagValueBase extends React.Component<TagValueProps> {
  protected defaultState: TagValueState = {
    isTagValueExpanded: false,
  };
  public state: TagValueState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchTag, tagQueryString, tagReportFetchStatus, tagReportPathsType } = this.props;

    if (tagReportFetchStatus !== FetchStatus.inProgress) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  }

  public componentDidUpdate(prevProps: TagValueProps) {
    const { fetchTag, tagQueryString, tagReportFetchStatus, tagReportPathsType } = this.props;

    if (
      (prevProps.tagQueryString !== tagQueryString || prevProps.tagReportPathsType !== tagReportPathsType) &&
      tagReportFetchStatus !== FetchStatus.inProgress
    ) {
      fetchTag(tagReportPathsType, tagReportType, tagQueryString);
    }
  }

  private getTagValueOptions(): ToolbarChipGroup[] {
    const { tagKey, tagReport } = this.props;

    let data = [];
    if (tagReport && tagReport.data) {
      data = [...new Set([...tagReport.data])]; // prune duplicates
    }

    let options = [];
    if (data.length > 0) {
      for (const tag of data) {
        if (tagKey === tag.key && tag.values) {
          options = tag.values.map(val => {
            return {
              key: val,
              name: val, // tag key values not localized
            };
          });
          break;
        }
      }
    }
    return options;
  }

  private onTagValueChange = value => {
    this.setState({ tagKeyValueInput: value });
  };

  private onTagValueToggle = isOpen => {
    this.setState({
      isTagValueExpanded: isOpen,
    });
  };

  public render() {
    const { isDisabled, onTagValueInput, onTagValueSelect, selections, tagKeyValue } = this.props;
    const { isTagValueExpanded } = this.state;

    const selectOptions = this.getTagValueOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    if (selectOptions.length > tagKeyValueLimit) {
      return (
        <InputGroup>
          <TextInput
            isDisabled={isDisabled}
            name="tagkeyvalue-input"
            id="tagkeyvalue-input"
            type="search"
            aria-label={intl.formatMessage(messages.FilterByTagValueAriaLabel)}
            onChange={this.onTagValueChange}
            value={tagKeyValue}
            placeholder={intl.formatMessage(messages.FilterByTagValueInputPlaceholder)}
            onKeyDown={evt => onTagValueInput(evt)}
          />
          <Button
            isDisabled={isDisabled}
            variant={ButtonVariant.control}
            aria-label={intl.formatMessage(messages.FilterByTagValueButtonAriaLabel)}
            onClick={evt => onTagValueInput(evt)}
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      );
    }
    return (
      <Select
        isDisabled={isDisabled}
        variant={SelectVariant.checkbox}
        aria-label={intl.formatMessage(messages.FilterByTagValueAriaLabel)}
        onToggle={this.onTagValueToggle}
        onSelect={onTagValueSelect}
        selections={selections}
        isOpen={isTagValueExpanded}
        placeholderText={intl.formatMessage(messages.FilterByTagValuePlaceholder)}
      >
        {selectOptions}
      </Select>
    );
  }
}

const mapStateToProps = createMapStateToProps<TagValueOwnProps, TagValueStateProps>(
  (state, { tagKey, tagReportPathsType }) => {
    const query = parseQuery<Query>(location.search);

    const endDate = query.end_date;
    const startDate = query.start_date;
    const groupByOrgValue = getGroupByOrgValue(query);
    const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
    const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

    const tagKeyFilter = tagKey
      ? {
          key: tagKey,
        }
      : {};

    const tagQuery =
      endDate && startDate
        ? {
            start_date: startDate,
            end_date: endDate,
            filter: {
              ...tagKeyFilter,
            },
          }
        : {
            filter: {
              resolution: 'monthly',
              time_scope_units: 'month',
              time_scope_value: -1,
              ...tagKeyFilter,
            },
          };

    // Omitting key_only to share a single, cached request -- although the header doesn't need key values, the toolbar does
    const tagQueryString = getQuery({
      ...tagQuery,
    });
    const tagReport = tagSelectors.selectTag(state, tagReportPathsType, tagReportType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(
      state,
      tagReportPathsType,
      tagReportType,
      tagQueryString
    );

    return {
      endDate,
      groupBy,
      groupByValue,
      startDate,
      tagQueryString,
      tagReport,
      tagReportFetchStatus,
    };
  }
);

const mapDispatchToProps: TagValueDispatchProps = {
  fetchTag: tagActions.fetchTag,
};

const TagValueConnect = connect(mapStateToProps, mapDispatchToProps)(TagValueBase);
const TagValue = injectIntl(TagValueConnect);

export { TagValue, TagValueProps };

// https://stage.foo.redhat.com:1337/api/cost-management/v1/tags/openshift/?start_date=2021-11-01&end_date=2021-11-08&key=environment&filter[tag:environment]=Development&filter[project]=*
// https://stage.foo.redhat.com:1337/api/cost-management/v1/reports/openshift/costs/?filter[limit]=10&filter[offset]=0&filter[tag:environment]=Development&group_by[project]=*&end_date=2021-11-08&start_date=2021-11-01
