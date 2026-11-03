import {useWindowDimensions} from 'react-native';

const TABLET_MIN_WIDTH = 768;
const LARGE_TABLET_MIN_WIDTH = 1024;
const COMPACT_MAX_WIDTH = 360;

export function useLayout() {
  const {width, height, fontScale} = useWindowDimensions();

  const isTablet = width >= TABLET_MIN_WIDTH;
  const isLargeTablet = width >= LARGE_TABLET_MIN_WIDTH;
  const isCompact = width < COMPACT_MAX_WIDTH;
  const contentMaxWidth = isLargeTablet ? 960 : isTablet ? 820 : undefined;
  const formMaxWidth = isTablet ? 720 : undefined;
  const horizontalPadding = isLargeTablet ? 32 : isTablet ? 24 : isCompact ? 14 : 20;
  const statColumns = isTablet ? 4 : 2;
  const gridGap = isTablet ? 16 : 12;
  const contentWidth = Math.min(width, contentMaxWidth ?? width);
  const statCardWidth =
    (contentWidth - horizontalPadding * 2 - gridGap * (statColumns - 1)) /
    statColumns;

  const scaleFont = (size: number) =>
    Math.round(size * Math.min(Math.max(fontScale, 1), 1.12));

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    isCompact,
    contentMaxWidth,
    formMaxWidth,
    horizontalPadding,
    statColumns,
    statCardWidth,
    gridGap,
    scaleFont,
  };
}
