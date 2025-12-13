import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, MoreVertical, Paperclip, Send } from 'lucide-react';
import { Header } from '@/components/header';

interface Chatroom {
  id: number;
  name: string;
  description: string;
  members: number;
  category: 'GENERAL FORUM' | 'CHATROOMS';
}

export default function Chatrooms() {
  const [search, setSearch] = useState('');
  const [activeRoom, setActiveRoom] = useState<number>(1);

  const chatrooms: Chatroom[] = [
    {
      id: 1,
      name: 'Open forum',
      description: 'Have open discussion with other students',
      members: 200,
      category: 'GENERAL FORUM',
    },
    {
      id: 2,
      name: 'Announcement',
      description: 'Get to know latest news at Farmlingo',
      members: 200,
      category: 'GENERAL FORUM',
    },
    {
      id: 3,
      name: 'Group name',
      description: 'General group discussion',
      members: 200,
      category: 'CHATROOMS',
    },
    {
      id: 4,
      name: 'Group name',
      description: 'Farming updates',
      members: 200,
      category: 'CHATROOMS',
    },
    {
      id: 5,
      name: 'Group name',
      description: 'Sustainability',
      members: 200,
      category: 'CHATROOMS',
    },
    {
      id: 6,
      name: 'Group name',
      description: 'Agriculture insights',
      members: 200,
      category: 'CHATROOMS',
    },
  ];

  interface Post {
    id: number;
    author: string;
    role: string;
    time: string;
    message: string;
    image?: string;
    replies: number;
  }

  const posts: Post[] = [
    {
      id: 1,
      author: 'Cyrus Owusu',
      role: 'STUDENT',
      time: '2 days ago',
      message:
        'Hi, let’s have a meeting tomorrow to discuss the project. I’ve been reviewing the project details and have some ideas I’d like to share. It’s crucial that we align on our next steps to ensure the project’s success.',
      image: 'https://images.unsplash.com/photo-1500979726055-c1f1c2f2f6f1',
      replies: 20,
    },
    {
      id: 2,
      author: 'Earl Prempeh',
      role: 'STUDENT',
      time: '1 day ago',
      message:
        'Hi, let’s have a meeting tomorrow to discuss the project. I’ve been reviewing the project details and have some ideas I’d like to share. It’s crucial that we align on our next steps to ensure the project’s success.',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
      replies: 20,
    },
  ];

  const filteredChatrooms = chatrooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='flex h-screen bg-muted/20'>
      <aside className='w-80 border-r bg-white flex flex-col'>
        {/* Search Header */}
        <div className='p-3 border-b flex items-center gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='search chatrooms'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-9 rounded-full text-sm'
            />
          </div>
          <Button size='icon' className='rounded-full' variant='secondary'>
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        {/* Chatroom List */}
        <div className='px-2 py-4'>
          {['GENERAL FORUM', 'CHATROOMS'].map((category) => (
            <div key={category} className='mb-4'>
              <p className='text-[11px] font-semibold text-muted-foreground px-3 mb-2'>
                {category}
              </p>

              <div className='space-y-2'>
                {filteredChatrooms
                  .filter((room) => room.category === category)
                  .map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoom(room.id)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left transition 
                      ${
                        activeRoom === room.id
                          ? 'border border-green-300 bg-green-50'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback>GN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-medium leading-tight'>
                            {room.name}
                          </p>
                          <p className='text-xs text-muted-foreground truncate w-40'>
                            {room.description}
                          </p>
                          <p className='text-[11px] text-muted-foreground'>
                            {room.members} members
                          </p>
                        </div>
                      </div>

                      <div className='flex-shrink-0'>
                        <span className='text-[11px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium'>
                          22
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className='flex-1 flex flex-col'>
        {/* Header */}
        <Header />

        {/* Posts */}
        <ScrollArea className='flex-1 p-6 space-y-8'>
          {posts.map((post) => (
            <Card key={post.id} className='border rounded-2xl shadow-sm'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center space-x-3'>
                  <Avatar>
                    <AvatarFallback>
                      {post.author.split(' ')[0][0]}
                      {post.author.split(' ')[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-sm font-medium'>
                      {post.author}
                    </CardTitle>
                    <p className='text-xs text-muted-foreground flex items-center gap-1'>
                      <span className='bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-semibold'>
                        {post.role}
                      </span>
                      {post.time}
                    </p>
                  </div>
                </div>
                <MoreVertical className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <p className='text-sm mb-3'>{post.message}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt=''
                    className='rounded-lg mb-3 w-full object-cover max-h-64'
                  />
                )}
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <button className='hover:text-primary'>👍 Like</button>
                  <button className='hover:text-primary'>💬 Reply</button>
                  <span>{post.replies} replies</span>
                  <button className='hover:text-primary ml-auto'>
                    🔗 Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>

        {/* Message Input */}
        <div className='border-t bg-white px-4 py-3'>
          {/* Message Textarea */}
          <Textarea
            placeholder='Type your message here'
            className='w-full min-h-[80px] resize-none rounded-md bg-muted/10 px-3 py-2 text-sm'
          />

          {/* Buttons row: attach left, send right */}
          <div className='flex items-center justify-between mt-2'>
            <button
              type='button'
              className='flex items-center text-sm text-muted-foreground hover:text-primary transition'
            >
              <Paperclip className='h-5 w-5 mr-1' />
              <span className='hidden sm:inline'>Attach file</span>
            </button>

            <Button
              size='sm'
              className='rounded-full bg-black hover:bg-gray-800 text-white px-4'
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
