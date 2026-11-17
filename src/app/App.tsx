import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";

import { AppRouter } from "@/app/router/AppRouter";
import { queryClient } from "@/shared/query/queryClient";

// The cache inspector, a floating button in the corner. Development only:
// in a production build this whole branch, and the package, is left out.
const QueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : () => null;

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Suspense>
        <QueryDevtools buttonPosition="bottom-left" />
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
