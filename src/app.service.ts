import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { readNextChunk, sortMergeFile } from './helper';

@Injectable()
export class AppService {
  async sortFile() {
    const inputFilePath = 'src/string.txt';
    const outputFilePath = 'src/out_string.txt';
    const sizeRam = 400 * 1024 * 1024; // 400 МБ

    fs.truncateSync(outputFilePath);

    //Создаем папку files
    const filePath = path.resolve('files');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    //разделение фалов и сортировка начальных файлов
    const splitFiles = await readNextChunk(inputFilePath, sizeRam);

    //запускаем рекурсивную функцию сортировки
    await sortMergeFile(splitFiles, outputFilePath, sizeRam);

    console.log('Файл отсортирован.');
    return 'Ok';
  }

  async createFile() {
    try {
      const filePath = 'src/string.txt';

      console.time();

      fs.truncateSync(filePath);

      const stringSize = Buffer.byteLength(randomUUID());
      let fileSizeMB = 1_000 * 1024 * 1024; //1000Мб

      let arrayString = [];

      //Создание файла со строками uuid
      while (stringSize < fileSizeMB) {
        arrayString.push(randomUUID());
        if (fileSizeMB % 5_000_000 === 0) {
          console.log('Размер на данный момент:', fs.statSync(filePath).size);
          fs.appendFileSync(filePath, arrayString.join(`\n`));
          arrayString = [];
        }
        fileSizeMB = fileSizeMB - stringSize;
      }
      fs.appendFileSync(filePath, arrayString.join(`\n`));
      console.timeEnd();

      console.log('Файл создан.');
      return 'Ok';
    } catch (error) {
      console.error('Произошла ошибка при создании файла:', error);
    }
  }
}
