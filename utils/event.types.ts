export type Speaker = {
  id: string;
  name: string;
  speakerTitle: string;
  imageUrl: string;
};

export type Venue = {
  name: string;
  address: string;
};

export type Event = {
  id: string;
  date: string;
  title: string;
  imageUrl?: string;
  speakers?: Speaker[];
  photos?: string[];
  venue: Venue;
  videoUrl?: string;
  sponsoredBy?: string[];
  sponsoredByLogos?: string[];
  imageCredit?: string;
};

export type MockEvent = {
  date: string;
  title: string;
  imageUrl?: string;
  speakers?: Speaker[];
  photos?: string[];
  venue: Venue;
  videoUrl?: string;
  sponsoredBy?: string;
  sponsoredByLogo?: string;
  imageCredit?: string;
};