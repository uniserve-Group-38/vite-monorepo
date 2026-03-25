import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
;
import { headers } from "next/headers";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MarkAllReadOnView } from "../../chat/mark-all-read-on-view";

export const dynamic = "force-dynamic";

export default async function DashboardChatPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    window.location.href = "/auth/sign-in";
  }

  const userId = session.user.id;

  // Find all conversations where the user is the provider (Service Provider Portal)
  const conversations = await prisma.conversation.findMany({
    where: {
      booking: {
        providerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          student: {
            select: { id: true, name: true, image: true },
          },
          provider: {
            select: { id: true, name: true, image: true },
          },
          service: {
            select: { title: true },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // Only get the latest message for the preview
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Deduplicate by chat partner: keep the conversation with the latest activity so inbox shows correct latest message
  const uniqueConversationsMap = new Map<string, typeof conversations[0]>();
  conversations.forEach((conv) => {
    const partnerId = conv.booking.studentId === userId ? conv.booking.providerId : conv.booking.studentId;
    const existing = uniqueConversationsMap.get(partnerId);
    const convUpdated = new Date(conv.updatedAt).getTime();
    const existingUpdated = existing ? new Date(existing.updatedAt).getTime() : 0;
    if (!existing || convUpdated > existingUpdated) {
      uniqueConversationsMap.set(partnerId, conv);
    }
  });
  const dedupedConversations = Array.from(uniqueConversationsMap.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (dedupedConversations.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4 md:px-10">
        <MarkAllReadOnView />
        <h1 className="text-3xl font-black mb-8">Messages</h1>
        <p className="mt-2 text-center font-bold text-muted-foreground w-full py-20 border-4 border-black border-dashed bg-white">
          Chats would be available when your services are booked.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 md:px-10">
      <MarkAllReadOnView />
      <Link to="/dashboard" className="inline-block mb-4">
        <Button variant="outline" className="border-4 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 transition-all hover:-translate-y-1 active:translate-y-0">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Dashboard
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black">Messages</h1>
      </div>
      <div className="space-y-6">
        {dedupedConversations.map((conversation) => {
          const { booking, messages } = conversation;
          const isStudent = booking.studentId === userId;

          // The "other" person in the chat
          const chatPartner = isStudent ? booking.provider : booking.student;
          const partnerRole = isStudent ? "Provider" : "Student";
          const latestMessage = messages[0];

          return (
            <Link key={conversation.id} to={`/dashboard/chat/${conversation.id}`} className="block">
              <Card className="hover:bg-pink-50 transition-all cursor-pointer border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:-translate-y-1">
                <CardContent className="p-6 flex items-center space-x-6">
                  <Avatar className="h-14 w-14 border-2 border-black">
                    <AvatarImage src={chatPartner.image || ""} />
                    <AvatarFallback className="bg-yellow-300 font-bold">
                      {chatPartner.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-black text-lg truncate">
                        {chatPartner.name}
                      </h3>
                      {latestMessage && (
                        <span className="text-xs font-black text-muted-foreground whitespace-nowrap ml-2">
                          {new Date(latestMessage.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <p className="text-muted-foreground font-bold truncate max-w-[75%]">
                        {latestMessage
                          ? latestMessage.content
                          : `New conversation regarding: ${booking.service.title}`}
                      </p>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isStudent ? "bg-purple-200" : "bg-cyan-200"
                        }`}>
                        {partnerRole}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
