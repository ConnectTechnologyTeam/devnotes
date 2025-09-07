import { Avatar } from '@/components/Avatar';

type Props = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

export const UserBadge = ({ name, avatarUrl, className = '' }: Props) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar src={avatarUrl} name={name} size={24 as any} />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};


