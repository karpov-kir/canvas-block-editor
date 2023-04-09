export const createIdGenerator = () => {
  let lastId = 0;

  return () => {
    return ++lastId;
  };
};
