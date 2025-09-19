# 🏛️ LegalEase AI

**Intelligent Legal Document Analysis Platform**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

LegalEase AI is a cutting-edge web application that leverages artificial intelligence to analyze legal documents, extract key insights, identify risks, and provide comprehensive legal analysis. Built for lawyers, legal professionals, and businesses who need quick and accurate document analysis.

## ✨ Key Features

### 🔍 **Smart Document Analysis**
- **AI-Powered Analysis**: Advanced document processing using Google's Gemini Pro AI
- **Multi-Format Support**: Upload PDFs, Word documents, and text files
- **OCR Technology**: Extract text from scanned documents and images
- **Risk Assessment**: Automatic identification of legal risks and compliance issues

### 📊 **Comprehensive Dashboard**
- **Document Management**: Organize and track all your analyzed documents
- **Analytics & Insights**: Visual representation of document statistics
- **Risk Breakdown**: Categorized risk analysis (High, Medium, Low)
- **Recent Activity**: Track document uploads and analysis history

### 🔐 **Secure & Professional**
- **User Authentication**: Secure login system with NextAuth.js
- **Data Privacy**: Firebase-powered secure document storage
- **Multi-User Support**: Individual user accounts with isolated data
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices

### 🤖 **Interactive Features**
- **Document Chat**: Ask questions about your analyzed documents
- **Comparative Analysis**: Compare multiple legal documents
- **Key Point Extraction**: Automatic identification of important clauses
- **Deadline Detection**: Find and highlight critical dates and deadlines

## 🚀 Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons

### **Backend & AI**
- **Google Gemini Pro** - Advanced AI for document analysis
- **Next.js API Routes** - Serverless backend functions
- **NextAuth.js** - Authentication and session management
- **Tesseract.js** - OCR for text extraction from images

### **Database & Storage**
- **Firebase Firestore** - NoSQL database for document storage
- **Firebase Admin SDK** - Server-side Firebase operations
- **Secure File Processing** - In-memory document processing

### **Development & Deployment**
- **Vercel** - Production deployment and hosting
- **ESLint** - Code linting and formatting
- **Git** - Version control

## 📋 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nikshep-root/legalease-ai.git
   cd legalease-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # Google Gemini AI
   GEMINI_API_KEY=your-gemini-api-key

   # Firebase Configuration
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PROJECT_ID=your-firebase-project-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### **Document Upload & Analysis**
1. Sign up or log in to your account
2. Navigate to the "Upload Document" page
3. Select your legal document (PDF, Word, or image)
4. Wait for AI analysis to complete
5. Review comprehensive analysis results

### **Dashboard Overview**
- View all your analyzed documents
- Monitor document statistics and risk breakdowns
- Access recent activity and quick actions
- Navigate to detailed document views

### **Document Management**
- Search through your document library
- Filter documents by type, risk level, or date
- Delete unwanted documents
- Export analysis results

## 🛡️ Security & Privacy

- **End-to-End Security**: All documents are processed securely
- **User Data Isolation**: Each user's data is completely isolated
- **No Data Retention**: Documents are processed in-memory when possible
- **Secure Authentication**: Industry-standard authentication practices
- **GDPR Compliant**: Privacy-focused data handling

## 🤝 Contributing

We welcome contributions to LegalEase AI! Please feel free to submit issues, feature requests, or pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, feature requests, or questions:
- Create an issue in this repository
- Contact: [support@legalease-ai.com]

## 🔮 Roadmap

- [ ] Advanced contract comparison features
- [ ] Integration with popular legal databases
- [ ] Real-time collaboration tools
- [ ] Mobile app development
- [ ] API access for third-party integrations
- [ ] Advanced reporting and export options

---

**LegalEase AI** - Transforming legal document analysis with the power of artificial intelligence.
