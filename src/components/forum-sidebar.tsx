'use client';

import { useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  initials: string;
}

interface ForumSidebarProps {
  categories: ForumCategory[];
  selectedCategoryId: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCategorySelect: (id: number) => void;
}

const Avatar = ({ fallback, className = '' }: { fallback: string; className?: string }) => (
  <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium text-black ${className}`}>
    {fallback}
  </div>
);

export default function ForumSidebar({
  categories,
  selectedCategoryId,
  searchTerm,
  setSearchTerm,
  onCategorySelect,
}: ForumSidebarProps) {
  const generalForum = useMemo(() => categories.filter(c => c.id <= 4), [categories]);
  const chatrooms = useMemo(() => categories.filter(c => c.id > 4), [categories]);

  const filteredGeneral = useMemo(() =>
    generalForum.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [generalForum, searchTerm]
  );

  const filteredChatrooms = useMemo(() =>
    chatrooms.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [chatrooms, searchTerm]
  );

  return (
    <div className="w-full md:w-[300px] border-r bg-card flex flex-col shadow-lg h-full">
      <div className="p-4 border-b">
        <div className="relative flex items-center gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chatrooms"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-xl flex-1"
          />
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase px-3 py-2">General Forum</h3>
        {filteredGeneral.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
              selectedCategoryId === cat.id ? 'bg-gray-500 text-white shadow-md' : 'hover:bg-gray-100'
            }`}
          >
            <Avatar fallback={cat.initials} className={selectedCategoryId === cat.id ? 'bg-white/90' : 'bg-gray-200'} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{cat.name}</div>
              <div className={`text-xs ${selectedCategoryId === cat.id ? 'text-gray-200' : 'text-muted-foreground'} truncate`}>
                {cat.description}
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              selectedCategoryId === cat.id ? 'bg-white/20 text-white' : 'bg-muted/50 text-muted-foreground'
            }`}>
              {cat.memberCount}
            </span>
          </button>
        ))}

        <h3 className="text-xs font-bold text-muted-foreground uppercase px-3 pt-4 pb-2">Chatrooms</h3>
        {filteredChatrooms.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
              selectedCategoryId === cat.id ? 'bg-gray-500 text-white shadow-md' : 'hover:bg-gray-100'
            }`}
          >
            <Avatar fallback={cat.initials} className={selectedCategoryId === cat.id ? 'bg-white/90' : 'bg-gray-200'} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{cat.name}</div>
              <div className={`text-xs ${selectedCategoryId === cat.id ? 'text-gray-200' : 'text-muted-foreground'} truncate`}>
                2 days ago
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              selectedCategoryId === cat.id ? 'bg-white/20 text-white' : 'bg-muted/50 text-muted-foreground'
            }`}>
              {cat.memberCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}