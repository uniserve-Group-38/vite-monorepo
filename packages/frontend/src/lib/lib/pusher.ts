import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: import.meta.env.VITE_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER!,
  useTLS: true,
});
