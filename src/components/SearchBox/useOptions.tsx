import { useEffect } from 'react';
import { useMapStateContext } from '../utils/MapStateContext';
import { useStarsContext } from '../utils/StarsContext';
import { abortFetch } from '../../services/fetch';
import {
  GEOCODER_ABORTABLE_QUEUE,
  fetchGeocoderOptions,
} from './options/geocoder';
import { getStarsOptions } from './options/stars';
import { getOverpassOptions } from './options/overpass';
import { getPresetOptions } from './options/preset';

export const useOptions = (inputValue: string, setOptions) => {
  const { view } = useMapStateContext();
  const { stars } = useStarsContext();

  useEffect(() => {
    (async () => {
      abortFetch(GEOCODER_ABORTABLE_QUEUE);

      if (inputValue === '') {
        setOptions(getStarsOptions(stars));
        return;
      }

      const overpassOptions = getOverpassOptions(inputValue);
      if (overpassOptions.length) {
        setOptions(overpassOptions);
        return;
      }

      const { before, after } = await getPresetOptions(inputValue);
      setOptions([...before, { loader: true }]);

      fetchGeocoderOptions(inputValue, view, setOptions, before, after);
    })();
  }, [inputValue, stars]); // eslint-disable-line react-hooks/exhaustive-deps
};
