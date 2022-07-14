import sluggify from '../utils/sluggify';
import { MONUMENT_TYPES } from '../features/MainMap';
import { getIconFromMonumentType } from '../features/MainMap';
import qplLogo from '../features/images/qpl_logo.png';

const MONUMENT = {
  PLACE_NAME: 'fld3zcPVX14gMRFd1',
  COORDS: 'fld03C27tmVnEg1rP',
  TYPE: 'fldb2kOoaaol8IIiQ',
  IMAGES: 'fldchc6j0XRMy0vb9',
  DESCRIPTION: 'fld18VKjlf9BGaE9N',
  SUBMITTED_AT: 'fld63z0I0JEzkE26Z',
  IS_PRIMARY: 'fldiT7GQqBoUlnanU',
};

function getMonumentTypeColor(type) {
  return MONUMENT_TYPES[MONUMENT_TYPES.findIndex(t => t === type) + 1];
}

export function resultFactory(result) {
  const hasImage = !!(result.properties[MONUMENT.IMAGES]?.length);
  return {
    hasImage,
    mastheadImage: hasImage ? result.properties[MONUMENT.IMAGES][0]?.thumbnails.large.url : qplLogo,
    submissionDate: result.properties[MONUMENT.SUBMITTED_AT] && (new Date(result.properties[MONUMENT.SUBMITTED_AT])).toLocaleDateString(),
    truncatedDescription: result.properties[MONUMENT.DESCRIPTION]?.substring(0, 70),
    typeColor: getMonumentTypeColor(result.properties[MONUMENT.TYPE]),
    slug: sluggify(result.properties),
    iconData: getIconFromMonumentType(result.properties),
    ...result
  }
};

export default MONUMENT;
