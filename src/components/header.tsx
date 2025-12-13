import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  title?: string;
  description?: string;
  memberCount?: number;
  avatarText?: string;
}

export function Header({
  title = "Open forum",
  description = "Have open discussion with other students",
  memberCount = 200,
  avatarText = "OF"
}: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{avatarText}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <h3 className="text-sm text-muted-foreground">{description}</h3>
          <p className="text-sm text-muted-foreground mt-2">{memberCount} members</p>
        </div>
      </div>
      <MoreVertical className="h-5 w-5 text-muted-foreground cursor-pointer" />
    </header>
  );
}
