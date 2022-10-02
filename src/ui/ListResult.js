import { Link } from 'react-router-dom';
import LOCATION from '../models/location';
import { resultFactory } from '../models/location';

const ROUTES_BY_TYPE = {
  MAP_REFERENCE: 'locations',
  ASSET: 'locations',
  TOUR: 'tours',
};

function ListResult(props) {
  const result = resultFactory(props.result);
  const routeForType = ROUTES_BY_TYPE[result.properties.LOCATION_TYPE];

  const disableInteractions = result.properties[LOCATION.TYPE] === 'Library';

  return <div className="flex gap-4">
    <Link to={`/${routeForType}/${result.slug}`} className="flex shrink-0 h-14 w-14">
      <div
        style={{ backgroundImage: `url(${result.mastheadImage})` }}
        className="bg-cover bg-center w-full h-full hover:border-qpl-purple border-2 rounded-md"
        alt={result.properties[LOCATION.IMAGES]?.length && result.properties[LOCATION.IMAGES][0]?.filename}
      />
    </Link>
    <Link to={`/${routeForType}/${result.slug}`} className="flex flex-col grow truncate hover:text-qpl-purple">
      <h2 className='font-bold'>
        <img src={result.iconData} alt={result.properties[LOCATION.TYPE]} className="w-4 h-4 inline" />
        <span className='ml-1'>{result.properties[LOCATION.PLACE_NAME]}</span>
      </h2>
      <span className='text-sm truncate'>{result.truncatedDescription}</span>
    </Link>
    <div className="flex items-center">
      {result.submissionDate}
    </div>
  </div>
}

export default ListResult;
