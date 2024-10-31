import React, { useEffect, useState } from 'react';
import { WordGroup } from '../types';
import { BookOpen, Brain, Loader2, Trash2 } from 'lucide-react';
import { getDeckHistory, createDeck, generateDefinition, saveFlashcard, deleteDeck } from '../utils/supabaseClient';
import { FlashcardViewer } from './FlashcardViewer';
import { CreateDeckModal } from './CreateDeckModal';
import { findExamplesInText } from '../utils/textAnalysis';

interface SidebarProps {
  wordGroups: WordGroup[];
  onGroupToggle: (groupId: string) => void;
  onCreateFlashcards: (groupId: string) => void;
  onWordClick: (word: string) => void;
  text: string; // Add text prop to access the original text
}

interface Deck {
  id: string;
  name: string;
  created_at: string;
}

export function Sidebar({ wordGroups, onGroupToggle, onCreateFlashcards, onWordClick, text }: SidebarProps) {
  const [activeTab, setActiveTab] = React.useState<'groups' | 'flashcards'>('groups');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    const deckHistory = await getDeckHistory();
    setDecks(deckHistory);
  };

  const handleCreateFlashcards = async (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowCreateModal(true);
  };

  const handleCreateDeck = async (deckName: string) => {
    const group = wordGroups.find(g => g.id === selectedGroupId);
    if (!group) return;

    setShowCreateModal(false);
    setIsCreatingDeck(true);
    setActiveTab('flashcards');

    const deckId = await createDeck(deckName);
    if (!deckId) {
      setIsCreatingDeck(false);
      return;
    }

    // Generate flashcards for each word in the group
    for (const word of group.words) {
      const examples = findExamplesInText(word, text);
      const definition = await generateDefinition(word, examples[0] || '', examples);
      await saveFlashcard(deckId, word, definition, examples);
    }

    await loadDecks();
    setIsCreatingDeck(false);
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(deckId);
    await deleteDeck(deckId);
    await loadDecks();
    setIsDeleting(null);

    if (selectedDeck === deckId) {
      setSelectedDeck(null);
    }
  };

  return (
    <div className="sticky top-4 h-[calc(100vh-8rem)] overflow-y-scroll flex flex-col bg-white rounded-lg shadow-sm">
      <div className="flex border-b">
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === 'groups' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('groups')}
        >
          <BookOpen className="w-4 h-4" />
          Word Groups
        </button>
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === 'flashcards' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('flashcards')}
        >
          <Brain className="w-4 h-4" />
          Flashcards
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activeTab === 'groups' ? (
          <div className="space-y-4">
            {wordGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 rounded-lg border transition-colors duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{group.name}</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={group.isSelected}
                      onChange={() => onGroupToggle(group.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {/* <div className="flex flex-wrap gap-2">
                  {Array.from(group.words).slice(0, 5).map((word) => (
                    <button
                      key={word}
                      onClick={() => onWordClick(word)}
                      className="px-2 py-1 text-sm rounded hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                      style={{ backgroundColor: `${group.color}20` }}
                    >
                      {word}
                    </button>
                  ))}
                  {group.words.size > 5 && (
                    <span className="px-2 py-1 text-sm text-gray-500">
                      +{group.words.size - 5} more
                    </span>
                  )}
                </div> */}
                <div className="flex flex-wrap gap-2">
                  {Array.from(group.words).map((word) => (
                    <button
                      key={word}
                      onClick={() => onWordClick(word)}
                      className="px-2 py-1 text-sm rounded hover:ring-2 hover:ring-blue-300 transition-all duration-200"
                      style={{ backgroundColor: `${group.color}` }}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleCreateFlashcards(group.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Create Flashcards
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isCreatingDeck && (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Creating flashcard deck...
              </div>
            )}
            {!isCreatingDeck && decks.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                No flashcard decks yet. Create one from a word group!
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {decks.map((deck) => (
                    <div
                      key={deck.id}
                      className="p-4 rounded-lg border hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setSelectedDeck(deck.id)}
                          className="flex-1 text-left"
                        >
                          <h3 className="font-medium">{deck.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(deck.created_at).toLocaleDateString()}
                          </p>
                        </button>
                        <button
                          onClick={() => handleDeleteDeck(deck.id)}
                          className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
                          disabled={isDeleting === deck.id}
                        >
                          {isDeleting === deck.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedDeck && (
                  <FlashcardViewer
                    deckId={selectedDeck}
                    onClose={() => setSelectedDeck(null)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateDeckModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDeck}
        />
      )}
    </div>
  );
}