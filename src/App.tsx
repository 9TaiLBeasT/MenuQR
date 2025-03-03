import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const MenuBuilder = lazy(() => import("./pages/menu/MenuBuilder"));
const QRCodeGenerator = lazy(() => import("./pages/qrcode/QRCodeGenerator"));
const PublicMenuView = lazy(() => import("./components/menu/PublicMenuView"));

// New pages
const FeaturesPage = lazy(() => import("./pages/features/FeaturesPage"));
const DemoPage = lazy(() => import("./pages/demo/DemoPage"));
const ContactPage = lazy(() => import("./pages/contact/ContactPage"));
const BlogPage = lazy(() => import("./pages/blog/BlogPage"));
const HelpCenterPage = lazy(() => import("./pages/help/HelpCenterPage"));
const TutorialsPage = lazy(() => import("./pages/tutorials/TutorialsPage"));
const FAQPage = lazy(() => import("./pages/faq/FAQPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <>
        {/* Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />

          {/* New pages */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="menu" element={<MenuBuilder />} />
            <Route path="qrcode" element={<QRCodeGenerator />} />
          </Route>

          {/* Direct routes for easier navigation */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path="/settings" element={<DashboardLayout />}>
            <Route index element={<SettingsPage />} />
          </Route>
          <Route path="/menu" element={<DashboardLayout />}>
            <Route index element={<MenuBuilder />} />
          </Route>
          <Route path="/qrcode" element={<DashboardLayout />}>
            <Route index element={<QRCodeGenerator />} />
          </Route>

          {/* Public menu route */}
          <Route path="/menu/:profileId" element={<PublicMenuView />} />

          {/* Allow Tempo routes to capture /tempobook/* paths */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
