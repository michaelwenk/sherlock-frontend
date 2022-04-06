function convertMultiplicityStringToNumber(
  multiplicity: string | undefined,
): number | undefined {
  switch (multiplicity) {
    case 's':
      return 0;
    case 'd':
      return 1;
    case 't':
      return 2;
    case 'q':
      return 3;
    default:
      return undefined;
  }
}

export default convertMultiplicityStringToNumber;
