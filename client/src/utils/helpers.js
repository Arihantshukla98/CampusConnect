import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy • hh:mm a');
};

// Get relative time (e.g. "2 hours ago")
export const timeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Check if event is upcoming
export const isUpcoming = (date) => {
  return isAfter(new Date(date), new Date());
};

// Check if event is past
export const isPast = (date) => {
  return isBefore(new Date(date), new Date());
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Debounce helper
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Build URL query string from params object
export const buildQueryString = (params) => {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );
  return new URLSearchParams(filtered).toString();
};

// Category color map for events
export const EVENT_CATEGORY_COLORS = {
  technical: 'badge-blue',
  cultural: 'badge-pink',
  sports: 'badge-green',
  workshop: 'badge-purple',
  seminar: 'badge-indigo',
  other: 'badge-gray',
};

// Lost item category icons map
export const CATEGORY_ICONS = {
  electronics: '📱',
  stationery: '✏️',
  clothing: '👔',
  'id-card': '🪪',
  other: '📦',
};

// Status badge class map
export const STATUS_BADGE_MAP = {
  open: 'badge-green',
  claimed: 'badge-yellow',
  resolved: 'badge-gray',
};

// Branch options
export const BRANCHES = ['CSE', 'ECE', 'ME', 'Civil', 'MBA', 'Other'];

// Year options
export const YEARS = [1, 2, 3, 4];

// Event categories
export const EVENT_CATEGORIES = ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'other'];

// Lost found categories
export const LOST_FOUND_CATEGORIES = ['electronics', 'stationery', 'clothing', 'id-card', 'other'];
