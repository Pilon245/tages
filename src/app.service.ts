import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as process from 'process';

import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import * as readline from 'readline';

const Mem = () => {
  return formatBytes(process.memoryUsage().heapUsed);
};

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

@Injectable()
export class AppService {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async sortFile() {
    const inputFilePath = 'src/string.txt';
    const outputFilePath = 'src/out_string.txt';

    fs.truncateSync(outputFilePath);

    const readStreamAll = fs.createReadStream(inputFilePath);
    const rlAll = readline.createInterface({ input: readStreamAll });

    let lastLine = '';
    let minLine = 'z';

    for await (const iterator of rlAll) {
      const readStream = fs.createReadStream(inputFilePath);
      const rl = readline.createInterface({ input: readStream });
      for await (const line of rl) {
        if (lastLine < line && line < minLine) {
          minLine = line;
        }
      }
      lastLine = await minLine;

      fs.appendFileSync(outputFilePath, lastLine + `\n`);

      minLine = 'z';
    }
    console.log('Файл отсортирован.');
  }

  //todo сортировка пузырьком

  async sortFileBubble() {
    const inputFilePath = 'src/string.txt';
    const outputFilePath = 'src/out_string.txt';

    fs.truncateSync(outputFilePath);

    const readStreamAll = fs.createReadStream(inputFilePath);
    const rlAll = readline.createInterface({ input: readStreamAll });

    let lastLine = '';
    let minLine = 'z';

    for await (const iterator of rlAll) {
      const readStream = fs.createReadStream(inputFilePath);
      const rl = readline.createInterface({ input: readStream });
      for await (const line of rl) {
        if (lastLine < line && line < minLine) {
          minLine = line;
        }
      }
      lastLine = await minLine;

      fs.appendFileSync(outputFilePath, lastLine + `\n`);

      minLine = 'z';
    }
    console.log('Файл отсортирован.');
  }
  //todo С помощью Windows sort

  async sortFileWindows() {
    const inputFilePath = 'src/string.txt';
    const outputFilePath = 'src/out_string.txt';

    await new Promise((resolve, reject) => {
      console.log('prev', Mem());

      exec(
        'sort C:\\Zolder\\WebstormProject\\nest\\tages\\src\\string.txt',
        (error, stdout, stderr) => {
          // const arr = new Array(1e7)
          console.log('prev write', Mem());
          fs.writeFileSync('./src/out_string.txt', stdout);
          console.log('next', Mem());
          resolve(true);
        },
      );
    });
  }

  async createFile() {
    const filePath = 'src/string.txt';

    const writeStream = fs.createWriteStream(filePath);
    console.time();

    // for (let i = 0; i < 26315790; i++) {
    for (let i = 0; i < 1_000; i++) {
      //Создание файла со строками 1гб
      // await this.dataSource.query(
      //   `INSERT INTO public.files(string)
      //     VALUES ( '${randomUUID()}')`,
      // );
      writeStream.write(randomUUID() + '\r\n');
    }
    console.timeEnd();

    writeStream.end();

    writeStream.on('finish', () => {
      console.log('Файл создан.');
    });

    writeStream.on('error', (err) => {
      console.error('Произошла ошибка при создании файла:', err);
    });
  }
}
