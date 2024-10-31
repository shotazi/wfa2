export const frequencyGroups = [
  { id: 'top1000', name: 'Top 1000', color: '#22c55e' },
  { id: 'top2000', name: 'Top 2000', color: '#4ade80' },
  { id: 'top3000', name: 'Top 3000', color: '#86efac' },
  { id: 'top4000', name: 'Top 4000', color: '#86efac' },
  { id: 'top5000', name: 'Top 5000', color: '#86efac' },
  { id: 'top6000', name: 'Top 6000', color: '#86efac' },
  { id: 'top7000', name: 'Top 7000', color: '#86efac' },
  { id: 'top8000', name: 'Top 8000', color: '#86efac' },
  { id: 'top9000', name: 'Top 9000', color: '#86efac' },
  { id: 'top10000', name: 'Top 10000', color: '#86efac' },
  { id: 'rest', name: 'rest', color: '#bbf7d0' },
];

export const frequencyColor = {
  top1000: '#22c55e',
  top2000: '#4ade80',
  top3000: '#86efac',
  rest: '#bbf7d0',
};

// Mock word frequency data - in a real app, this would come from a proper word frequency database
const mockWordFrequency = new Map([
  ['the', 'top1000'],
  ['be', 'top1000'],
  ['to', 'top1000'],
  ['of', 'top1000'],
  ['also', 'top1000'],
  ['two', 'top1000'],
  ['comprehension', 'top2000'],
  ['involved', 'top2000'],
  ['analysis', 'top2000'],
  ['data', 'top2000'],
  ['system', 'top2000'],
  ['research', 'top3000'],
  ['test', 'top3000'],
  ['example', 'top3000'],
  ['methodology', 'rest'],
]);

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

  const wordGroups = frequencyGroups.map((group) => ({
    ...group,
    words: new Set<string>(),
    isSelected: true,
  }));

  const wordData = new Map();

  uniqueWords.forEach((word) => {
    const groupId = mockWordFrequency.get(word) || 'academic';
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