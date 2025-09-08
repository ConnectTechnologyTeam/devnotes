import { Avatar } from './Avatar';

type UserBadgeProps = {
  name: string;
  avatarUrl?: string;
  size?: 40 | 64;
  className?: string;
};

export const UserBadge = ({ 
  name, 
  avatarUrl, 
  size = 40, 
  className = '' 
}: UserBadgeProps) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Avatar src={avatarUrl} name={name} size={size} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{name}</span>
      </div>
    </div>
  );
};
