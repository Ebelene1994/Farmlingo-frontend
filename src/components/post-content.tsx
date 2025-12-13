'use client';

import { Heart, MessageCircleDashed, Share2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  avatar: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

interface Reply {
  id: number;
  user: User;
  text: string;
  image?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: number;
  user: User;
  text: string;
  image?: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
  categoryId: number;
}

interface ForumPostProps {
  post: Post;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
}

const Avatar = ({ fallback }: { fallback: string }) => (
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-black font-medium">
    {fallback}
  </div>
);

export default function ForumPost({ post, onLike, onReply }: ForumPostProps) {
  return (
    <div className="p-4 bg-card border rounded-md shadow-sm transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <Avatar fallback={post.user.name.slice(0, 2).toUpperCase()} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{post.user.name}</span>
            <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-gray-700 mt-1">
            {post.user.role}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {post.text && <p className="text-sm text-foreground mb-3">{post.text}</p>}
      {post.image && (
        <img src={post.image} alt="Post" className="rounded-lg w-full max-h-80 object-cover mb-3 border" />
      )}

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 px-2 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-foreground'}`}
          onClick={() => onLike(post.id)}
        >
          <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500' : ''}`} />
          <span className="font-medium">{post.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 border-gray-300 hover:bg-gray-100"
          onClick={() => onReply(post.id)}
        >
          <MessageCircleDashed className="h-3 w-3" />
          Reply
        </Button>

        <span className="text-xs font-medium ml-2">{post.replies.length} replies</span>
        <Button variant="ghost" size="sm" className="gap-1 px-2 ml-auto hover:text-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}