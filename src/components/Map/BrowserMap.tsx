import React from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  createMapEffectHook,
  createMapEventHook,
  useMobileMode,
} from '../helpers';
import { useMapStateContext } from '../utils/MapStateContext';
import { useFeatureContext } from '../utils/FeatureContext';
import { useFeatureMarker } from './behaviour/useFeatureMarker';
import { useOnMapClicked } from './behaviour/useOnMapClicked';
import { useUpdateViewOnMove } from './behaviour/useUpdateViewOnMove';
import { useUpdateStyle } from './behaviour/useUpdateStyle';
import { useInitMap } from './behaviour/useInitMap';
import { Translation } from '../../services/intl';
import { useToggleTerrainControl } from './behaviour/useToggleTerrainControl';
import { webglSupported } from './helpers';
import { useOnMapLongPressed } from './behaviour/useOnMapLongPressed';
import { useAddTopRightControls } from './useAddTopRightControls';

const useOnMapLoaded = createMapEventHook((map, onMapLoaded) => ({
  eventType: 'load',
  eventHandler: onMapLoaded,
}));

const useUpdateMap = createMapEffectHook((map, viewForMap) => {
  const center = [viewForMap[2], viewForMap[1]];
  map.jumpTo({ center, zoom: viewForMap[0] });
});

const NotSupportedMessage = () => (
  <span
    style={{ position: 'absolute', left: '48%', top: '48%', maxWidth: '350px' }}
  >
    <Translation id="webgl_error" />
  </span>
);

// TODO #460 https://cdn.klokantech.com/openmaptiles-language/v1.0/openmaptiles-language.js + use localized name in FeaturePanel

const BrowserMap = ({ onMapLoaded }) => {
  const mobileMode = useMobileMode();
  const { setFeature } = useFeatureContext();
  const [map, mapRef] = useInitMap();
  useAddTopRightControls(map, mobileMode);
  useOnMapClicked(map, setFeature);
  useOnMapLongPressed(map, setFeature);
  useOnMapLoaded(map, onMapLoaded);
  useFeatureMarker(map);

  const { viewForMap, setViewFromMap, setBbox, activeLayers } =
    useMapStateContext();
  useUpdateViewOnMove(map, setViewFromMap, setBbox);
  useToggleTerrainControl(map);
  useUpdateMap(map, viewForMap);
  useUpdateStyle(map, activeLayers);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

const BrowserMapCheck = ({ onMapLoaded }) => {
  if (!webglSupported) {
    onMapLoaded();
    return <NotSupportedMessage />;
  }

  return <BrowserMap onMapLoaded={onMapLoaded} />;
};

export default BrowserMapCheck; // dynamic import
