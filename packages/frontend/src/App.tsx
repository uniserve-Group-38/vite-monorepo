import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import BetterAuthUIProvider from "@/providers/better-auth-ui-provider";
import { ThemeProvider } from "@/components/theme-provider";
const Page_pages_account__path__page_tsx = React.lazy(() => import('@/pages/account/[path]/page.tsx'));
const Page_pages_admin_announcements_create_page_tsx = React.lazy(() => import('@/pages/admin/announcements/create/page.tsx'));
const Page_pages_admin_announcements_page_tsx = React.lazy(() => import('@/pages/admin/announcements/page.tsx'));
const Page_pages_admin_applications_page_tsx = React.lazy(() => import('@/pages/admin/applications/page.tsx'));
const Page_pages_admin_dashboard_page_tsx = React.lazy(() => import('@/pages/admin/dashboard/page.tsx'));
const Page_pages_admin_support_page_tsx = React.lazy(() => import('@/pages/admin/support/page.tsx'));
const Page_pages_admin_support__id__page_tsx = React.lazy(() => import('@/pages/admin/support/[id]/page.tsx'));
const Page_pages_announcements_page_tsx = React.lazy(() => import('@/pages/announcements/page.tsx'));
const Page_pages_announcements__id__page_tsx = React.lazy(() => import('@/pages/announcements/[id]/page.tsx'));
const Page_pages_apply_page_tsx = React.lazy(() => import('@/pages/apply/page.tsx'));
const Page_pages_auth__path__page_tsx = React.lazy(() => import('@/pages/auth/[path]/page.tsx'));
const Page_pages_book__serviceId__page_tsx = React.lazy(() => import('@/pages/book/[serviceId]/page.tsx'));
const Page_pages_bookings_page_tsx = React.lazy(() => import('@/pages/bookings/page.tsx'));
const Page_pages_cart_page_tsx = React.lazy(() => import('@/pages/cart/page.tsx'));
const Page_pages_chat_page_tsx = React.lazy(() => import('@/pages/chat/page.tsx'));
const Page_pages_chat__conversationId__page_tsx = React.lazy(() => import('@/pages/chat/[conversationId]/page.tsx'));
const Page_pages_dashboard_bookings_page_tsx = React.lazy(() => import('@/pages/dashboard/bookings/page.tsx'));
const Page_pages_dashboard_chat_page_tsx = React.lazy(() => import('@/pages/dashboard/chat/page.tsx'));
const Page_pages_dashboard_chat__conversationId__page_tsx = React.lazy(() => import('@/pages/dashboard/chat/[conversationId]/page.tsx'));
const Page_pages_dashboard_conversations__bookingId__page_tsx = React.lazy(() => import('@/pages/dashboard/conversations/[bookingId]/page.tsx'));
const Page_pages_dashboard_page_tsx = React.lazy(() => import('@/pages/dashboard/page.tsx'));
const Page_pages_dashboard_services_page_tsx = React.lazy(() => import('@/pages/dashboard/services/page.tsx'));
const Page_pages_dashboard_settings_page_tsx = React.lazy(() => import('@/pages/dashboard/settings/page.tsx'));
const Page_pages_dashboard_transactions_page_tsx = React.lazy(() => import('@/pages/dashboard/transactions/page.tsx'));
const Page_pages_page_tsx = React.lazy(() => import('@/pages/page.tsx'));
const Page_pages_payment_callback_page_tsx = React.lazy(() => import('@/pages/payment/callback/page.tsx'));
const Page_pages_privacy_page_tsx = React.lazy(() => import('@/pages/privacy/page.tsx'));
const Page_pages_services_page_tsx = React.lazy(() => import('@/pages/services/page.tsx'));
const Page_pages_services__id__page_tsx = React.lazy(() => import('@/pages/services/[id]/page.tsx'));
const Page_pages_support_page_tsx = React.lazy(() => import('@/pages/support/page.tsx'));
const Page_pages_support_tickets_page_tsx = React.lazy(() => import('@/pages/support/tickets/page.tsx'));
const Page_pages_terms_page_tsx = React.lazy(() => import('@/pages/terms/page.tsx'));


export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <BetterAuthUIProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <Routes>
            <Route path="/account/:path" element={<Page_pages_account__path__page_tsx />} />
            <Route path="/admin/announcements/create" element={<Page_pages_admin_announcements_create_page_tsx />} />
            <Route path="/admin/announcements" element={<Page_pages_admin_announcements_page_tsx />} />
            <Route path="/admin/applications" element={<Page_pages_admin_applications_page_tsx />} />
            <Route path="/admin/dashboard" element={<Page_pages_admin_dashboard_page_tsx />} />
            <Route path="/admin/support" element={<Page_pages_admin_support_page_tsx />} />
            <Route path="/admin/support/:id" element={<Page_pages_admin_support__id__page_tsx />} />
            <Route path="/announcements" element={<Page_pages_announcements_page_tsx />} />
            <Route path="/announcements/:id" element={<Page_pages_announcements__id__page_tsx />} />
            <Route path="/apply" element={<Page_pages_apply_page_tsx />} />
            <Route path="/auth/:path" element={<Page_pages_auth__path__page_tsx />} />
            <Route path="/book/:serviceId" element={<Page_pages_book__serviceId__page_tsx />} />
            <Route path="/bookings" element={<Page_pages_bookings_page_tsx />} />
            <Route path="/cart" element={<Page_pages_cart_page_tsx />} />
            <Route path="/chat" element={<Page_pages_chat_page_tsx />} />
            <Route path="/chat/:conversationId" element={<Page_pages_chat__conversationId__page_tsx />} />
            <Route path="/dashboard/bookings" element={<Page_pages_dashboard_bookings_page_tsx />} />
            <Route path="/dashboard/chat" element={<Page_pages_dashboard_chat_page_tsx />} />
            <Route path="/dashboard/chat/:conversationId" element={<Page_pages_dashboard_chat__conversationId__page_tsx />} />
            <Route path="/dashboard/conversations/:bookingId" element={<Page_pages_dashboard_conversations__bookingId__page_tsx />} />
            <Route path="/dashboard" element={<Page_pages_dashboard_page_tsx />} />
            <Route path="/dashboard/services" element={<Page_pages_dashboard_services_page_tsx />} />
            <Route path="/dashboard/settings" element={<Page_pages_dashboard_settings_page_tsx />} />
            <Route path="/dashboard/transactions" element={<Page_pages_dashboard_transactions_page_tsx />} />
            <Route path="/" element={<Page_pages_page_tsx />} />
            <Route path="/payment/callback" element={<Page_pages_payment_callback_page_tsx />} />
            <Route path="/privacy" element={<Page_pages_privacy_page_tsx />} />
            <Route path="/services" element={<Page_pages_services_page_tsx />} />
            <Route path="/services/:id" element={<Page_pages_services__id__page_tsx />} />
            <Route path="/support" element={<Page_pages_support_page_tsx />} />
            <Route path="/support/tickets" element={<Page_pages_support_tickets_page_tsx />} />
            <Route path="/terms" element={<Page_pages_terms_page_tsx />} />

            </Routes>
          </Suspense>
        </BrowserRouter>
      </BetterAuthUIProvider>
      <Toaster />
    </ThemeProvider>
  );
}
