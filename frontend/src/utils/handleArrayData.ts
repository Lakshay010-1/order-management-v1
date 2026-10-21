const addData = <T>(details: T, array: Array<T>) => {
  array.push(details);
  return array;
};
const updateData = (id: number, details: any, array: Array<any>) => {
  return array.map((element) => {
    if (element.id === id) {
      element = { ...element, ...details };
    }
    return element;
  });
};
const deleteData = <T extends { id: number }>(id: number, array: Array<T>) => {
  return array.filter((element) => element.id !== id);
};

export { addData, updateData, deleteData };
