import { WordFrequencyEn } from "../data/en";

export const frequencyGroups = [
  { id: 't1', name: 'Top 1000', color: '#22c55e' },
  { id: 't2', name: 'Top 2000', color: '#4ade80' },
  { id: 't3', name: 'Top 3000', color: '#86efac' },
  { id: 't4', name: 'Top 4000', color: '#86efac' },
  { id: 't5', name: 'Top 5000', color: '#86efac' },
  { id: 't6', name: 'Top 6000', color: '#86efac' },
  { id: 't7', name: 'Top 7000', color: '#86efac' },
  { id: 't8', name: 'Top 8000', color: '#86efac' },
  { id: 't9', name: 'Top 9000', color: '#86efac' },
  { id: 't10', name: 'Top 10000', color: '#86efac' },
  { id: 't11', name: 'Top 11000', color: '#22c55e' },
  { id: 't12', name: 'Top 12000', color: '#4ade80' },
  { id: 't13', name: 'Top 13000', color: '#86efac' },
  { id: 't14', name: 'Top 14000', color: '#86efac' },
  { id: 't15', name: 'Top 15000', color: '#86efac' },
  { id: 't16', name: 'Top 16000', color: '#86efac' },
  { id: 't17', name: 'Top 17000', color: '#86efac' },
  { id: 't18', name: 'Top 18000', color: '#86efac' },
  { id: 't19', name: 'Top 19000', color: '#86efac' },
  { id: 't20', name: 'Top 20000', color: '#86efac' },
  { id: 't', name: 'rest', color: '#bbf7d0' },
];

export const frequencyColor = {
  t1: '#22c55e',
  t2: '#4ade80',
  t3: '#86efac',
  rest: '#bbf7d0',
};

// Mock word frequency data - in a real app, this would come from a proper word frequency database
// const mockWordFrequency = new Map([
//   ['the', 't1'],
//   ['be', 't1'],
//   ['to', 't1'],
//   ['of', 't1'],
//   ['also', 't1'],
//   ['two', 't1'],
//   ['comprehension', 't2'],
//   ['involved', 't2'],
//   ['analysis', 't2'],
//   ['data', 't2'],
//   ['system', 't2'],
//   ['research', 't3'],
//   ['test', 't3'],
//   ['example', 't3'],
//   ['methodology', 'rest'],
// ]);



export function findExamplesInText(word: string, text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const examples = sentences
    .filter(sentence => 
      new RegExp(`\\b${word}\\b`, 'i').test(sentence)
    )
    .map(sentence => sentence.trim());
  
  return examples;
}

export function analyzeText(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const uniqueWords = new Set(words);

  console.log('text from analyze text', text)

  const wordGroups = frequencyGroups.map((group) => ({
    ...group,
    words: new Set<string>(),
    isSelected: true,
  }));

  const wordData = new Map();

  uniqueWords.forEach((word) => {
    const groupId = WordFrequencyEn.get(word) || 'academic';
    const group = wordGroups.find((g) => g.id === groupId);
    if (group) {
      group.words.add(word);
      const examples = findExamplesInText(word, text);
      wordData.set(word, {
        word,
        groupId,
        examples,
      });
    }
  });

  return {
    wordGroups,
    wordData,
  };
}