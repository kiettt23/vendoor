/**
 * Address Types
 * Địa chỉ giao hàng
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

/**
 * Serialized Address - Date → string
 */
export type SerializedAddress = Omit<Address, "createdAt"> & {
  createdAt: string;
};

/**
 * Address Form Data - Cho việc tạo/cập nhật
 */
export interface AddressFormData {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  phone: string;
}
