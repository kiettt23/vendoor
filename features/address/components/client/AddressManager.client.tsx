"use client";
import { useState, useEffect } from "react";
import { Trash2Icon, EditIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import {
  deleteAddress,
  getUserAddresses,
} from "@/features/address/actions/address.action";
import { AddressModal } from "./AddressModal.client";
import type { SerializedAddress } from "@/features/address/types/address.types";

interface AddressManagerProps {
  selectedAddress: SerializedAddress | null;
  setSelectedAddress: (address: SerializedAddress | null) => void;
  initialAddresses?: SerializedAddress[];
}

export function AddressManager({
  selectedAddress,
  setSelectedAddress,
  initialAddresses = [],
}: AddressManagerProps) {
  const [addressList, setAddressList] =
    useState<SerializedAddress[]>(initialAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<SerializedAddress | null>(null);

  const fetchAddresses = async () => {
    const result = await getUserAddresses();
    setAddressList(result.addresses);
  };

  useEffect(() => {
    if (initialAddresses.length === 0) {
      fetchAddresses();
    }
  }, [initialAddresses]);

  const handleDelete = async (addressId: string) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    try {
      const result = await deleteAddress(addressId);

      if (!result.success) {
        return toast.error(result.error);
      }

      // Update local state
      const updatedList = addressList.filter((addr) => addr.id !== addressId);
      setAddressList(updatedList);

      // Clear selection if deleted
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(null);
      }

      toast.success(result.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa địa chỉ"
      );
    }
  };

  return (
    <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
      <p className="font-medium mb-2">Địa chỉ giao hàng</p>

      {selectedAddress ? (
        <div className="flex gap-2 items-center justify-between bg-purple-50 p-3 rounded">
          <p className="text-slate-600">
            <span className="font-medium">{selectedAddress.name}</span>
            <br />
            {selectedAddress.street}, {selectedAddress.city},{" "}
            {selectedAddress.state}
            <br />
            {selectedAddress.phone}
          </p>
          <button
            onClick={() => setSelectedAddress(null)}
            className="text-purple-500 hover:text-purple-700"
          >
            Thay đổi
          </button>
        </div>
      ) : (
        <div>
          {addressList.length > 0 && (
            <div className="space-y-2 mb-3">
              {addressList.map((address) => (
                <div
                  key={address.id}
                  className="flex items-center justify-between border border-slate-300 p-3 rounded hover:bg-slate-50"
                >
                  <div
                    onClick={() => setSelectedAddress(address)}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-medium text-slate-600">{address.name}</p>
                    <p className="text-sm">
                      {address.street}, {address.city}, {address.state}
                    </p>
                    <p className="text-sm">{address.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddressModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Chỉnh sửa"
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Xóa"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 mt-2"
            onClick={() => {
              setEditingAddress(null);
              setShowAddressModal(true);
            }}
          >
            <PlusIcon size={18} />
            {addressList.length > 0 ? "Thêm địa chỉ mới" : "Thêm địa chỉ"}
          </button>
        </div>
      )}

      {showAddressModal && (
        <AddressModal
          setShowAddressModal={setShowAddressModal}
          editingAddress={editingAddress}
          onSuccess={fetchAddresses}
        />
      )}
    </div>
  );
}
