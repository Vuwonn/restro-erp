import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useArticles from "@/hooks/useArticles";
import { ARTICLE_API_END_POINT } from "@/utils/constant";

const AdminArticleList = () => {
  const {
    articles,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    loading,
  } = useArticles();

  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (slug) => {
    try {
      setDeleting(true);
      await axios.delete(`${ARTICLE_API_END_POINT}/delete-article/${slug}`);
      setPage(1); // Reset to the first page after deletion
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = (slug) => {
    navigate(`edit-article/${slug}`);
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) => {
    const lowercasedSearch = search.toLowerCase();
    return (
      article.title.toLowerCase().includes(lowercasedSearch) ||
      article.slug.toLowerCase().includes(lowercasedSearch) ||
      article.excerpt.toLowerCase().includes(lowercasedSearch)
    );
  });

  // To make sure we are updating the search filter correctly
  useEffect(() => {
    setPage(1); // Reset to the first page when search changes
  }, [search, setPage]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">Manage Articles</h2>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, slug, or description"
          className="p-3 rounded-md border border-gray-300"
        />
      </div>

      {loading || deleting ? (
        <div className="text-center text-lg font-semibold">{deleting ? "Deleting..." : "Loading..."}</div>
      ) : (
        <div>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">SN</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Slug</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Excerpt</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article, index) => (
                <tr key={article.slug} className="border-t border-gray-200">
                  <td className="py-4 px-6">{(page - 1) * 10 + index + 1}</td> {/* SN Calculation */}
                  <td className="py-4 px-6">{article.title}</td>
                  <td className="py-4 px-6">{article.slug}</td>
                  <td className="py-4 px-6">{article.excerpt}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleUpdate(article.slug)}
                      className="text-blue-500 hover:text-blue-700 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.slug)}
                      className="text-red-500 hover:text-red-700"
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="py-2 px-4 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="py-2 px-4 bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticleList;
