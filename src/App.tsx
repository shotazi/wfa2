import React, { useState } from 'react';
import { TextEditor } from './components/TextEditor';
import { Sidebar } from './components/Sidebar';
import { WordModal } from './components/WordModal';
import { analyzeText } from './utils/textAnalysis';
import { WordGroup, WordData } from './types';

export default function App() {
  const [text, setText] = useState('');
  const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
  const [wordData, setWordData] = useState<Map<string, WordData>>(new Map());
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    const { wordGroups: newGroups, wordData: newData } = analyzeText(newText);
    setWordGroups(newGroups);
    setWordData(newData);
  };

  const handleGroupToggle = (groupId: string) => {
    setWordGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? { ...group, isSelected: !group.isSelected }
          : group
      )
    );
  };

  const handleCreateFlashcards = (groupId: string) => {
    const group = wordGroups.find(g => g.id === groupId);
    if (!group) return;
    
    // In a real app, this would integrate with a flashcard service
    console.log('Creating flashcards for words:', Array.from(group.words));
  };

  const selectedGroups = new Set(
    wordGroups.filter(group => group.isSelected).map(group => group.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Text Analysis Tool</h1>
          <p className="text-gray-600">Analyze vocabulary and create flashcards</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TextEditor
              text={text}
              onTextChange={handleTextChange}
              wordData={wordData}
              selectedGroups={selectedGroups}
              onWordClick={setSelectedWord}
            />
          </div>
          <div className="lg:col-span-1">
            <Sidebar
              wordGroups={wordGroups}
              onGroupToggle={handleGroupToggle}
              onCreateFlashcards={handleCreateFlashcards}
              onWordClick={setSelectedWord}
              text={text}
            />
          </div>
        </div>
      </div>

      {selectedWord && wordData.get(selectedWord) && (
        <WordModal
          word={selectedWord}
          data={wordData.get(selectedWord)!}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}