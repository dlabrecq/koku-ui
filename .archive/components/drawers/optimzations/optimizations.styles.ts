import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_FontWeight_bold from '@patternfly/react-tokens/dist/js/global_FontWeight_bold';
import global_spacer_lg from '@patternfly/react-tokens/dist/js/global_spacer_lg';
import type React from 'react';

export const styles = {
  bullseye: {
    marginTop: global_spacer_lg.value,
  },
  firstColumn: {
    width: '225px',
  },
  tableContainer: {
    marginTop: global_spacer_lg.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    paddingBottom: global_spacer_lg.value,
    paddingTop: global_spacer_lg.value,
  },
  value: {
    fontWeight: global_FontWeight_bold.value,
  },
  viewAllContainer: {
    marginTop: global_spacer_lg.value,
  },
} as { [className: string]: React.CSSProperties };
