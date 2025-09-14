
export enum Sport {
  RUGBY = 'Rugby à 7',
  NATATION = 'Natation',
  FOOTBALL = 'Foot à 7',
  BOXE = 'Boxe',
  ATHLETISME = 'Cross Athlétisme',
  TENNIS = 'Tennis',
  ESCALADE = 'Escalade',
  TENNIS_DE_TABLE = 'Tennis de table',
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  sports: Sport[];
  registrationDate: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CalendarEvent {
  id:string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
}
// FIX: Add NewsAction and CalendarAction types to be used in admin components.
export type NewsAction =
  | { type: 'add_or_update'; payload: NewsItem }
  | { type: 'delete'; payload: { id: string } };

export type CalendarAction =
  | { type: 'add_or_update'; payload: CalendarEvent }
  | { type: 'delete'; payload: { id: string } };
