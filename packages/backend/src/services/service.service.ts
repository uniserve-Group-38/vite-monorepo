import { serviceRepository } from "../repositories/service.repository";

export const serviceService = {
  createService: (
    providerId: string,
    data: {
      title: string;
      description: string;
      category: string;
      price?: string;
      operatingHours?: string;
      imageUrl?: string;
    }
  ) => serviceRepository.create({ ...data, providerId }),

  getServiceById: (id: string) => serviceRepository.findByIdWithProvider(id),

  updateService: (
    serviceId: string,
    providerId: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      price?: string;
      operatingHours?: string;
      imageUrl?: string;
    }
  ) => serviceRepository.update(serviceId, providerId, data),

  deleteService: (serviceId: string, providerId: string) =>
    serviceRepository.delete(serviceId, providerId),
};
