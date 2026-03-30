export const imagekitConfig = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT!,
};

// Helper function to get optimized image URL
export function getImageKitUrl(path: string, transformations?: string) {
  const baseUrl = imagekitConfig.urlEndpoint;
  if (transformations) {
    return `${baseUrl}/tr:${transformations}/${path}`;
  }
  return `${baseUrl}/${path}`;
}

// Example: getImageKitUrl('announcement-banner.jpg', 'w-400,h-300,fo-auto')