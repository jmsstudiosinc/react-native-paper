import * as React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { withInternalTheme } from '../../core/theming';
import { grey200 } from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';
import { getCardCoverStyle } from './utils';

import { moderateScale } from '@jmstechnologiesinc/react-native-size-matters';
import { MD3LightTheme as theme } from '../../styles/themes/v3/LightTheme';

import ImageBlurLoading from '@jmstechnologiesinc/react-native-image-blur-loading'

export type Props = React.ComponentPropsWithRef<typeof Image> & {
  /**
   * @internal
   */
  index?: number;
  /**
   * @internal
   */
  total?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * A component to show a cover image inside a Card.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/card-cover.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Card } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Card>
 *     <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
 *   </Card>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Image props https://reactnative.dev/docs/image#props
 */

const CardCover = ({ index, total, style, theme, ...rest }: Props) => {
  const coverStyle = getCardCoverStyle({ theme, index, total });

  return (
    <View style={[styles.container, coverStyle, style]}>
      <ImageBlurLoading
          thumbnailSource={{ uri: rest.source?.lqipUri }}
          source={{ uri: rest.source?.uri }}
          fastImage={true}
          style={[styles.image, coverStyle]}
          accessibilityIgnoresInvertColors/>
    </View>
  );
};

CardCover.displayName = 'Card.Cover';
const styles = StyleSheet.create({
  container: {
    height: moderateScale(195),
    backgroundColor: grey200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    padding: theme.spacing.x4,
    justifyContent: 'flex-end',
  },
});

export default withInternalTheme(CardCover);

// @component-docs ignore-next-line
export { CardCover };
