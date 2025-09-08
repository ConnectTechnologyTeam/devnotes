import React from 'react';
import { Avatar } from './Avatar';

interface UserBadgeProps {
  name: string;
  avatarUrl?: string;
  size?: number;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ name, avatarUrl, size = 32 }) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar src={avatarUrl} name={name} size={size} />
      <span className="text-sm font-medium truncate max-w-[140px]" title={name}>{name}</span>
    </div>
  );
};
