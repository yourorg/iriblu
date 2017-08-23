import {useDeps} from 'react-simple-di';
import { composeAll, composeWithTracker } from 'mantra-core';

export const sideBarComposer = ({}, onData) => {

  onData(null, { } );

};

export default (component, _authComposer) => composeAll(
    composeWithTracker(_authComposer),
    composeWithTracker(sideBarComposer),
    useDeps()
  )(component);
