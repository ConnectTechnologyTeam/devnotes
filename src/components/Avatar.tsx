type AvatarProps = {
  src?: string;
  name?: string;
  size?: 40 | 64;
  className?: string;
};

export const Avatar = ({ src, name = '', size = 40, className = '' }: AvatarProps) => {
  const dimension = `${size}px`;
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');
  return (
    <div
      className={`rounded-full overflow-hidden bg-muted flex items-center justify-center ${className}`}
      style={{ width: dimension, height: dimension }}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span className="text-xs text-muted-foreground">{initials || '👤'}</span>
      )}
    </div>
  );
};


