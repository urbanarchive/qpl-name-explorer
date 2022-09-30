import { Link } from 'react-router-dom';
import MONUMENT from '../models/monument';
import { resultFactory } from '../models/monument';

const ROUTES_BY_TYPE = {
  MAP_REFERENCE: 'monuments',
  ASSET: 'monuments',
  TOUR: 'tours',
};

function ListResult(props) {
  const result = resultFactory(props.result);
  const routeForType = ROUTES_BY_TYPE[result.properties.LOCATION_TYPE];

  return <div className="flex gap-4 p-4">
    <Link to={`/${routeForType}/${result.slug}`} className="flex shrink-0 h-14 w-14">
      {<div
        style={{ backgroundImage: `url(${result.mastheadImage})` }}
        className="bg-cover bg-center w-full h-full hover:border-qpl-purple border-2 rounded-md"
        alt={result.properties[MONUMENT.IMAGES]?.length && result.properties[MONUMENT.IMAGES][0]?.filename}
      />}
    </Link>
    <Link to={`/${routeForType}/${result.slug}`} className="flex flex-col grow truncate hover:text-qpl-purple">
      <h2 className='font-bold'>
        <img src={result.iconData} alt={result.properties[MONUMENT.TYPE]} className="w-4 h-4 inline mr-1" />
        {result.properties[MONUMENT.PLACE_NAME]}
      </h2>
      <span className='text-sm truncate'>{result.truncatedDescription}</span>
    </Link>
    <div className="flex items-center">
      {result.submissionDate}
    </div>
  </div>
}

export default ListResult;
