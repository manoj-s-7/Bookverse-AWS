import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Discover from "./pages/Discover";
import Explore from "./pages/Explore";
import BookPage from "./pages/BookPage";
import Library from "./pages/Library";
import Soon from "./pages/Soon";
import Authors from "./pages/Authors";
import AuthorPage from "./pages/AuthorPage";
import Collections from "./pages/Collections";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary><BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Discover />} />
          <Route path="explore" element={<Explore />} />
          <Route path="book/:id" element={<BookPage />} />
          <Route path="library" element={<Library />} />
          <Route path="authors" element={<Authors />} />
          <Route path="authors/:id" element={<AuthorPage />} />
          <Route path="collections" element={<Collections />} />
          <Route path="*" element={<Soon title="Page not found" notFound />} />
        </Route>
      </Routes>
    </BrowserRouter></ErrorBoundary>
  </StrictMode>
);
