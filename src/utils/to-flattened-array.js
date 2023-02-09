function toFlattenedArray(object) {
  return Object.entries(object)
  .reduce((acc, [key, value]) => [key, value, ...acc], [])
}

export default toFlattenedArray;
