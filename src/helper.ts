import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
// import { default as lineByLine } from 'n-readlines';

const lineByLine = require('n-readlines');

export const readNextChunk = async (inputFilePath, maxOutputFileSize) => {
  let currentChunk = 1;
  let currentLine = 0;
  let outputStream = null;
  let currentFileSize = 0;
  const splitFiles = [];
  let lines = [];

  const createNewOutputFile = () => {
    const outputFilePath = `files/chunk_${currentChunk}.txt`;
    outputStream = fs.createWriteStream(outputFilePath);
    currentChunk++;
    splitFiles.push(outputFilePath);
  };

  const processLine = (line) => {
    const lineSize = Buffer.byteLength(line + '\n', 'utf8');

    //Буффер достиг объема чанка, записываем строки в файл
    if (currentFileSize + lineSize > maxOutputFileSize) {
      lines.sort();
      outputStream.write(lines.join('\n'));
      outputStream.end();
      createNewOutputFile();
      currentFileSize = 0;
      lines = [];
    }

    lines.push(line);
    currentFileSize += lineSize;
    currentLine++;
  };
  const splitFileByLines = async () => {
    const fileStream = fs.createReadStream(inputFilePath, 'utf8');
    const lineReader = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, //для правильного перевода строки на разных ОС
    });

    createNewOutputFile();

    for await (const line of lineReader) {
      processLine(line);
    }

    lines.sort();
    outputStream.write(lines.join('\n'));
    outputStream.end();

    console.log('Разделение файла закончилось');

    return splitFiles;
  };

  console.log('Разделение файла началось');
  return splitFileByLines();
};

export const sortMergeFile = (
  splitFiles: string[],
  outputFilePath: string,
  sizeRam: number,
) => {
  try {
    const appendHelpFunc = (mergeFilePath) => {
      lines.sort();
      fs.appendFileSync(mergeFilePath, lines.join('\n') + '\n');
      lines = [];
      size = 0;
    };
    //проверка условия остановки рекурсии, переименование отсортированного файла и удаление временных файлов
    if (splitFiles.length === 1) {
      fs.renameSync(splitFiles[0], outputFilePath);
      fs.rm(path.resolve('files'), { recursive: true }, () => {});
      return true;
    }

    //массив с названиями отсортированных
    const arraySortedFile = [];
    let lines = [];
    let size = 0;

    for (let i = 0; i < splitFiles.length - 1; ) {
      const mergeFilePath = path.join(splitFiles[i] + i);
      arraySortedFile.push(mergeFilePath);

      console.log('Cоздание файла: ', mergeFilePath);

      fs.writeFileSync(mergeFilePath, '');

      const liner = new lineByLine(path.join(splitFiles[i]));
      const liner2 = new lineByLine(path.join(splitFiles[i + 1]));

      let str1 = liner.next().toString('ascii');
      let str2 = liner2.next().toString('ascii');

      while (str1 !== 'false' && str2 !== 'false') {
        lines.push(str1);
        lines.push(str2);

        const lineOneSize = Buffer.byteLength(str1, 'utf8');
        const lineTwoSize = Buffer.byteLength(str2, 'utf8');

        size = size + lineOneSize;
        size = size + lineTwoSize;

        str1 = liner.next().toString('ascii');
        str2 = liner2.next().toString('ascii');

        //если буффер стал больше нашего чанка
        if (size >= sizeRam) {
          appendHelpFunc(mergeFilePath);
        }

        //если один файл закончился, все остальные строки с другого файла добавляем в конец
        if (str1 === 'false') {
          while (str2 !== 'false') {
            lines.push(str2);
            const lineTwoSize = Buffer.byteLength(str2, 'utf8');
            size = size + lineTwoSize;
            str2 = liner2.next().toString('ascii');

            if (size >= sizeRam) {
              appendHelpFunc(mergeFilePath);
            }
          }
          appendHelpFunc(mergeFilePath);
        } else if (str2 === 'false') {
          while (str1 !== 'false') {
            lines.push(str1);
            const lineOneSize = Buffer.byteLength(str1, 'utf8');
            size = size + lineOneSize;
            str1 = liner.next().toString('ascii');

            if (size >= sizeRam) {
              appendHelpFunc(mergeFilePath);
            }
          }
          appendHelpFunc(mergeFilePath);
        }
      }

      i += 2;
    }
    //если не четное количество файлов, добавь его в массив, чтобы отсортировать со следующей парой
    if (splitFiles.length % 2 !== 0) {
      arraySortedFile.push(splitFiles[splitFiles.length - 1]);
    }

    sortMergeFile(arraySortedFile, outputFilePath, sizeRam);

    return arraySortedFile;
  } catch (error) {
    console.log('Сбой!', error);
  }
};
