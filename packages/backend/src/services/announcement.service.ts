import { announcementRepository } from "../repositories/announcement.repository";

export const announcementService = {
  getActiveAnnouncements: () => announcementRepository.findAllActive(),

  getAllAnnouncements: () => announcementRepository.findAll(),

  createAnnouncement: (data: {
    title: string;
    content: string;
    summary?: string | null;
    category: string;
    imageUrl?: string | null;
    externalLink?: string | null;
    contactInfo?: string | null;
    isVerified?: boolean;
    isActive?: boolean;
  }) => announcementRepository.create(data),

  deleteAnnouncement: (id: string) => announcementRepository.deleteById(id),
};
