// types.ts
export interface TourPackage {
  id: number;
  image: string;
  city: string;
  description: string;
  price: number;
  rating: number;
  date: string;
  reviews: number;
}

export const packagesData: TourPackage[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Switzerland",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 1100,
    rating: 5.0,
    date: "11 September 2022",
    reviews: 584,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Berlin",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 1230,
    rating: 4.9,
    date: "12 September 2022",
    reviews: 584,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Maldives",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 3000,
    rating: 5.0,
    date: "14 September 2022",
    reviews: 584,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Torronto",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 2100,
    rating: 4.8,
    date: "15 September 2022",
    reviews: 584,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Baku",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 1440,
    rating: 5.0,
    date: "16 September 2022",
    reviews: 584,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800",
    city: "Chinese",
    description: "Qui Tempore Voluptate Qui Quia Commodi Rem Praesentium Alias Et.",
    price: 1210,
    rating: 4.0,
    date: "18 September 2022",
    reviews: 584,
  },
];
