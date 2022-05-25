export const findAvailableFields = (position: number, sizeField: number) => {
  const availableFields = [];
  const upCheck = () => {
    return position >= sizeField * 2;
  };
  const upHalfCheck = () => {
    return position >= sizeField;
  };
  const downCheck = () => {
    return position < sizeField ** 2 - sizeField * 2;
  };
  const downHalfCheck = () => {
    return position < sizeField ** 2 - sizeField;
  };
  const leftCheck = () => {
    return position % sizeField > 1;
  };
  const leftHalfCheck = () => {
    return position % sizeField > 0;
  };
  const rightCheck = () => {
    return position % sizeField < sizeField - 2;
  };
  const rightHalfCheck = () => {
    return position % sizeField < sizeField - 1;
  };

  if (upCheck() && rightHalfCheck()) {
    availableFields.push(position - sizeField * 2 + 1);
  }
  if (upCheck() && leftHalfCheck()) {
    availableFields.push(position - sizeField * 2 - 1);
  }
  if (rightCheck() && upHalfCheck()) {
    availableFields.push(position - sizeField + 2);
  }
  if (rightCheck() && downHalfCheck()) {
    availableFields.push(position + sizeField + 2);
  }
  if (downCheck() && rightHalfCheck()) {
    availableFields.push(position + sizeField * 2 + 1);
  }
  if (downCheck() && leftHalfCheck()) {
    availableFields.push(position + sizeField * 2 - 1);
  }
  if (leftCheck() && upHalfCheck()) {
    availableFields.push(position - sizeField - 2);
  }
  if (leftCheck() && downHalfCheck()) {
    availableFields.push(position + sizeField - 2);
  }
  return availableFields;
};
