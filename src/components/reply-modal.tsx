'use client';

import { useState, useRef } from 'react';
import { X, SendHorizontal, CloudUpload, MoreVertical, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface ReplyModalProps {
  post: Post;
  onClose: () => void;
  onSubmit: (text: string, file?: File) => void;
}

const Avatar = ({ fallback }: { fallback: string }) => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-black text-xs font-medium">
    {fallback}
  </div>
);

const ReplyItem = ({ reply }: { reply: Reply }) => (
  <div className="p-3 rounded-xl border bg-secondary/10 shadow-sm">
    <div className="flex items-start gap-3">
      <Avatar fallback={reply.user.name.charAt(0)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{reply.user.name}</span>
          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-gray-700">
            {reply.user.role}
          </span>
        </div>
        <p className="mt-1 text-sm">{reply.text}</p>
        {reply.image && <img src={reply.image} alt="Reply" className="mt-2 rounded-lg w-full max-h-40 object-cover" />}
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground ml-auto h-6 w-6">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default function ReplyModal({ post, onClose, onSubmit }: ReplyModalProps) {
  const [replyText, setReplyText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!replyText.trim() && !selectedFile) return;
    onSubmit(replyText, selectedFile ?? undefined);
    setReplyText('');
    handleRemoveFile();
    onClose();
  };

  const isDisabled = !replyText.trim() && !selectedFile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Reply to post</h3>
            <p className="text-sm text-muted-foreground mt-1">Add a message or file</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* File + Caption Input */}
          {selectedFile ? (
            <div className="flex items-start gap-2 p-2 bg-muted rounded-md mb-4">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
              ) : (
                <FileText className="w-8 h-8 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <Input
                  placeholder="Add a caption..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 rounded-full h-12 pr-4"
              />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-muted-foreground hover:bg-gray-200/60"
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudUpload className="h-5 w-5" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf,.doc,.docx"
              />
              <Button onClick={handleSubmit} disabled={isDisabled} className="gap-1 px-4 py-2">
                Reply <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Submit button when file is selected */}
          {selectedFile && (
            <Button onClick={handleSubmit} disabled={isDisabled} className="w-full">
              Send Reply
            </Button>
          )}
        </div>

        {/* Replies Preview */}
        <div className="p-6 pt-0 flex-1 min-h-0 flex flex-col">
          <h4 className="text-sm font-bold text-muted-foreground mb-3 text-center tracking-wider">REPLIES</h4>
          <div className="space-y-4 overflow-y-auto pr-3 -mr-3 flex-1">
            {post.replies.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm">No replies yet.</p>
            ) : (
              post.replies.map((reply) => <ReplyItem key={reply.id} reply={reply} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}