"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  Search,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Camera,
  Award,
  Flame,
  Check,
} from "lucide-react";
import type { ApiProduct } from "@/lib/api";

const HIGHLIGHTS = [
  {
    icon: Award,
    title: "Workshop Build Showcase",
    desc: "Approved customer build photos are featured on our website showcase and official Instagram page.",
  },
  {
    icon: ShieldCheck,
    title: "Authentic Driver Feedback",
    desc: "Real feedback from car owners helps fellow enthusiasts choose the right fitment.",
  },
  {
    icon: Flame,
    title: "Community Feature",
    desc: "Get your car documented with high-definition photos and credited across our social channels.",
  },
];

export default function SubmitReviewPage() {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [carModel, setCarModel] = useState("");
  const [comment, setComment] = useState("");

  // Product Selection with Search
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Photo Upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch products for searchable selector
  useEffect(() => {
    fetch("/api/v1/products?per_page=50")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !comment.trim()) {
      setErrorMessage("Please fill in your name, email, and review feedback.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("customer_name", name.trim());
      formData.append("customer_email", email.trim());
      formData.append("rating", String(rating));
      formData.append(
        "comment",
        carModel.trim() ? `[Car: ${carModel.trim()}] ${comment.trim()}` : comment.trim()
      );

      if (selectedProduct) {
        formData.append("product_id", String(selectedProduct.id));
      }

      if (selectedImage) {
        formData.append("media[]", selectedImage);
      }

      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit review. Please try again.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const RATING_LABELS: Record<number, string> = {
    1: "Needs Improvement",
    2: "Fair Quality",
    3: "Good Build",
    4: "Great Fitment & Quality",
    5: "Absolute Perfection / Track Standard",
  };

  return (
    <div className="w-full min-h-screen bg-carbon text-ink pt-6 md:pt-10 pb-20 px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 2-Column Split Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Headings, Highlights & Trust Badges */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Customer Build Verification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink leading-[1.05] mb-3">
                Share Your Build Experience.
              </h1>
              <p className="text-sm md:text-base text-ink-muted leading-relaxed">
                Help fellow automotive enthusiasts! Rate your RevvMotiv carbon upgrades, document your fitment journey, and get your ride featured on our official garage & social showcase.
              </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-4 pt-2">
              {HIGHLIGHTS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-hairline bg-surface/60 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center flex-none">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Quote */}
            <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-ink-muted leading-relaxed">
              <div className="flex items-center gap-1.5 text-amber-400 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[11px] font-bold text-amber-400 ml-1.5 uppercase tracking-wider">5.0 Community Standard</span>
              </div>
              &ldquo;Every single review is inspected by our master technicians. We verify fitment feedback to ensure our splitters, spoilers, and diffusers mount with factory-grade zero-gap tolerances.&rdquo;
            </div>
          </div>

          {/* RIGHT COLUMN: Review Form Card */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="border border-amber-500/40 bg-surface rounded-2xl p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30 shadow-lg shadow-amber-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-3">
                  Review Submitted Successfully!
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-md mx-auto">
                  Thank you, <strong className="text-ink">{name}</strong>! Your review has been sent to our moderation team. Once verified, it will go live on the official RevvMotiv build showcase!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/shop"
                    className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Browse Store Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/work"
                    className="px-8 py-3.5 bg-surface-alt hover:bg-hover border border-hairline text-ink font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                  >
                    View Customer Builds
                  </Link>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-hairline bg-surface/90 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-2xl space-y-7"
              >
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Golden Glowing Rating Stars */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-3">
                    Your Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-9 h-9 ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]"
                              : "text-ink-subtle fill-transparent"
                          } transition-colors duration-150`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                </div>

                {/* 2. Choose Product (Searchable Autocomplete with Isolated Scroll) */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Choose Product Fitted</span>
                    <span className="text-[10px] text-ink-subtle font-normal lowercase">(optional)</span>
                  </label>

                  {selectedProduct ? (
                    <div className="flex items-center justify-between p-3.5 bg-surface-alt border border-amber-500/40 rounded-xl">
                      <div className="flex items-center gap-3">
                        {selectedProduct.images?.[0] && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-hairline flex-none bg-black">
                            <Image
                              src={typeof selectedProduct.images[0] === "string" ? selectedProduct.images[0] : (selectedProduct.images[0] as any).url}
                              alt={selectedProduct.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-ink">{selectedProduct.title}</div>
                          <div className="text-[11px] text-amber-400 font-medium">₹{selectedProduct.price.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        className="p-1.5 hover:bg-surface rounded-lg text-ink-muted hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative flex items-center">
                        <Search className="absolute left-3.5 w-4 h-4 text-ink-muted pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search parts (e.g. Front Splitter, Diffuser, Brezza Lip)..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-hairline rounded-xl text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-amber-500/60 transition-colors"
                        />
                      </div>

                      {/* Dropdown with Isolated Wheel Scroll */}
                      {isDropdownOpen && filteredProducts.length > 0 && (
                        <div
                          onWheel={(e) => e.stopPropagation()}
                          className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto overscroll-contain bg-surface border border-hairline rounded-xl shadow-2xl z-50 p-2 space-y-1"
                        >
                          {filteredProducts.slice(0, 10).map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt text-left transition-colors cursor-pointer"
                            >
                              {product.images?.[0] && (
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-hairline flex-none bg-black">
                                  <Image
                                    src={typeof product.images[0] === "string" ? product.images[0] : (product.images[0] as any).url}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-ink truncate">{product.title}</div>
                                <div className="text-[10px] text-ink-muted">₹{product.price.toLocaleString("en-IN")}</div>
                              </div>
                              <Check className="w-3.5 h-3.5 text-amber-400 opacity-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Customer Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-alt border border-hairline rounded-xl text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-amber-500/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2">
                      Your Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-surface-alt border border-hairline rounded-xl text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-amber-500/60 transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Car Model (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Car Make, Model & Year</span>
                    <span className="text-[10px] text-ink-subtle font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024 Maruti Brezza ZXi+ / 2023 Hyundai Verna"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-alt border border-hairline rounded-xl text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-amber-500/60 transition-colors"
                  />
                </div>

                {/* 5. Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Upload Car Photo / Installed Part</span>
                    <span className="text-[10px] text-ink-subtle font-normal lowercase">(optional)</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-hairline bg-black">
                      <Image src={imagePreview} alt="Review upload preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-red-600 text-white rounded-full transition-colors backdrop-blur shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-hairline hover:border-amber-400/60 bg-surface-alt/50 hover:bg-surface-alt rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group"
                    >
                      <Camera className="w-8 h-8 text-ink-subtle group-hover:text-amber-400 mb-2 transition-colors" />
                      <p className="text-xs font-bold text-ink uppercase tracking-wider mb-1">
                        Click to Upload Car Photo
                      </p>
                      <p className="text-[10px] text-ink-muted">PNG, JPG, JPEG up to 25MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* 6. Review Feedback */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-widest mb-2">
                    Your Review & Fitment Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the build quality, carbon finish, fitment accuracy, packaging, or customer service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-alt border border-hairline rounded-xl text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-amber-500/60 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Review...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Build Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-ink-subtle text-center">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Reviews are verified by RevvMotiv master technicians before publishing.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
