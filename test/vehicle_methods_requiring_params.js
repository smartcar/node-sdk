'use strict';

/* this file exports an array of all vehicle methods that *require* one or more
parameters, used to exclude these methods from the automatic testing of the
Vehicle prototype in the 'test_all_vehicle_methods.js' file. Any method listed
here should have a manual test written in that file.*/
module.exports = [
  'flashHeadlights',
  'activateChildSafetyLocks',
  'disableChildSafetyLocks',
  'tiltSideviewMirrors',
  'openWindows',
  'closeWindows',
  'lockWindows',
  'unlockWindows',
  'setUnitSystem',
];
