// utils/constants.ts

import { KnowledgeBase, ContactInfo } from "@/types/chatbot";

export const ADMIN_PASS: string = "adamas2024admin";

export const contactInfo: ContactInfo = {
  phone: "+91-33-2559-5000",
  email: "info@adamasuniversity.ac.in",
  address: "Barasat-Barrackpore Road, Kolkata - 700126",
  hours: "9:00 AM - 5:00 PM (Mon-Sat)",
};

export const fallbackResponse: string[] = [
  "I apologize, but I don't have specific information about your query in my current knowledge base.",
  "",
  "For accurate and detailed information, please contact Adamas University directly:",
  `📞 Phone: ${contactInfo.phone}`,
  `📧 Email: ${contactInfo.email}`,
  `📍 Address: ${contactInfo.address}`,
  `🕒 Office Hours: ${contactInfo.hours}`,
  "",
  "Our admission counselors will be happy to assist you with personalized information!",
];

export const defaultKnowledgeBase: KnowledgeBase = {
  greeting: {
    keywords: [
      "hello",
      "hi",
      "hey",
      "start",
      "help",
      "good morning",
      "good afternoon",
      "good evening",
    ],
    response: [
      "Welcome to Adamas University! 🎓",
      "",
      "I'm your intelligent assistant, here to help you discover everything about our prestigious institution.",
      "",
      "I can provide information about:",
      "• Admission procedures and eligibility criteria",
      "• Comprehensive course catalog and specializations",
      "• Fee structure and scholarship opportunities",
      "• World-class campus facilities and amenities",
      "• Industry partnerships and placement records",
      "• Student life and extracurricular activities",
      "",
      "How may I assist you today?",
    ],
  },
  admission: {
    keywords: [
      "admission",
      "apply",
      "application",
      "eligibility",
      "entrance",
      "how to apply",
      "requirements",
      "documents",
      "process",
    ],
    response: [
      "Adamas University Admission Process:",
      "",
      "🎯 Application Steps:",
      "• Complete online application form",
      "• Submit required academic documents",
      "• Appear for program-specific entrance examination (if required)",
      "• Attend counseling session (if shortlisted)",
      "• Final admission based on merit and availability",
      "",
      "📋 General Eligibility: Varies by program (10+2 for UG, Graduate degree for PG) with minimum percentage requirements.",
      "",
      `📞 For personalized guidance: ${contactInfo.phone}`,
      `📧 Email: ${contactInfo.email}`,
    ],
  },
  courses: {
    keywords: [
      "courses",
      "programs",
      "degree",
      "btech",
      "mtech",
      "bba",
      "mba",
      "subjects",
      "stream",
      "engineering",
      "management",
      "curriculum",
      "bachelor",
      "master",
    ],
    response: [
      "🎓 Academic Programs at Adamas University:",
      "",
      "🔧 Engineering & Technology: B.Tech (CSE, ECE, ME, CE, EE, IT), M.Tech (Specialized branches)",
      "",
      "💼 Management & Commerce: BBA, MBA with multiple specializations, Integrated programs",
      "",
      "🎨 Liberal Arts & Sciences: BA, MA, B.Sc, M.Sc in various disciplines",
      "",
      "⚖️ Professional Programs: Law (LLB, LLM), Pharmacy (B.Pharm, M.Pharm), Architecture",
      "",
      `For detailed curriculum and admission criteria: ${contactInfo.phone}`,
    ],
  },
  contact: {
    keywords: [
      "contact",
      "phone",
      "email",
      "address",
      "location",
      "reach",
      "visit",
      "directions",
    ],
    response: [
      "📍 Contact Adamas University:",
      "",
      `📞 Main Office: ${contactInfo.phone}`,
      `📧 General Inquiries: ${contactInfo.email}`,
      `🏛️ Campus Address: ${contactInfo.address}`,
      `🕒 Office Hours: ${contactInfo.hours}`,
      "",
      "🚗 How to Reach: Well-connected by road and rail. Nearest railway station: Barasat.",
      "",
      "Our team is always ready to assist you!",
    ],
  },
};

export const QUICK_ACTIONS: string[] = [
  "Admission Process",
  "Available Courses",
  "Contact Information",
  "Scholarships",
];
