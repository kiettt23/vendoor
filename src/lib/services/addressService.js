import prisma from "@/lib/prisma";

class AddressService {
  async saveAddress(userId, addressData) {
    const address = await prisma.address.create({
      data: {
        userId,
        name: addressData.name,
        email: addressData.email,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country,
        phone: addressData.phone,
      },
    });

    return address;
  }

  async getAddress(userId) {
    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return addresses;
  }
}

export const addressService = new AddressService();
