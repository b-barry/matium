/**
 * Extracted from now-cli : https://github.com/zeit/now-cli/tree/master/src/util/output
 */
import {cyan, gray, grey, red, underline, yellow} from 'chalk';
import printf from 'printf';

export const error = (...msgs) => `${red('> Error!')} ${msgs.join('\n')}`;

export const aborted = msg => `${red('> Aborted!')} ${msg}`;

export const info = (...msgs) => `${gray('>')} ${msgs.join('\n')}`;

export const link = text => underline(text);

export const listItem = (n, msg) => {
  if (!msg) {
    msg = n
    n = '-'
  }
  if (!isNaN(n)) {
    n += '.'
  }
  return `${gray(n)} ${msg}`
};

export const note = msg => `${yellow('> NOTE:')} ${msg}`;

export const ok = msg => `${cyan(process.platform === 'win32' ? '√' : '✔')} ${msg}`;

export const success = msg => `${cyan('> Success!')} ${msg}`;
export const newLine = () => console.log();

// Print a table
export const table = (fieldNames = [], data = [], margins = []) => {
  const printLine = (data, sizes) =>
    data.reduce((line, col, i) => {
      return line + printf(`%-${sizes[i]}s`, col)
    }, '');

  // Compute size of each column
  const sizes = data
    .reduce((acc, row) => {
      return row.map((col, i) => {
        const currentMaxColSize = acc[i] || 0;
        const colSize = (col && col.length) || 0;
        return Math.max(currentMaxColSize, colSize)
      })
    }, fieldNames.map(col => col.length))
    // Add margin to all columns except the last
    .map((size, i) => (i < margins.length && size + margins[i]) || size);

  // Print header
  console.log(grey(printLine(fieldNames, sizes)));
  // Print content
  data.forEach(row => console.log(printLine(row, sizes)))
};