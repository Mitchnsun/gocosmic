/** Border classes for a station cell in the 1 / 2 / 4-column responsive grid. */
export const getStationBorderClass = (index: number): string => {
  switch (index) {
    case 0:
      return '';
    case 1:
      return 'border-t sm:border-t-0 sm:border-l';
    case 2:
      return 'border-t lg:border-t-0 lg:border-l';
    default:
      return 'border-t sm:border-l lg:border-t-0';
  }
};
