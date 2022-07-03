import dasherize from 'lodash.kebabcase';
import MONUMENT from '../models/monument';

function sluggify(monument) {
  const { [MONUMENT.PLACE_NAME]: placeName } = monument;

  return `${dasherize(placeName)}-${monument.id}`;
}

export default sluggify;
