import { Link } from 'react-router-dom';
import qplLogo from '../features/images/qpl_logo.png';
import sluggify from '../utils/sluggify';
import MONUMENT from '../models/monument';
import { MONUMENT_TYPES } from '../features/MainMap';


function getMonumentTypeColor(type) {
  return MONUMENT_TYPES[MONUMENT_TYPES.findIndex(t => t === type) + 1];
}

function resultFactory(result) {
  const hasImage = !!(result.properties[MONUMENT.IMAGES]?.length);
  return {
    hasImage,
    mastheadImage: hasImage ? result.properties[MONUMENT.IMAGES][0]?.thumbnails.large.url : qplLogo,
    submissionDate: result.properties[MONUMENT.SUBMITTED_AT] && (new Date(result.properties[MONUMENT.SUBMITTED_AT])).toLocaleDateString(),
    truncatedDescription: result.properties[MONUMENT.DESCRIPTION]?.substring(0, 70),
    typeColor: getMonumentTypeColor(result.properties[MONUMENT.TYPE]),
    slug: sluggify(result.properties),
    ...result
  }
};

function ListResult(props) {
  const result = resultFactory(props.result);

  return <div className="flex gap-4 p-4">
    <Link to={`monuments/${result.slug}`} className="flex shrink-0 w-14">
      {<div
        style={{ backgroundImage: `url(${result.mastheadImage})` }}
        className="bg-cover bg-center w-full h-full hover:border-qpl-purple border-2 rounded-md"
        alt={result.properties[MONUMENT.IMAGES]?.length && result.properties[MONUMENT.IMAGES][0]?.filename}
      />}
    </Link>
    <Link to={`monuments/${result.slug}`} className="flex flex-col grow truncate hover:text-qpl-purple">
      <h2 className='font-bold'>{result.properties[MONUMENT.PLACE_NAME]}</h2>
      <h4
        style={{
          color: result.typeColor,
        }}
        className={`font-semibold text-sm`}
      >
        Type: {result.properties[MONUMENT.TYPE]}
      </h4>
      <span className='text-sm truncate'>{result.truncatedDescription}</span>
    </Link>
    <div className="flex items-center">
      {result.submissionDate}
    </div>
  </div>
}

export default ListResult;
