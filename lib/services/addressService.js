import prisma from "@/lib/prisma";

class AddressService {
  async saveAddress(userId, addressData) {
    const address = await prisma.address.upsert({
      where: { userId },
      update: {
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
      },
      create: {
        userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipCode,
        country: addressData.country,
      },
    });

    return address;
  }

  async getAddress(userId) {
    const address = await prisma.address.findUnique({
      where: { userId },
    });

    return address;
  }
}

export const addressService = new AddressService();
