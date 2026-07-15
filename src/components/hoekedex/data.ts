import type { Profile } from "./types";

export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Maya Chen",
    age: 24,
    status: "situationship",
    rating: 8.5,
    photo: "/avatars/avatar-1.jpg",
    notes: "Met at a rooftop party. Loves oat milk lattes and indie films.",
    lastUpdated: "2026-07-10",
    lies: [
      {
        id: "l1",
        text: "Told her I was 'not really looking for anything serious'.",
        date: "2026-07-08",
        severity: "medium",
      },
      {
        id: "l2",
        text: "Said I deleted my dating apps. I did. For 24 hours.",
        date: "2026-07-12",
        severity: "big",
      },
    ],
  },
  {
    id: "2",
    name: "Sofia Rivera",
    age: 26,
    status: "talking",
    rating: 9.2,
    photo: "/avatars/avatar-2.jpg",
    notes: "Textbook green flags. Architecture grad, terrible at karaoke.",
    lastUpdated: "2026-07-13",
    lies: [
      {
        id: "l3",
        text: "Pretended I knew what brutalism was.",
        date: "2026-07-11",
        severity: "white",
      },
    ],
  },
  {
    id: "3",
    name: "Jade Williams",
    age: 23,
    status: "backup",
    rating: 6.8,
    photo: "/avatars/avatar-3.jpg",
    notes: "Only messages after midnight. Red flag collection.",
    lastUpdated: "2026-07-05",
    lies: [
      {
        id: "l4",
        text: "Said I was 'busy with work' when I was just watching anime.",
        date: "2026-07-04",
        severity: "medium",
      },
      {
        id: "l5",
        text: "Claimed my gym membership was 'still processing'.",
        date: "2026-07-02",
        severity: "white",
      },
    ],
  },
  {
    id: "4",
    name: "Emma Thompson",
    age: 25,
    status: "ex",
    rating: 7.0,
    photo: "/avatars/avatar-4.jpg",
    notes: "The one that got away. Or ran away. Still unclear.",
    lastUpdated: "2026-06-28",
    lies: [
      {
        id: "l6",
        text: "Told her I was 'happy for her' when she started dating someone.",
        date: "2026-06-25",
        severity: "big",
      },
    ],
  },
  {
    id: "5",
    name: "Ava Nakamura",
    age: 27,
    status: "taken",
    rating: 9.7,
    photo: "/avatars/avatar-5.jpg",
    notes: "Official. Met the parents. Still nervous around her dog.",
    lastUpdated: "2026-07-14",
    lies: [
      {
        id: "l7",
        text: "Said her dog 'really likes me'.",
        date: "2026-07-13",
        severity: "white",
      },
      {
        id: "l8",
        text: "Pretended I loved her friend's experimental cooking.",
        date: "2026-07-09",
        severity: "medium",
      },
    ],
  },
];
