/**
 * Extracted from now-cli : https://github.com/zeit/now-cli/tree/master/src/util/output
 */

const exit = code =>
  new Promise(() => {
    // We give stdout some time to flush out
    // because there's a node bug where
    // stdout writes are asynchronous
    // https://github.com/nodejs/node/issues/6456
    setTimeout(() => process.exit(code || 0), 100);
  });

export default exit;
