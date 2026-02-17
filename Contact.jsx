import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, CheckCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    state: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const submitFeedback = useMutation({
    mutationFn: (data) => base44.entities.Feedback.create(data),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      setTimeout(() => {
        setFormData({
          name: "",
          district: "",
          state: "",
          email: "",
          message: ""
        });
        setSubmitted(false);
      }, 5000);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    submitFeedback.mutate(formData);
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            We'd Love to Hear From You! 💬
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? Need help? Want to share your success story? We're here for you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message 📧</CardTitle>
                <p className="text-gray-600 text-sm">
                  Fill out the form below and we'll get back to you soon!
                </p>
              </CardHeader>
              <CardContent>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-base">Your Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="mt-2 h-12"
                      />
                    </div>

                    {/* Location */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="district" className="text-base">District</Label>
                        <Input
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="Your district"
                          className="mt-2 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-base">State</Label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="mt-2 h-12 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select your state</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-base">Email (Optional)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="mt-2 h-12"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-base">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind... Ask questions, share feedback, or just say hi!"
                        required
                        rows={6}
                        className="mt-2"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitFeedback.isPending}
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 h-12 text-base"
                    >
                      {submitFeedback.isPending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Thank You! 🎉
                    </h3>
                    <p className="text-gray-600 text-lg mb-4">
                      We received your message and we'll get back to you soon with more career help!
                    </p>
                    <p className="text-sm text-gray-500">
                      Keep working towards your dreams! 💪
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Get in Touch 📞</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@careerpathai.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">1800-XXX-XXXX (Toll Free)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">Serving all of India 🇮🇳</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mission Statement */}
            <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">💚</div>
                  <h3 className="font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    To empower every rural student in India with the tools, knowledge, 
                    and confidence to achieve their career dreams - regardless of their background.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Our Impact 🌟</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Students Helped</span>
                    <span className="font-bold text-blue-600">10,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Career Paths</span>
                    <span className="font-bold text-green-600">50+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Scholarships Listed</span>
                    <span className="font-bold text-purple-600">100+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Languages Supported</span>
                    <span className="font-bold text-orange-600">7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white"
        >
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">We're Here for You, Always! 🤗</h3>
          <p className="text-lg text-purple-100">
            Your success is our success. Never hesitate to reach out - we're on this journey together!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
