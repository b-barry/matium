#!/usr/bin/env node
import program from 'commander';
import Conf from 'conf';
import {error, info, ok, success} from './utils/output.format';
import exit from './utils/exit';
import {resolvePaths} from './utils/path';
import {pathExists} from 'fs-extra';
import Debug from 'debug';
import {
  createAllMediumPost,
  getFilesToProcess,
  parseCodeBlockAndCreateGistFromContent,
  parseFilesMatter
} from './core';
import {getClient} from './utils/medium';
import {blue} from 'chalk';
import slugid from 'slugid';
import {getClient as getGistClient} from './utils/gist';

const debug = Debug('md:main');
const conf = new Conf();

const MEDIUM_TOKEN_KEY = 'medium-token';
const GIST_TOKEN_KEY = 'gist-token';

const config = {
  mediumToken: conf.get(MEDIUM_TOKEN_KEY),
  gistToken: conf.get(GIST_TOKEN_KEY)
};

// Commander
const configuredProgram = program
  .version('0.0.1')
  .usage('<file ...> [options]')
  .option(
    `-m, --${MEDIUM_TOKEN_KEY} [token]`,
    'Third party integration token on medium, stored after first use'
  )
  .option(
    `-g, --${GIST_TOKEN_KEY} [token]`,
    'Gist authentication token, stored after first use'
  )
  .parse(process.argv);

const main = async ({files, config, argv}) => {
  console.log(ok('matium starting ... \n'));
  console.log('_config', config, argv);

  let _config = Object.assign({}, config);

  if (
    (!config.mediumToken && !argv.mediumToken) ||
    (!config.gistToken && !argv.gistToken)
  ) {
    console.error(error(`No medium token or gist token found `));
    await exit(1);
  }

  if (config.mediumToken !== argv.mediumToken && argv.mediumToken) {
    conf.set(MEDIUM_TOKEN_KEY, argv.mediumToken);
    _config = Object.assign({}, config, {mediumToken: argv.mediumToken});
  }

  if (config.gistToken !== argv.gistToken && argv.gistToken) {
    conf.set(GIST_TOKEN_KEY, argv.gistToken);
    _config = Object.assign({}, config, {gistToken: argv.gistToken});
  }

  const filesToProcess = await getFilesToProcess(files);

  if (filesToProcess.length === 0) {
    console.log(info(`No files to process :(`));
    return;
  }

  console.log(info(`Reading content of all files and parsing the matter \n`));

  const contentsToProcess = await Promise.all(parseFilesMatter(filesToProcess));

  const alias = slugid.nice();
  const gistClient = getGistClient(_config.gistToken);

  console.log(info(`Parsing code blocks and creating gist\n`));

  const posts = await Promise.all(
    contentsToProcess.map(
      parseCodeBlockAndCreateGistFromContent(alias, gistClient)
    )
  ).filter(post => !!post);

  console.log(info(`Creating medium post(s) \n`));

  const mediumClient = getClient(_config.mediumToken);

  let mediumUser;

  try {
    mediumUser = await mediumClient.getUserAsync();

    console.log(blue(`Authenticated in medium as ${mediumUser.username} \n`));

    await Promise.all(createAllMediumPost(mediumClient, mediumUser)(posts));

    console.log(success(`Done! \n`));
  } catch (err) {
    console.error(
      error(
        `An unexpected error occurred while creating the medium post: 
        ${err.message}`
      )
    );
    await exit(1);
  }
};

debug('start');

const handleRejection = err => {
  debug('handling rejection');
  if (err) {
    if (err instanceof Error) {
      handleUnexpected(err);
    } else {
      console.error(error(`An unexpected rejection occurred\n  ${err}`));
    }
  } else {
    console.error(error('An unexpected empty rejection occurred'));
  }
  process.exit(1);
};

const handleUnexpected = err => {
  debug('handling unexpected error');
  console.error(
    error(
      `An unexpected error occurred!\n  ${err.message} ${err.stack} ${err.stack}`
    )
  );
  process.exit(1);
};

process.on('unhandledRejection', handleRejection);
process.on('uncaughtException', handleUnexpected);

// Don't use `.then` here. We need to shutdown gracefully, otherwise
// sub commands waiting for further data won't work (like `logs` and `logout`)!
const options = {
  files: resolvePaths(configuredProgram.args),
  config,
  argv: {
    mediumToken: configuredProgram.mediumToken,
    gistToken: configuredProgram.gistToken
  }
};
main(options).catch(handleUnexpected);
