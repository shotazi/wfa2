import React from 'react';
import { WordData } from '../types';
import { cn } from '../utils/cn';
import { frequencyColor, frequencyGroups } from '../utils/textAnalysis';

interface TextEditorProps {
  text: string;
  onTextChange: (text: string) => void;
  wordData: Map<string, WordData>;
  selectedGroups: Set<string>;
  onWordClick: (word: string) => void;
}

export function TextEditor({
  text,
  onTextChange,
  wordData,
  selectedGroups,
  onWordClick,
}: TextEditorProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  const renderHighlightedText = () => {
    if (!text) return null;

    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      const data = wordData.get(cleanWord);

      console.log('data from words map', data);
      if (data && selectedGroups.has(data.groupId)) {
        return (
          <span
            key={index}
            className={cn(
              'cursor-pointer transition-colors duration-200',
              'hover:ring-2 hover:ring-blue-300 rounded'
            )}
            id={word + '-' + data.groupId + '-'}
            style={{ backgroundColor: `${frequencyColor[data.groupId]}` }}
            onClick={() => onWordClick(cleanWord)}
          >
            {word}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <textarea
        className="w-full h-64 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        value={text}
        onChange={handleTextChange}
        placeholder="Paste your text here..."
      />
      <div className="flex-1 p-4 bg-white rounded-lg shadow-sm overflow-y-auto">
        <div className="prose prose-sm max-w-none">
          {renderHighlightedText()}
        </div>
      </div>
    </div>
  );
}
