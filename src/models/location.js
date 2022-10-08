import sluggify from '../utils/sluggify';
import nameExplorerLogo from '../features/images/noimage.png';
import ICONS from '../features/images/icons';

export const LOCATION_TYPES = [
  // TODO: make hex
  'Building', '#B973F5',
  'Street/Thoroughfare', '#777777',
  'School', '#B973F5',
  'Park/Playground', '#00AC4F',
  'Monument/Statue', '#0094FF',
  'Library', '#6E2991',
  /* other */ 'orange',
];

const LOCATION = {
  PLACE_NAME: 'fld3zcPVX14gMRFd1',
  COORDS: 'fld03C27tmVnEg1rP',
  TYPE: 'fldb2kOoaaol8IIiQ',
  IMAGES: 'fldchc6j0XRMy0vb9',
  DESCRIPTION: 'fld18VKjlf9BGaE9N',
  SUBMITTED_AT: 'fld63z0I0JEzkE26Z',
  IS_PRIMARY: 'fldiT7GQqBoUlnanU',
  CITATION: 'fldKwhgXfbzaB1p1X',
  SOURCES: 'fldCwcnz1yvlpDv1D',
};

export const TOUR = {
  NAME: 'fld6TCPloQX95dOVJ',
  IMAGES: 'fldsqdIWbpl4GXLJu',
  DESCRIPTION: 'fldfcR7YEf8T5M0by',
};

function getMonumentTypeColor(type) {
  return LOCATION_TYPES[LOCATION_TYPES.findIndex(t => t === type) + 1];
}

function parseAirtableRTF(text = '') {
  return text.replaceAll(/<(.*?)>/g, (m) => {
    const url = m.match(/<(.*?)>/)[1];

    if (url) {
      return `<a href="${url}" target="_blank">${url}</a>`;
    } else {
      return '';
    }
  });
}

export function getIconFromMonumentType(monument) {
  return ICONS_BY_LOCATION_TYPE[monument[LOCATION.TYPE]] || ICONS['library'];
}

export function resultFactory(result) {
  const hasImage = !!(result.properties[LOCATION.IMAGES]?.length);
  return {
    hasImage,
    mastheadImage: hasImage ? result.properties[LOCATION.IMAGES][0]?.thumbnails.large.url : nameExplorerLogo,
    submissionDate: result.properties[LOCATION.SUBMITTED_AT] && (new Date(result.properties[LOCATION.SUBMITTED_AT])).toLocaleDateString(),
    truncatedDescription: result.properties[LOCATION.DESCRIPTION]?.substring(0, 70),
    typeColor: getMonumentTypeColor(result.properties[LOCATION.TYPE]),
    slug: sluggify(result.properties),
    iconData: getIconFromMonumentType(result.properties),
    formattedSourceDescription: parseAirtableRTF(result.properties[LOCATION.SOURCES]),
    ...result
  }
};

export const ICONS_BY_LOCATION_TYPE = {
  'Building': ICONS['building'],
  'Street/Thoroughfare': ICONS['street'],
  'School': ICONS['school'],
  'Park/Playground': ICONS['park'],
  'Monument/Statue': ICONS['monument'],
  'Library': ICONS['inactive'],
};

export function extractlocationIdentifier(slug) {
  return slug.split('-').reverse()[0];
}

export default LOCATION;
