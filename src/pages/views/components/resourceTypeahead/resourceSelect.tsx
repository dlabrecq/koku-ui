import {
  Button,
  Divider,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  ToolbarChipGroup,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { getQuery, Query } from 'api/queries/query';
import { Resource, ResourcePathsType, ResourceType } from 'api/resources/resource';
// import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { resourceActions, resourceSelectors } from 'store/resources';
import { noop } from 'utils/noop';

interface ResourceSelectOwnProps {
  isDisabled?: boolean;
  onClear?: () => void;
  onSearchChanged?: (value: string) => void;
  onSelect?: (value: string) => void;
  resource?: Resource;
  resourcePathsType: ResourcePathsType;
  resourceType: ResourceType;
  search?: string;
}

interface ResourceSelectStateProps {
  resourceFetchStatus?: FetchStatus;
}

interface ResourceSelectState {
  createdOptions: any[];
  isSelectExpanded?: boolean;
  menuIsOpen?: boolean;
}

interface ResourceSelectDispatchProps {
  fetchResource?: typeof resourceActions.fetchResource;
}

type ResourceSelectProps = ResourceSelectOwnProps &
  ResourceSelectStateProps &
  ResourceSelectDispatchProps &
  WrappedComponentProps;

class ResourceSelectBase extends React.Component<ResourceSelectProps> {
  private menuRef = React.createRef<HTMLDivElement>();
  private textInputGroupRef = React.createRef<HTMLDivElement>();
  private searchTimeout: any = noop;

  protected defaultState: ResourceSelectState = {
    createdOptions: [],
    isSelectExpanded: false,
    menuIsOpen: false,
  };
  public state: ResourceSelectState = { ...this.defaultState };

  constructor(props: ResourceSelectProps) {
    super(props);

    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.handleTextInputKeyDown = this.handleTextInputKeyDown.bind(this);
  }

  public componentDidUpdate(prevProps: ResourceSelectProps) {
    const { fetchResource, resourceFetchStatus, resourcePathsType, resourceType, search } = this.props;

    if (search && prevProps.search !== search && resourceFetchStatus !== FetchStatus.inProgress) {
      clearTimeout(this.searchTimeout);

      const query: Query = {
        search,
      };
      const queryString = getQuery(query);

      // Delay was 750ms, but reduced -- https://issues.redhat.com/browse/COST-1742
      this.searchTimeout = setTimeout(() => {
        fetchResource(resourcePathsType, resourceType, queryString);
      }, 625);
    }
  }

  // apply focus to the text input
  private focusTextInput = () => {
    this.textInputGroupRef.current.querySelector('input').focus();
  };

  private getInputGroup = () => {
    const { isDisabled, search = '', onSearchChanged } = this.props;

    return (
      <div ref={this.textInputGroupRef}>
        <TextInputGroup isDisabled={isDisabled}>
          <TextInputGroupMain
            icon={<SearchIcon />}
            value={search}
            onChange={onSearchChanged}
            onFocus={this.openMenu}
            onKeyDown={this.handleTextInputKeyDown}
          />
          {search && search.length && (
            <TextInputGroupUtilities>
              <Button variant="plain" onClick={this.handleClearSearch} aria-label="Clear button and input">
                <TimesIcon />
              </Button>
            </TextInputGroupUtilities>
          )}
        </TextInputGroup>
      </div>
    );
  };

  private getMenu = () => {
    return (
      <div ref={this.menuRef}>
        <Menu onSelect={this.handleMenuSelect} onKeyDown={this.handleMenuKeyDown}>
          <MenuContent>
            <MenuList>{this.getMenuItems()}</MenuList>
          </MenuContent>
        </Menu>
      </div>
    );
  };

  private getMenuItems = () => {
    const options = this.getOptions();

    const menuItems = options.map(option => (
      <MenuItem key={option.key} itemId={option.key}>
        {option.key}
      </MenuItem>
    ));

    // add a heading to the menu
    const headingItem = (
      <MenuItem isDisabled key="heading">
        {menuItems.length ? 'Suggestions' : 'No results found'}
      </MenuItem>
    );

    if (menuItems.length) {
      menuItems.unshift(<Divider key="divider" />);
    }
    menuItems.unshift(headingItem);

    return menuItems;
  };

  private getOptions = (): ToolbarChipGroup[] => {
    const { resource, resourceFetchStatus, search } = this.props;
    const { createdOptions } = this.state;
    let options = [];
    if (resource && resource.data && resource.data.length > 0 && resourceFetchStatus !== FetchStatus.inProgress) {
      options = resource.data.map(item => {
        const value = !isNaN(search as any) ? item.value : item.account_alias || item.cluster_alias || item.value;
        return {
          key: value,
          name: value,
        };
      });
    }
    if (createdOptions && createdOptions.length) {
      const moreOptions = createdOptions.map(val => {
        return {
          key: val,
          name: val,
        };
      });
      options = [...options, ...moreOptions];
    }
    return options;
  };

  // Close menu when a click occurs outside of the menu or text input group
  private handleMenuClick = event => {
    if (
      this.menuRef.current &&
      !this.menuRef.current.contains(event.target) &&
      !this.textInputGroupRef.current.contains(event.target)
    ) {
      this.setState({ menuIsOpen: false });
    }
  };

  // Enable keyboard only usage while focused on the menu
  private handleMenuKeyDown = event => {
    if (event.key === 'Escape') {
      this.focusTextInput();
      this.setState({ menuIsOpen: false });
    }
    if (event.key === 'Tab') {
      this.handleClearSearch();
    }
  };

  // Add the text of the selected item
  private handleMenuSelect = event => {
    const { onSelect, search } = this.props;

    event.stopPropagation();

    const value = event.target.innerText || search;
    if (value.trim() === '') {
      return;
    }
    this.setState({ menuIsOpen: false }, () => {
      if (onSelect) {
        onSelect(value);
      }
    });
  };

  // Enable keyboard only usage while focused on the text input
  private handleTextInputKeyDown = event => {
    switch (event.key) {
      case 'Enter':
        this.handleMenuSelect(event);
        break;
      case 'Escape':
        this.focusTextInput();
        this.setState({ menuIsOpen: false });
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Allow focus on the menu and navigate using the arrow keys
        if (this.menuRef.current) {
          const firstElement = this.menuRef.current.querySelector('li > button:not(:disabled)');
          firstElement && (firstElement as any).focus();
        }
        break;
      case 'Tab':
        this.handleClearSearch();
        break;
      default:
        // Open menu upon any un-designated keys
        this.openMenu();
    }
  };

  private handleClearSearch = () => {
    const { onClear } = this.props;

    this.setState({ menuIsOpen: false }, () => {
      if (onClear) {
        onClear();
      }
    });
  };

  private openMenu = () => {
    const { menuIsOpen } = this.state;

    if (!menuIsOpen) {
      this.setState({ menuIsOpen: true });
    }
  };

  public render() {
    const { menuIsOpen } = this.state;

    return (
      <Popper
        trigger={this.getInputGroup()}
        popper={this.getMenu()}
        appendTo={() => this.textInputGroupRef.current}
        isVisible={menuIsOpen}
        onDocumentClick={this.handleMenuClick}
      />
    );

    // return (
    //   <Select
    //     isCreatable
    //     isDisabled={isDisabled}
    //     isInputValuePersisted={false}
    //     isOpen={isSelectExpanded}
    //     onCreateOption={this.handleOnCreateOption}
    //     onClear={this.handleOnClear}
    //     onFilter={this.handleOnFilter}
    //     onSelect={this.handleOnSelect}
    //     onToggle={this.handleOnToggle}
    //     onTypeaheadInputChanged={this.handleOnTypeaheadInputChanged}
    //     placeholderText={intl.formatMessage(messages.FilterByPlaceholder, { value: resourceType })}
    //     typeAheadAriaLabel={intl.formatMessage(messages.FilterByInputAriaLabel, { value: resourceType })}
    //     variant={SelectVariant.typeahead}
    //   >
    //     {selectOptions}
    //   </Select>
    // );
  }
}

const mapStateToProps = createMapStateToProps<ResourceSelectOwnProps, ResourceSelectStateProps>(
  (state, { resourcePathsType, resourceType, search }) => {
    const query: Query = {
      search,
    };
    const queryString = getQuery(query);

    const resource = resourceSelectors.selectResource(state, resourcePathsType, resourceType, queryString);
    const resourceFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      queryString
    );

    return {
      resource,
      resourceFetchStatus,
    };
  }
);

const mapDispatchToProps: ResourceSelectDispatchProps = {
  fetchResource: resourceActions.fetchResource,
};

const ResourceSelect = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ResourceSelectBase));

export { ResourceSelect };
