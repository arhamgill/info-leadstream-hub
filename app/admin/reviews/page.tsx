"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, ArrowUp, ArrowDown } from "lucide-react";

interface Review {
  id: string;
  url: string;
  order: number;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("adminLoggedIn")) {
      router.push("/admin");
      return;
    }

    fetchReviews();
  }, [router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        fetchReviews();
        e.target.value = "";
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const moveReview = async (id: string, direction: "up" | "down") => {
    const currentIndex = reviews.findIndex((r) => r.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= reviews.length) return;

    // Swap orders
    const currentReview = reviews[currentIndex];
    const targetReview = reviews[newIndex];

    try {
      await Promise.all([
        fetch(`/api/reviews/${currentReview.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: targetReview.order }),
        }),
        fetch(`/api/reviews/${targetReview.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentReview.order }),
        }),
      ]);

      fetchReviews();
    } catch (error) {
      console.error("Error moving review:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Review Management</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-[#0f172a] rounded-lg border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Review</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#00d4ff] transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-400">
                {uploading ? "Uploading..." : "Click to upload image"}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Reviews Grid */}
        <div className="bg-[#0f172a] rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-4">
            All Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No reviews uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="relative group bg-[#0a0f1a] rounded-lg overflow-hidden border border-gray-800"
                >
                  <div className="relative w-full">
                    <Image
                      src={review.url}
                      alt={`Review ${index + 1}`}
                      width={400}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Order Controls */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={() => moveReview(review.id, "up")}
                      disabled={index === 0}
                      className="p-1.5 bg-[#0a0f1a]/80 rounded hover:bg-[#00d4ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveReview(review.id, "down")}
                      disabled={index === reviews.length - 1}
                      className="p-1.5 bg-[#0a0f1a]/80 rounded hover:bg-[#00d4ff] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 rounded hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Order Badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#0a0f1a]/80 rounded text-xs">
                    Order: {review.order}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
