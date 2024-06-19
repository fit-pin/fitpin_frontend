declare module 'deprecated-react-native-prop-types' {
  import {ViewProps} from 'react-native';
  import * as React from 'react';

  export const ViewPropTypes: React.WeakValidationMap<ViewProps> & {
    style: any;
  };

  // 필요한 다른 PropTypes도 여기에 추가할 수 있습니다.
}
