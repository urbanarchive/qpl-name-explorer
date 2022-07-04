import { Link } from 'react-router-dom';
import sluggify from '../utils/sluggify';
import MONUMENT from '../models/monument';
import { MONUMENT_TYPES } from '../features/MainMap';

function getMonumentTypeColor(type) {
  return MONUMENT_TYPES[MONUMENT_TYPES.findIndex(t => t === type) + 1];
}

function ListResult({ result }) {
  return <div className="flex gap-4 p-4">
    <Link to={`monuments/${sluggify(result.properties)}`} className="flex w-14">
      {result.properties[MONUMENT.IMAGES] && <div
        style={{ backgroundImage: `url(${result.properties[MONUMENT.IMAGES][0]?.thumbnails.large.url})` }}
        className="bg-cover bg-center w-full h-full hover:border-qpl-purple border-2 rounded-md"
        alt={result.properties[MONUMENT.IMAGES][0]?.filename}
      />}
    </Link>
    <Link to={`monuments/${sluggify(result.properties)}`} className="flex flex-col grow truncate hover:text-qpl-purple">
      <h2 className='font-bold'>{result.properties[MONUMENT.PLACE_NAME]}</h2>
      <h4
        style={{
          color: getMonumentTypeColor(result.properties[MONUMENT.TYPE]),
        }}
        className={`font-semibold text-sm`}
      >
        Type: {result.properties[MONUMENT.TYPE]}
      </h4>
      <span className='text-sm truncate'>{result.properties[MONUMENT.DESCRIPTION].substring(0, 50)}</span>
    </Link>
    <div className="flex items-center">
      {result.properties[MONUMENT.SUBMITTED_AT] && (new Date(result.properties[MONUMENT.SUBMITTED_AT])).toLocaleDateString()}
    </div>
  </div>
}

export default ListResult;
