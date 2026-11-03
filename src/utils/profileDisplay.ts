export function getProfileFirstName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.split(/\s+/)[0] ?? '';
}

export function getProfileInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

export function getProfileGreeting(displayName: string): string {
  const first = getProfileFirstName(displayName);
  return first ? `Olá, ${first}!` : 'Olá!';
}
