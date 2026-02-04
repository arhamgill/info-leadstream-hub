"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckCircle2, Shield, Phone, Users, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
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
    "Final Expense",
    "Medicare Advantage",
    "Medicare Supplement",
    "Turning 65 (T-65)",
    "ACA / Marketplace Health",
    "Auto Insurance",
    "Mortgage Protection",
  ];

  const reviewImages = [
    "/reviews/next js website 1.png",
    "/reviews/next js website 2.png",
    "/reviews/Screenshot (23).png",
    "/reviews/Screenshot (24).png",
    "/reviews/Screenshot (25).png",
    "/reviews/Screenshot (27).png",
    "/reviews/Screenshot (29).png",
    "/reviews/Screenshot (30).png",
    "/reviews/Screenshot (31).png",
    "/reviews/Screenshot (32).png",
    "/reviews/Screenshot (33).png",
    "/reviews/Screenshot (34).png",
  ];

  const trustPoints = [
    { icon: Users, text: "100% Social Media Generated" },
    { icon: Phone, text: "Phone-Verified Leads" },
    { icon: Shield, text: "TCPA-Compliant" },
    { icon: CheckCircle2, text: "Built for Licensed Agents" },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
  };

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-[#ededed]">
      {/* Logo */}
      <div className="flex justify-center pt-6 pb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={36}
          className="object-contain"
        />
      </div>

      {/* Hero Section */}
      <div id="form-section" className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
          {/* Left Side - Title */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl leading-tight">
              Close More Deals with Social-Generated,{" "}
              <span className="text-[#00d4ff]">Phone-Verified</span> Insurance
              Leads
            </h1>
            <p className="text-base text-gray-300 leading-relaxed">
              Exclusive, compliant insurance leads built for licensed agents and
              agencies.
            </p>

            {/* Trust Points */}
            <div className="space-y-4 pt-4">
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

            {/* CTA Link */}
            <div
              onClick={scrollToForm}
              className="mt-6 flex items-center space-x-2 text-[#00d4ff] hover:text-[#00b8e6] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-base font-medium">Get Started Now</span>
            </div>
          </div>

          {/* Right Side - Multi-Step Form */}
          <div className="bg-[#0f172a] rounded-xl p-6 shadow-2xl border border-gray-800">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      currentStep >= step
                        ? "bg-[#00d4ff] text-[#0a0f1a]"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? "bg-[#00d4ff]" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Markets Served */}
              {currentStep === 1 && (
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
              {currentStep === 2 && (
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
              {currentStep === 4 && (
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
                      disabled={!formData.consent}
                      className="flex-1 bg-[#00d4ff] text-[#0a0f1a] py-3 rounded-lg font-semibold text-sm hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit & Get Contacted
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl lg:text-4xl text-center mb-12">
          What other agents are saying
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {reviewImages.map((image, index) => (
            <motion.div
              key={index}
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
                src={image}
                alt={`Review ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Lead Stream Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
