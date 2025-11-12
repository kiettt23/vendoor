/**
 * Rating Types
 */

export interface RatingUser {
  id?: string;
  name: string | null;
  image?: string | null;
}

export interface Rating {
  id: string;
  rating: number;
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: RatingUser;
}

export type SerializedRating = Omit<Rating, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export interface RatingModalState {
  productId: string;
  orderId: string;
}
