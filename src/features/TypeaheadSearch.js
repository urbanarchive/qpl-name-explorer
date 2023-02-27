import AsyncSelect from 'react-select/async';
import { useNavigate } from "react-router-dom";
import LOCATION from '../models/location';

function TypeaheadSearch({ locations }) {
  const navigate = useNavigate();
  const loadOptions = async (inputString, callback) => {
    // search by stringified attributes
    const foundLocations = locations?.features
      .filter(f => JSON.stringify(f.properties).toLowerCase().includes(inputString.toLowerCase()))
      .map(f => ({
        label: f.properties[LOCATION.PLACE_NAME],
        value: f.properties[LOCATION.COORDS],
        meta: { type: f.properties[LOCATION.TYPE] },
      }));

    callback(foundLocations);
  }

  const handleInputChange = (selection) => {
    if (!selection) return;
    const { meta: { type }, value } = selection;

    if (type === 'address') {
      // TODO: find better approach than this
      window.location.hash = `#14/${value[1]}/${value[0]}`;
    } else {
      navigate(`/locations?key=${LOCATION.COORDS}&value=${value}`);
    }
  }

  return <AsyncSelect
    className='w-full rounded-md'
    loadOptions={loadOptions}
    onChange={handleInputChange}
    styles={{
      control: (provided) => ({
        ...provided,
      }),
    }}
    placeholder='Search...'
    isClearable={true}
  />;
}

export default TypeaheadSearch;
