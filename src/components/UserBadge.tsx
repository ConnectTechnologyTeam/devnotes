type Props = {
  name: string;
  avatarUrl?: string;
  className?: string;
};

export const UserBadge = ({ name, avatarUrl, className = '' }: Props) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-6 h-6 object-cover" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-secondary" />
        )}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};


