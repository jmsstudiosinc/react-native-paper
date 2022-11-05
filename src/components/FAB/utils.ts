import color from 'color';
import {
  Animated,
  I18nManager,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import theme from '../../styles/themes/v3/LightTheme';
import { white, black } from '../../styles/themes/v2/colors';
import getContrastingColor from '../../utils/getContrastingColor';

type GetCombinedStylesProps = {
  isAnimatedFromRight: boolean;
  isIconStatic: boolean;
  distance: number;
  animFAB: Animated.Value;
};

type CombinedStyles = {
  innerWrapper: Animated.WithAnimatedValue<ViewStyle>;
  iconWrapper: Animated.WithAnimatedValue<ViewStyle>;
  absoluteFill: Animated.WithAnimatedValue<ViewStyle>;
};

type Variant = 'primary' | 'secondary' | 'tertiary' | 'surface';

type BaseProps = {
  isVariant: (variant: Variant) => boolean;
  disabled?: boolean;
};

export const getCombinedStyles = ({
  isAnimatedFromRight,
  isIconStatic,
  distance,
  animFAB,
}: GetCombinedStylesProps): CombinedStyles => {
  const { isRTL } = I18nManager;

  const defaultPositionStyles = { left: -distance, right: undefined };

  const combinedStyles: CombinedStyles = {
    innerWrapper: {
      ...defaultPositionStyles,
    },
    iconWrapper: {
      ...defaultPositionStyles,
    },
    absoluteFill: {},
  };

  const animatedFromRight = isAnimatedFromRight && !isRTL;
  const animatedFromRightRTL = isAnimatedFromRight && isRTL;
  const animatedFromLeft = !isAnimatedFromRight && !isRTL;
  const animatedFromLeftRTL = !isAnimatedFromRight && isRTL;

  if (animatedFromRight) {
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [distance, 0],
        }),
      },
    ];
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic ? 0 : animFAB,
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [Math.abs(distance) / 2, Math.abs(distance)],
        }),
      },
    ];
  } else if (animatedFromRightRTL) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? 0
          : animFAB.interpolate({
              inputRange: [distance, 0],
              outputRange: [-distance, 0],
            }),
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [-distance, 0],
        }),
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [0, distance],
        }),
      },
    ];
  } else if (animatedFromLeft) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? distance
          : animFAB.interpolate({
              inputRange: [0, distance],
              outputRange: [distance, distance * 2],
            }),
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB,
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, Math.abs(distance) / 2],
        }),
      },
    ];
  } else if (animatedFromLeftRTL) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? animFAB.interpolate({
              inputRange: [0, distance],
              outputRange: [-distance, -distance * 2],
            })
          : -distance,
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }),
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }),
      },
    ];
  }

  return combinedStyles;
};

const getBackgroundColor = ({
  isVariant,
  disabled,
  style,
}: BaseProps & { style?: StyleProp<ViewStyle> }) => {
  const { backgroundColor } = StyleSheet.flatten(style) || {};
  if (backgroundColor && !disabled) {
    return backgroundColor;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.surfaceDisabled;
    }

    if (isVariant('primary')) {
      return theme.colors.primaryContainer;
    }

    if (isVariant('secondary')) {
      return theme.colors.secondaryContainer;
    }

    if (isVariant('tertiary')) {
      return theme.colors.tertiaryContainer;
    }

    if (isVariant('surface')) {
      return theme.colors.elevation.level3;
    }
  }

  if (disabled) {
    if (theme.dark) {
      return color(white).alpha(0.12).rgb().string();
    }
    return color(black).alpha(0.12).rgb().string();
  }

  //@ts-ignore
  return theme.colors?.accent;
};

const getForegroundColor = ({
  isVariant,
  disabled,
  backgroundColor,
  customColor,
}: BaseProps & { backgroundColor: string; customColor?: string }) => {
  if (typeof customColor !== 'undefined' && !disabled) {
    return customColor;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }

    if (isVariant('primary')) {
      return theme.colors.onPrimaryContainer;
    }

    if (isVariant('secondary')) {
      return theme.colors.onSecondaryContainer;
    }

    if (isVariant('tertiary')) {
      return theme.colors.onTertiaryContainer;
    }

    if (isVariant('surface')) {
      return theme.colors.primary;
    }
  }

  if (disabled) {
    if (theme.dark) {
      return color(white).alpha(0.32).rgb().string();
    }
    return color(black).alpha(0.32).rgb().string();
  }

  if (backgroundColor) {
    return getContrastingColor(
      backgroundColor || white,
      white,
      'rgba(0, 0, 0, .54)'
    );
  }

  return getContrastingColor(white, white, 'rgba(0, 0, 0, .54)');
};

export const getFABColors = ({
  variant,
  disabled,
  customColor,
  style,
}: {
  variant: string;
  disabled?: boolean;
  customColor?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const isVariant = (variantToCompare: Variant) => {
    return variant === variantToCompare;
  };

  const baseFABColorProps = { theme, isVariant, disabled };

  const backgroundColor = getBackgroundColor({
    ...baseFABColorProps,
    style,
  });

  const foregroundColor = getForegroundColor({
    ...baseFABColorProps,
    customColor,
    backgroundColor,
  });

  return {
    backgroundColor,
    foregroundColor,
    rippleColor: color(foregroundColor).alpha(0.12).rgb().string(),
  };
};

const getLabelColor = () => {
  if (theme.isV3) {
    return theme.colors.onSurface;
  }

  if (theme.dark) {
    return theme.colors.text;
  }

  return color(theme.colors.text).fade(0.54).rgb().string();
};

const getBackdropColor = () => {
  if (theme.isV3) {
    return color(theme.colors.background).alpha(0.95).rgb().string();
  }
  return theme.colors?.backdrop;
};

const getStackedFABBackgroundColor = () => {
  if (theme.isV3) {
    return theme.colors.elevation.level3;
  }
  return theme.colors.surface;
};

export const getFABGroupColors = () => {
  return {
    labelColor: getLabelColor(),
    backdropColor: getBackdropColor(),
    stackedFABBackgroundColor: getStackedFABBackgroundColor(),
  };
};

const standardSize = {
  height: theme.spacing.x14,
  width: theme.spacing.x14,
  borderRadius: theme.spacing.x7,
};
const smallSize = {
  height: theme.spacing.x10,
  width: theme.spacing.x10,
  borderRadius: theme.spacing.x7,
};
const v3SmallSize = {
  height: theme.spacing.x10,
  width: theme.spacing.x10,
};
const v3MediumSize = {
  height: theme.spacing.x14,
  width: theme.spacing.x14,
};
const v3LargeSize = {
  height: moderateScale(96),
  width: moderateScale(96),
};

const getCustomFabSize = (customSize: number, roundness: number) => ({
  height: customSize,
  width: customSize,
  borderRadius: customSize / roundness,
});

export const getFabStyle = ({
  size,
  customSize,
}: {
  customSize?: number;
  size: 'small' | 'medium' | 'large';
}) => {
  const { isV3, roundness } = theme;

  if (customSize) return getCustomFabSize(customSize, roundness);

  if (isV3) {
    switch (size) {
      case 'small':
        return { ...v3SmallSize, borderRadius: moderateScale(3) * roundness };
      case 'medium':
        return { ...v3MediumSize, borderRadius: theme.spacing.x1 * roundness };
      case 'large':
        return { ...v3LargeSize, borderRadius: moderateScale(7) * roundness };
    }
  }

  if (size === 'small') {
    return smallSize;
  }
  return standardSize;
};

const extended = {
  height: moderateScale(18),
  paddingHorizontal: theme.spacing.x4,
};

const v3Extended = {
  height: theme.spacing.x14,
  borderRadius: theme.spacing.x4,
  paddingHorizontal: theme.spacing.x4,
};

const getExtendedFabDimensions = (customSize: number) => ({
  height: customSize,
  paddingHorizontal: theme.spacing.x4,
});

export const getExtendedFabStyle = ({
  customSize,
}: {
  customSize?: number;
}) => {
  if (customSize) return getExtendedFabDimensions(customSize);

  const { isV3 } = theme;

  return isV3 ? v3Extended : extended;
};
