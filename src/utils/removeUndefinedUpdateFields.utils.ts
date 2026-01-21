function removeUndefinedUpdateFields<T extends object>(updateData: T) {
  const clearFields = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined),
  );

  return clearFields;
}

export default removeUndefinedUpdateFields;
