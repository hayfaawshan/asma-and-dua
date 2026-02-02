export type DivineNameResult = {
    arabic: string;
    transliteration: string;
    meaning: string;
    reason: string;
  };
  
  export type MatchNamesRequest = {
    dua: string;
    exclude?: string[]
    };
  
  export type MatchNamesResponse = DivineNameResult[];
  