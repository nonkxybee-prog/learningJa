/**
 * 五十音图字符接口
 */
export interface JapaneseCharacter {
  hiragana: string;
  katakana: string;
  romaji: string;
}

/**
 * 五十音图行接口
 */
export interface HiraganaRow {
  row: string;
  rowRomaji: string;
  characters: JapaneseCharacter[];
}

/**
 * 默写题目接口
 */
export interface PracticeItem {
  question: string;
  answer: string;
  type: string;
}

/**
 * 单词接口
 */
export interface WordItem {
  japanese: string;
  chinese: string;
  reading?: string;
}
