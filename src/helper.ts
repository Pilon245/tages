import * as fs from 'fs';
import * as readline from 'readline';
import { promisify } from 'util';

export const splitFile = async (inputFilePath, chunkSize) => {
  const splitFiles = [];
  let currentChunk = 0;
  let currentLine = 0;
  let lines = [];

  const readStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({ input: readStream });

  for await (const line of rl) {
    lines.push(line);
    currentLine++;

    if (currentLine === chunkSize) {
      const splitFilePath = `files/chunk${currentChunk}.txt`;
      await promisify(fs.writeFile)(splitFilePath, lines.join('\n'));
      splitFiles.push(splitFilePath);

      lines = [];
      currentChunk++;
      currentLine = 0;
    }
  }

  // Записываем оставшиеся строки в последний временный файл
  if (lines.length > 0) {
    const splitFilePath = `files/chunk${currentChunk}.txt`;
    await promisify(fs.writeFile)(splitFilePath, lines.join('\n'));
    splitFiles.push(splitFilePath);
  }

  return splitFiles;
};

export const mergeSortedFiles = async (sortedFiles, outputFilePath) => {
  const writeStream = fs.createWriteStream(outputFilePath);

  const fileStreams = sortedFiles.map((sortedFile) =>
    fs.createReadStream(sortedFile),
  );

  await Promise.all(
    fileStreams.map((fileStream) => {
      return new Promise((resolve, reject) => {
        fileStream.pipe(writeStream, { end: false });
        fileStream.on('end', resolve);
        fileStream.on('error', reject);
      });
    }),
  );

  await new Promise((resolve, reject) => {
    writeStream.end();
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
};

export const sortChunk = async (chunkFile) => {
  const lines = [];

  const readStream = fs.createReadStream(chunkFile);
  const rl = readline.createInterface({ input: readStream });

  for await (const line of rl) {
    lines.push(line);
  }

  const sortedLines = lines.sort();

  const sortedFile = `${chunkFile}.sorted`;
  await promisify(fs.writeFile)(sortedFile, sortedLines.join('\n'));

  return sortedFile;
};

export const deleteFiles = async (files) => {
  for (const file of files) {
    await promisify(fs.unlink)(file);
  }
};
