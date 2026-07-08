// layouts/MainLayout/MainLayout.tsx

import { Outlet } from "react-router-dom";

import { Header } from "./Header";

const MainLayout = () => {
  return (
    <div className="layout">
      <Header />

      <div className="layout-body">
        <aside>{/* Navigation later */}</aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
