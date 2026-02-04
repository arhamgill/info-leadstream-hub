"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { CheckCircle2, Shield, Phone, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reviews, setReviews] = useState<{ id: string; url: string }[]>([]);
  const [formData, setFormData] = useState({
    markets: [] as string[],
    agentType: "",
    agencySize: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consent: false,
  });

  const markets = [
    "Auto Insurance",
    "Medicare Supplement",
    "Final Expense",
    "Mortgage Protection",
    "ACA / Marketplace Health",
    "Turning 65 (T-65)",
    "Medicare Advantage",
  ];

  const trustPoints = [
    { icon: Users, text: "100% Social Media Generated" },
    { icon: Phone, text: "Phone-Verified Leads" },
    { icon: Shield, text: "TCPA-Compliant" },
    { icon: CheckCircle2, text: "Built for Licensed Agents" },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const scrollToForm = () => {
    document
      .getElementById("form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMarket = (market: string) => {
    setFormData((prev) => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter((m) => m !== market)
        : [...prev.markets, market],
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Keep success message visible - don't reset
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-[#ededed] overflow-x-hidden">
      {/* Logo */}
      <div className="flex justify-center top-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={36}
          className=""
        />
      </div>

      {/* Hero Section */}
      <div
        id="form-section"
        className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-8 max-w-full"
      >
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-5xl mx-auto">
          {/* Left Side - Title */}
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight break-words">
              Close More Deals with Social-Generated,{" "}
              <span className="text-[#00d4ff]">Phone-Verified</span> Insurance
              Leads
            </h1>
            <p className="text-base text-gray-300 leading-relaxed">
              Exclusive, compliant insurance leads built for licensed agents and
              agencies.
            </p>

            {/* Trust Points */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {trustPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-[#00d4ff] flex-shrink-0" />
                    <span className="text-sm text-gray-200">{point.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              onClick={scrollToForm}
              className="mt-6 bg-[#00d4ff] text-[#0a0f1a] px-6 py-3 rounded-full font-semibold text-base hover:bg-[#00b8e6] transition-colors flex items-center space-x-2 w-fit"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Side - Multi-Step Form */}
          <div className="bg-gradient-to-br from-[#1e2740] to-[#151d30] rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,212,255,0.15)] border-2 border-[#00d4ff]/30 w-full max-w-full backdrop-blur-sm">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                      currentStep >= step
                        ? "bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] text-[#0a0f1a]"
                        : "bg-gray-700/50 text-gray-400 border border-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1.5 mx-2 rounded-full ${
                        currentStep > step
                          ? "bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]"
                          : "bg-gray-700/50"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-8"
                >
                  <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    Your information has been received. Our team will review
                    your details and reach out to you within 24 hours to discuss
                    exclusive lead opportunities tailored to your markets.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-2 text-[#00d4ff] text-sm">
                      <Phone className="w-4 h-4" />
                      <span>Expect a call from our team soon!</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Markets Served */}
              {!success && currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Markets Served
                  </h2>
                  <div className="space-y-2">
                    {markets.map((market) => (
                      <label
                        key={market}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={formData.markets.includes(market)}
                          onChange={() => toggleMarket(market)}
                          className="w-4 h-4 rounded border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                        />
                        <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                          {market}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={formData.markets.length === 0}
                    className="w-full mt-6 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Step 2: Agent Type */}
              {!success && currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Agent Type
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="agentType"
                        value="Individual Agent"
                        checked={formData.agentType === "Individual Agent"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agentType: e.target.value,
                            agencySize: "",
                          })
                        }
                        className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                      />
                      <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                        Individual Agent
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="agentType"
                        value="Agency"
                        checked={formData.agentType === "Agency"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agentType: e.target.value,
                          })
                        }
                        className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                      />
                      <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                        Agency
                      </span>
                    </label>

                    {formData.agentType === "Agency" && (
                      <div className="ml-7 space-y-2 mt-3">
                        {[
                          "2–5 agents",
                          "6–15 agents",
                          "16–50 agents",
                          "50+ agents",
                        ].map((size) => (
                          <label
                            key={size}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="radio"
                              name="agencySize"
                              value={size}
                              checked={formData.agencySize === size}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  agencySize: e.target.value,
                                })
                              }
                              className="w-4 h-4 border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                            />
                            <span className="text-sm group-hover:text-[#00d4ff] transition-colors">
                              {size}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !formData.agentType ||
                        (formData.agentType === "Agency" &&
                          !formData.agencySize)
                      }
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-[#0a0f1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent outline-none text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        !formData.firstName ||
                        !formData.lastName ||
                        !formData.email ||
                        !formData.phone
                      }
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Consent */}
              {!success && currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center mb-4">
                    Review & Consent
                  </h2>
                  <div className="bg-[#0a0f1a] p-4 rounded-lg space-y-3 border border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Markets:</p>
                      <p className="text-sm text-white">
                        {formData.markets.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Agent Type:</p>
                      <p className="text-sm text-white">
                        {formData.agentType}
                        {formData.agencySize && ` (${formData.agencySize})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Contact:</p>
                      <p className="text-sm text-white">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-white">{formData.email}</p>
                      <p className="text-sm text-white">{formData.phone}</p>
                    </div>
                  </div>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) =>
                        setFormData({ ...formData, consent: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded border-gray-600 text-[#00d4ff] focus:ring-[#00d4ff] focus:ring-offset-[#0f172a]"
                      required
                    />
                    <span className="text-xs text-gray-300 leading-relaxed">
                      By clicking Submit, I agree to the Privacy Policy and
                      Terms of Service, and consent to receive communications
                      from LeadStream Hub LLC via calls, texts, emails, or
                      automated messages. Consent is not a condition of
                      purchase.
                    </span>
                  </label>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!formData.consent || submitting}
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit & Get Contacted"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 py-16 max-w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mb-12 break-words">
          Reviews From Clients
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              No reviews available yet
            </div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <Image
                  src={review.url}
                  alt={`Review ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-full">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Lead Stream Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
