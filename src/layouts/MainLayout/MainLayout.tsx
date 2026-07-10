// layouts/MainLayout/MainLayout.tsx

import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Navigation } from "@/navigation/Navigation/Navigation";

const MainLayout = () => {
  return (
    <div>
      <Header />

      <div>
        <Navigation>
          <Navigation.Links />
          <Navigation.Menu />
        </Navigation>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
