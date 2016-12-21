// import errors from 'feathers-errors';
import makeDebug from 'debug';

const debug = makeDebug('feathers-guide');

export default function init () {
  debug('Initializing feathers-guide plugin');
  return 'feathers-guide';
}
