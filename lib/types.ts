export type DivineNameResult = {
    arabic: string;
    transliteration: string;
    meaning: string;
    reason: string;
  };
  
  export type MatchNamesRequest = {
    dua: string;
  };
  
  export type MatchNamesResponse = DivineNameResult[];
  