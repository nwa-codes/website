import type { MockEvent } from './event.types';

export const events: MockEvent[] = [
  {
    date: '2025-06-26T19:00:00-06:00',
    title: 'A Comparison of Modern Frameworks',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-1',
        name: 'Blake Johnston',
        speakerTitle: 'Mr. Senior Technical Dude',
        imageUrl:
          'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766175771/blake-johnston-avatar_qeb2u5.jpg'
      }
    ],
    photos: [
      'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg',
      '/events/social-event-background.jpg'
    ],
    sponsoredBy: 'Sleepy Fox',
    sponsoredByLogo: '/sponsors/sleepy-fox-event-logo.svg',
    imageCredit: 'Photo by Mohammad Rahmani on Unsplash'
  },
  {
    date: '2025-04-17T18:30:00-06:00',
    title: 'Lightning Talks',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-2',
        name: 'Mike Chen',
        speakerTitle: 'Full Stack Developer',
        imageUrl: '/placeholders/mike-chen-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2025-05-29T19:00:00-06:00',
    title: 'Back to the Future: Deployless Development',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-3',
        name: 'Sarah Mitchell',
        speakerTitle: 'Senior Frontend Engineer',
        imageUrl: '/placeholders/sarah-mitchell-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2025-03-11T19:00:00-06:00',
    title: 'JS Basics: From Zero to Hero',
    videoUrl: 'http://www.example.com',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-4',
        name: 'Dr. Emily Chen',
        speakerTitle: 'Lead Software Architect',
        imageUrl: '/placeholders/emily-chen-avatar.jpg?width=80&height=80'
      }
    ],
    photos: [
      'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg'
    ]
  },
  {
    date: '2025-02-17T18:00:00-06:00',
    title: 'The Future of AI: Ethical Considerations and Innovation',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-5',
        name: 'Priya Patel',
        speakerTitle: 'Machine Learning Engineer',
        imageUrl: '/placeholders/priya-patel-avatar.jpg?width=80&height=80'
      }
    ],
    sponsoredBy: 'Sleepy Fox',
    sponsoredByLogo: '/sponsors/sleepy-fox-event-logo.svg'
  },
  {
    date: '2025-01-23T19:30:00-06:00',
    title: 'Blockchain Beyond Bitcoin: Transforming Business',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-6',
        name: 'Mike Chen',
        speakerTitle: 'Full Stack Developer',
        imageUrl: '/placeholders/mike-chen-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2024-12-13T18:00:00-06:00',
    title: 'The Internet of Things (IoT): Creating Smart Environments',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-7',
        name: 'Alex Thompson',
        speakerTitle: 'DevOps Engineer',
        imageUrl: '/placeholders/alex-thompson-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2024-11-07T19:00:00-06:00',
    title: 'Cybersecurity in the Digital Age',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-8',
        name: 'Priya Patel',
        speakerTitle: 'Machine Learning Engineer',
        imageUrl: '/placeholders/priya-patel-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2024-10-19T14:00:00-06:00',
    title: 'Virtual Reality and Augmented Reality: Blending Digital and Physical Worlds',
    imageUrl:
      'https://res.cloudinary.com/dmrl9ghse/image/upload/v1766183818/default-event-background_ki85fy.jpg',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-9',
        name: 'Sarah Mitchell',
        speakerTitle: 'Senior Frontend Engineer',
        imageUrl: '/placeholders/sarah-mitchell-avatar.jpg?width=80&height=80'
      }
    ]
  },
  {
    date: '2024-09-03T18:30:00-06:00',
    title: 'Machine Learning Workshop: Hands-on with TensorFlow',
    venue: {
      name: 'Fayetteville Town Center',
      address: '15 W Mountain St, Fayetteville, AR 72701'
    },
    speakers: [
      {
        id: 'mock-speaker-10',
        name: 'Dr. Emily Chen',
        speakerTitle: 'Lead Software Architect',
        imageUrl: '/placeholders/emily-chen-avatar.jpg?width=80&height=80'
      }
    ]
  }
];
