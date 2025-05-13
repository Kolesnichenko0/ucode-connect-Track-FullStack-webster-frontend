export interface Event {
    id: string;
    title: string;
    description: string;
    image?: string;
    date: Date;
    endDate: Date;
    location: string;
    price: number;
    category: string;
    theme: string;
    attendees: number;
  }
  
  export interface EventDetail extends Event {
    longDescription?: string;
    organizer: Organizer;
    attendeesList: Attendee[];
    comments: Comment[];
    similarEvents: Event[];
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface Organizer {
    id: string;
    name: string;
    logo?: string;
    description: string;
    events: {
      id: string;
      title: string;
      date: string;
    }[];
  }
  
  export interface Attendee {
    id: string;
    name: string;
    avatar?: string;
  }
  
  export interface Comment {
    id: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
      isOrganizer?: boolean;
    };
    text: string;
    date: string;
    likes: number;
  }

  