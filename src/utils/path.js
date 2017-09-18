/**
 * Extracted from now-cli : https://github.com/zeit/now-cli/tree/master/src/util/output
 */
import {homedir} from 'os';
import {resolve} from 'path';

export const resolvePath = (path) => {
  return resolve(path)
};

export const resolvePaths = (paths) => {
  return paths.map(resolvePath);
};

export const humanizePath = (path) => {
  const resolved = resolvePath(path);
  const _homedir = homedir();
  if (resolved.indexOf(_homedir) === 0) {
    return `~` + resolved.substr(_homedir.length)
  } else {
    return resolved
  }
};

export const humanizePaths = (paths) => {
  return paths.map(humanizePath);
};



