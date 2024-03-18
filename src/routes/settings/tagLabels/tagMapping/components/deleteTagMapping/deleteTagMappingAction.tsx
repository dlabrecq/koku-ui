import './deleteTagMapping.scss';

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import DeleteTagMapping from './deleteTagMapping';

interface DeleteTagMappingActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onClose?: () => void;
}

type DeleteTagMappingActionProps = DeleteTagMappingActionOwnProps;

const DeleteTagMappingAction: React.FC<DeleteTagMappingActionProps> = ({ canWrite, isDisabled, item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const getActions = () => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button
        aria-label={intl.formatMessage(messages.delete)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnClick()}
        size="sm"
        variant={ButtonVariant.plain}
      >
        <MinusCircleIcon />
      </Button>
    );
  };

  const handleOnClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {getActions()}
      <DeleteTagMapping
        isOpen={isOpen}
        item={item}
        onClose={handleOnClose}
        settingsType={SettingsType.tagsMappingsChildRemove}
      />
    </>
  );
};

export default DeleteTagMappingAction;
