/**
 * Address Types
 */

export interface Address {
  id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  phone: string;
  userId: string;
  createdAt: Date | string;
}

export type SerializedAddress = Omit<Address, "createdAt"> & {
  createdAt: string;
};
