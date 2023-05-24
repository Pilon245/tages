import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { deleteFiles, mergeSortedFiles, sortChunk, splitFile } from './helper';
import * as path from 'path';

@Injectable()
export class AppService {
  async sortFile() {
    const inputFilePath = 'src/string.txt';
    const outputFilePath = 'src/out_string.txt';
    const chunkSize = 2856355; // Столько строк занимают 100мб

    //Создаем папку files, если она не создана
    const filePath = path.resolve('files');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const sortFileByChunks = async () => {
      // Разделение исходного файла на части
      const splitFiles = await splitFile(inputFilePath, chunkSize);

      // Сортировка каждой части отдельно
      const sortedFiles = [];
      for (const splitFile of splitFiles) {
        const sortedFile = await sortChunk(splitFile);
        sortedFiles.push(sortedFile);
      }

      // Объединение отсортированных частей в итоговый файл
      await mergeSortedFiles(sortedFiles, outputFilePath);

      // Удаление временных файлов
      await deleteFiles([...splitFiles, ...sortedFiles]);

      console.log('Файл успешно отсортирован.');
      return;
    };

    sortFileByChunks().catch((error) => {
      console.error('Произошла ошибка при сортировке файла:', error);
    });
  }

  createFile() {
    const filePath = 'src/string.txt';

    const writeStream = fs.createWriteStream(filePath);

    for (let i = 0; i < 26315790; i++) {
      //Создание файла со строками 1гб
      writeStream.write(randomUUID() + '\r\n');
    }

    writeStream.end();

    writeStream.on('finish', () => {
      console.log('Файл создан.');
    });

    writeStream.on('error', (err) => {
      console.error('Произошла ошибка при создании файла:', err);
    });
  }
}
