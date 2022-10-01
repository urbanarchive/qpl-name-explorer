import dasherize from 'lodash.kebabcase';
import LOCATION from '../models/location';

function sluggify(location) {
  const { [LOCATION.PLACE_NAME]: placeName } = location;

  return `${dasherize(placeName)}-${location.id}`;
}

export default sluggify;
