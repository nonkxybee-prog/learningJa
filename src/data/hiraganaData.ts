/**
 * 五十音图数据 - 包含平假名、片假名和罗马音
 */
export const hiraganaData = [
  {
    row: "あ行",
    rowRomaji: "a",
    characters: [
      { hiragana: "あ", katakana: "ア", romaji: "a" },
      { hiragana: "い", katakana: "イ", romaji: "i" },
      { hiragana: "う", katakana: "ウ", romaji: "u" },
      { hiragana: "え", katakana: "エ", romaji: "e" },
      { hiragana: "お", katakana: "オ", romaji: "o" }
    ]
  },
  {
    row: "か行",
    rowRomaji: "ka",
    characters: [
      { hiragana: "か", katakana: "カ", romaji: "ka" },
      { hiragana: "き", katakana: "キ", romaji: "ki" },
      { hiragana: "く", katakana: "ク", romaji: "ku" },
      { hiragana: "け", katakana: "ケ", romaji: "ke" },
      { hiragana: "こ", katakana: "コ", romaji: "ko" }
    ]
  },
  {
    row: "さ行",
    rowRomaji: "sa",
    characters: [
      { hiragana: "さ", katakana: "サ", romaji: "sa" },
      { hiragana: "し", katakana: "シ", romaji: "shi" },
      { hiragana: "す", katakana: "ス", romaji: "su" },
      { hiragana: "せ", katakana: "セ", romaji: "se" },
      { hiragana: "そ", katakana: "ソ", romaji: "so" }
    ]
  },
  {
    row: "た行",
    rowRomaji: "ta",
    characters: [
      { hiragana: "た", katakana: "タ", romaji: "ta" },
      { hiragana: "ち", katakana: "チ", romaji: "chi" },
      { hiragana: "つ", katakana: "ツ", romaji: "tsu" },
      { hiragana: "て", katakana: "テ", romaji: "te" },
      { hiragana: "と", katakana: "ト", romaji: "to" }
    ]
  },
  {
    row: "な行",
    rowRomaji: "na",
    characters: [
      { hiragana: "な", katakana: "ナ", romaji: "na" },
      { hiragana: "に", katakana: "ニ", romaji: "ni" },
      { hiragana: "ぬ", katakana: "ヌ", romaji: "nu" },
      { hiragana: "ね", katakana: "ネ", romaji: "ne" },
      { hiragana: "の", katakana: "ノ", romaji: "no" }
    ]
  },
  {
    row: "は行",
    rowRomaji: "ha",
    characters: [
      { hiragana: "は", katakana: "ハ", romaji: "ha" },
      { hiragana: "ひ", katakana: "ヒ", romaji: "hi" },
      { hiragana: "ふ", katakana: "フ", romaji: "fu" },
      { hiragana: "へ", katakana: "ヘ", romaji: "he" },
      { hiragana: "ほ", katakana: "ホ", romaji: "ho" }
    ]
  },
  {
    row: "ま行",
    rowRomaji: "ma",
    characters: [
      { hiragana: "ま", katakana: "マ", romaji: "ma" },
      { hiragana: "み", katakana: "ミ", romaji: "mi" },
      { hiragana: "む", katakana: "ム", romaji: "mu" },
      { hiragana: "め", katakana: "メ", romaji: "me" },
      { hiragana: "も", katakana: "モ", romaji: "mo" }
    ]
  },
  {
    row: "や行",
    rowRomaji: "ya",
    characters: [
      { hiragana: "や", katakana: "ヤ", romaji: "ya" },
      { hiragana: "ゆ", katakana: "ユ", romaji: "yu" },
      { hiragana: "よ", katakana: "ヨ", romaji: "yo" }
    ]
  },
  {
    row: "ら行",
    rowRomaji: "ra",
    characters: [
      { hiragana: "ら", katakana: "ラ", romaji: "ra" },
      { hiragana: "り", katakana: "リ", romaji: "ri" },
      { hiragana: "る", katakana: "ル", romaji: "ru" },
      { hiragana: "れ", katakana: "レ", romaji: "re" },
      { hiragana: "ろ", katakana: "ロ", romaji: "ro" }
    ]
  },
  {
    row: "わ行",
    rowRomaji: "wa",
    characters: [
      { hiragana: "わ", katakana: "ワ", romaji: "wa" },
      { hiragana: "を", katakana: "ヲ", romaji: "wo" },
      { hiragana: "ん", katakana: "ン", romaji: "n" }
    ]
  }
];

// 导出所有行选项，供用户选择
export const rowOptions = hiraganaData.map(row => ({
  value: row.rowRomaji,
  label: row.row
}));

// 导出默写类型选项
export const 默写类型选项 = [
  { value: "romaji-to-hiragana", label: "罗马音 → 平假名" },
  { value: "romaji-to-katakana", label: "罗马音 → 片假名" },
  { value: "hiragana-to-romaji", label: "平假名 → 罗马音" },
  { value: "katakana-to-romaji", label: "片假名 → 罗马音" },
  { value: "mixed", label: "全部随机混合" }
];

// 导出排版格式选项
export const formatOptions = [
  { value: "a4", label: "A4尺寸" },
  { value: "3inch", label: "3寸宽度" }
];
