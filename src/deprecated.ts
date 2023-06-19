// //todo С помощью Windows sort в командной строке
// async sortFileWindows() {
//   await new Promise((resolve, reject) => {
//     exec(
//       'sort C:\\Zolder\\WebstormProject\\nest\\tages\\src\\string.txt',
//       (error, stdout, stderr) => {
//         fs.writeFileSync('./src/out_string.txt', stdout);
//         resolve(true);
//       },
//     );
//   });
// }
// //todo сортировка пузырьком
// async sortFileBubble() {
//   const inputFilePath = 'src/string.txt';
//   const outputFilePath = 'src/out_string.txt';
//
//   fs.truncateSync(outputFilePath);
//
//   const readStreamAll = fs.createReadStream(inputFilePath);
//   const rlAll = readline.createInterface({ input: readStreamAll });
//
//   let lastLine = '';
//   let minLine = 'z';
//
//   for await (const iterator of rlAll) {
//     const readStream = fs.createReadStream(inputFilePath);
//     const rl = readline.createInterface({ input: readStream });
//     for await (const line of rl) {
//       if (lastLine < line && line < minLine) {
//         minLine = line;
//       }
//     }
//     lastLine = await minLine;
//
//     fs.appendFileSync(outputFilePath, lastLine + `\n`);
//
//     minLine = 'z';
//   }
//   console.log('Файл отсортирован.');
// }
// //todo чистая сортировка слиянием
// export const sortRawMergeFile = (
//   splitFiles: string[],
//   outputFilePath: string,
// ) => {
//   try {
//     //проверка условия остановки рекурсии, переименование отсортированного файла и удаление временных файлов
//     if (splitFiles.length === 1) {
//       fs.renameSync(splitFiles[0], outputFilePath);
//       fs.rmSync(path.resolve('files'), { recursive: true });
//       return true;
//     }
//
//     //массив с названиями отсортированных
//     const arraySortedFile = [];
//
//     for (let i = 0; i < splitFiles.length - 1; ) {
//       const mergeFilePath = path.join(splitFiles[i] + i);
//       arraySortedFile.push(mergeFilePath);
//
//       fs.writeFileSync(mergeFilePath, '');
//
//       const liner = new lineByLine(path.join(splitFiles[i]));
//       const liner2 = new lineByLine(path.join(splitFiles[i + 1]));
//
//       let str1 = liner.next().toString('ascii');
//       let str2 = liner2.next().toString('ascii');
//
//       while (str1 !== 'false' && str2 !== 'false') {
//         if (str1 > str2) {
//           fs.appendFileSync(mergeFilePath, str2 + `\n`);
//           str2 = liner2.next().toString('ascii');
//         } else if (str1 < str2) {
//           fs.appendFileSync(mergeFilePath, str1 + `\n`);
//           str1 = liner.next().toString('ascii');
//         } else {
//           fs.appendFileSync(mergeFilePath, str1 + `\n`);
//           fs.appendFileSync(mergeFilePath, str2 + `\n`);
//
//           str1 = liner.next().toString('ascii');
//           str2 = liner2.next().toString('ascii');
//         }
//
//         //если один файл закончился, все остальные строки с другого файла добавляем в конец
//         if (str1 === 'false') {
//           while (str2 !== 'false') {
//             fs.appendFileSync(mergeFilePath, str2 + `\n`);
//             str2 = liner2.next().toString('ascii');
//           }
//         } else if (str2 === 'false') {
//           while (str1 !== 'false') {
//             fs.appendFileSync(mergeFilePath, str1 + `\n`);
//             str1 = liner.next().toString('ascii');
//           }
//         }
//       }
//       i += 2;
//     }
//     //если не четное количество файлов, добавь его в массив, чтобы отсортировать со следующей парой
//     if (splitFiles.length % 2 !== 0) {
//       arraySortedFile.push(splitFiles[splitFiles.length - 1]);
//     }
//
//     sortRawMergeFile(arraySortedFile, outputFilePath);
//
//     return arraySortedFile;
//   } catch (error) {
//     console.log('Сбой! Возможно не отсортированный файл пустой.');
//   }
// };
