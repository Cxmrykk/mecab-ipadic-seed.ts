import { readFileSync, readdirSync } from 'fs';
import { createInterface } from 'readline';

class DictionaryReader {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  read(callback: (line: string) => void): Promise<void> {
    return new Promise<void>((resolve) => {
      const fileContents = readFileSync(`./dict/${this.filename}`, 'utf8');
      const rl = createInterface({
        input: fileContents.split('\n')[Symbol.iterator]() as any, // Use type assertion here
        crlfDelay: Infinity, // Important for handling Windows line endings correctly
      });

      rl.on('line', (line: string) => {
        callback(line);
      });
      rl.on('close', () => {
        resolve();
      });
    });
  }
}

class SequentialDictionariesReader {
  readers: DictionaryReader[];

  constructor(readers: DictionaryReader[]) {
    this.readers = readers;
  }

  read(callback: (line: string) => void): Promise<void> {
    const promises: Promise<void>[] = this.readers.map((reader) => {
      return reader.read(callback);
    });

    // Chain the promises sequentially
    for (let i = 0; i < promises.length - 1; i++) {
      promises[i].then(() => promises[i + 1]);
    }

    return promises[promises.length - 1];
  }
}

export default class IPADic {
  costMatrixDefinition: DictionaryReader;
  characterDefinition: DictionaryReader;
  unknownWordDefinition: DictionaryReader;
  tokenInfoDictionaries: SequentialDictionariesReader;

  constructor() {
    this.costMatrixDefinition = new DictionaryReader('matrix.def');
    this.characterDefinition = new DictionaryReader('char.def');
    this.unknownWordDefinition = new DictionaryReader('unk.def');

    const readers: DictionaryReader[] = readdirSync('./dict').filter((filename: string) => {
      return /\.csv$/.test(filename);
    }).map((filename: string) => {
      return new DictionaryReader(filename);
    });

    this.tokenInfoDictionaries = new SequentialDictionariesReader(readers);
  }

  readMatrixDef(callback: (line: string) => void): Promise<void> {
    return this.costMatrixDefinition.read(callback);
  }

  readCharDef(callback: (line: string) => void): Promise<void> {
    return this.characterDefinition.read(callback);
  }

  readUnkDef(callback: (line: string) => void): Promise<void> {
    return this.unknownWordDefinition.read(callback);
  }

  readTokenInfo(callback: (line: string) => void): Promise<void> {
    return this.tokenInfoDictionaries.read(callback);
  }
}