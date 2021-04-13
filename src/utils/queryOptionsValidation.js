function createError(errors, key) {
  if (!errors[key]) {
    errors[key] = {};
  }
}

function validateQueryOptions(values) {
  const errors = {};
  // check ELIM
  if (
    values.elucidationOptions.elimP2 !== 0 &&
    values.elucidationOptions.elimP2 < 4
  ) {
    createError(errors, 'elucidationOptions');
    errors.elucidationOptions.elimP2 =
      'Invalid value for ELIM P2: Must be 0 (unlimited) or at least 4';
  }
  // check HMBC
  if (values.elucidationOptions.hmbcP3 < 2) {
    createError(errors, 'elucidationOptions');
    errors.elucidationOptions.hmbcP3 =
      'Invalid value for HMBC P3: Must be 2 or greater';
  }
  if (
    values.elucidationOptions.hmbcP4 !== 0 &&
    values.elucidationOptions.hmbcP4 < values.elucidationOptions.hmbcP3
  ) {
    createError(errors, 'elucidationOptions');
    errors.elucidationOptions.hmbcP4 =
      'Invalid value for HMBC P4: Must be equal to HMBC P3 or greater';
  }
  // check COSY
  if (values.elucidationOptions.cosyP3 < 3) {
    createError(errors, 'elucidationOptions');
    errors.elucidationOptions.hmbcP3 =
      'Invalid value for COSY P3: Must be 3 or greater';
  }
  if (
    values.elucidationOptions.cosyP4 !== 0 &&
    values.elucidationOptions.cosyP4 < values.elucidationOptions.cosyP3
  ) {
    createError(errors, 'elucidationOptions');
    errors.elucidationOptions.cosyP4 =
      'Invalid value for COSY P4: Must be equal to COSY P3 or greater';
  }

  console.log(values);
  console.log(errors);

  return errors;
}

export default validateQueryOptions;
