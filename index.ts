import { readFileSync, readdirSync } from 'fs';

class DictionaryReader {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  async read(callback: (line: string) => void): Promise<void> {
    const fileContents = readFileSync(`${import.meta.dir}/dict/${this.filename}`, 'utf8');
    const lines = fileContents.split('\n');
    
    for (const line of lines) {
      if (line.trim()) { // Skip empty lines
        callback(line);
      }
    }
  }
}

class SequentialDictionariesReader {
  readers: DictionaryReader[];

  constructor(readers: DictionaryReader[]) {
    this.readers = readers;
  }

  async read(callback: (line: string) => void): Promise<void> {
    for (const reader of this.readers) {
      await reader.read(callback);
    }
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

    const readers: DictionaryReader[] = readdirSync(`${import.meta.dir}/dict`).filter((filename: string) => {
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