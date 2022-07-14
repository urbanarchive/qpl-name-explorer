import sluggify from '../utils/sluggify';
import qplLogo from '../features/images/qpl_logo.png';
import ICONS from '../features/images/icons';

export const MONUMENT_TYPES = [
  // TODO: make hex
  'Building', '#B973F5',
  'Street/Thoroughfare', '#777777',
  'School', '#B973F5',
  'Park/Playground', '#00AC4F',
  'Monument/Statue', '#0094FF',
  'Library', '#6E2991',
  /* other */ 'orange',
];

const MONUMENT = {
  PLACE_NAME: 'fld3zcPVX14gMRFd1',
  COORDS: 'fld03C27tmVnEg1rP',
  TYPE: 'fldb2kOoaaol8IIiQ',
  IMAGES: 'fldchc6j0XRMy0vb9',
  DESCRIPTION: 'fld18VKjlf9BGaE9N',
  SUBMITTED_AT: 'fld63z0I0JEzkE26Z',
  IS_PRIMARY: 'fldiT7GQqBoUlnanU',
  CITATION: 'fldKwhgXfbzaB1p1X',
};

function getMonumentTypeColor(type) {
  return MONUMENT_TYPES[MONUMENT_TYPES.findIndex(t => t === type) + 1];
}

export function getIconFromMonumentType(monument) {
  return ICONS_BY_MONUMENT_TYPE[monument[MONUMENT.TYPE]] || ICONS['library'];
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

export const ICONS_BY_MONUMENT_TYPE = {
  'Building': ICONS['building'],
  'Street/Thoroughfare': ICONS['street'],
  'School': ICONS['school'],
  'Park/Playground': ICONS['park'],
  'Monument/Statue': ICONS['monument'],
  'Library': ICONS['library'],
};

export default MONUMENT;
