import { useState, useEffect } from "react";
import axios from "axios";
import { ARTICLE_API_END_POINT } from "@/utils/constant";

const useArticles = (initialSearch = "", initialPage = 1, initialLimit = 10) => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalArticles, setTotalArticles] = useState(0);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ARTICLE_API_END_POINT}/admin-articles`, {
        params: { page, search, limit },
        withCredentials: true,
      });
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
      setTotalArticles(response.data.totalArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, search, limit]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page on limit change
  };

  return {
    articles,
    search,
    setSearch: handleSearchChange,
    page,
    setPage: handlePageChange,
    totalPages,
    totalArticles,
    loading,
    limit,
    setLimit: handleLimitChange,
  };
};

export default useArticles;
