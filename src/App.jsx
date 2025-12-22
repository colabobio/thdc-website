import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  Globe, 
  Database, 
  FileText, 
  Cpu, 
  Share2, 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X,
  Lock,
  ChevronDown,
  User,
  Puzzle,
  BadgeQuestionMark,
  FolderCode,
  BookDashed
} from 'lucide-react';

// --- Constants ---
const PAPER_URL = "https://doi.org/10.5281/zenodo.17969781";

const TEAM_MEMBERS = [
  {
    name: "Andrés Colubri",
    role: "Founding member",
    institution: "UMass Chan Medical School / Broad Institute",
    bio: "Lead researcher focused on computational epidemiology and digital health tools for surveillance."
  },
  {
    name: "Andrea Farnham",
    role: "Founding member",
    institution: "University of Zürich",
    bio: "Focuses on epidemiology and the impact of travel on public health."
  },
  {
    name: "Regina C. LaRocque",
    role: "Founding member",
    institution: "Massachusetts General Hospital",
    bio: "Focuses on travel medicine, infectious diseases, and clinical care."
  },
  {
    name: "José Muñoz",
    role: "Founding member",
    institution: "Hospital Clínic de Barcelona / Universitat de Barcelona / ISGlobal",
    bio: "Leading expert in tropical medicine and international health."
  },
  {
    name: "Patricia Schlagenhauf",
    role: "Founding member",
    institution: "University of Zürich / WHO Collaborating Centre for Travellers' Health",
    bio: "Renowned expert in travel medicine, malaria prevention, and global health guidelines."
  }
];

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Components ---

const Navigation = ({ currentView, setCurrentView, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (currentView !== 'landing') {
      setCurrentView('landing');
      // Small timeout to allow the Landing page to render before scrolling
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const navLinks = [
    { name: 'Mission', id: 'mission' },
    { name: 'Components', id: 'components' },
    { name: 'Impact', id: 'impact' },
    { name: 'Roadmap', id: 'roadmap' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleNavClick('hero')}
        >
          <div className="bg-teal-600 text-white p-1.5 rounded-lg">
            <Globe size={24} />
          </div>
          <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-slate-800' : 'text-slate-800'}`}>
            THDC
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
            >
              {link.name}
            </button>
          ))}
          
          <button
            onClick={() => {
              setCurrentView('team');
              window.scrollTo(0, 0);
            }}
            className={`font-medium transition-colors ${currentView === 'team' ? 'text-teal-600 font-bold' : 'text-slate-600 hover:text-teal-600'}`}
          >
            Team
          </button>

          <button
            onClick={() => handleNavClick('join')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm"
          >
            Join the Initiative
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 border-t border-slate-100">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="text-left text-slate-600 font-medium py-2 border-b border-slate-50"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => {
              setCurrentView('team');
              setIsOpen(false);
              window.scrollTo(0, 0);
            }}
            className="text-left text-slate-600 font-medium py-2 border-b border-slate-50"
          >
            Team
          </button>
          <button
            onClick={() => handleNavClick('join')}
            className="bg-teal-600 text-white px-5 py-3 rounded-lg font-medium text-center mt-2"
          >
            Join Initiative
          </button>
        </div>
      )}
    </nav>
  );
};

const Team = () => {
  return (
    <section className="pt-32 pb-20 bg-slate-50 min-h-screen animate-fadeIn">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-6">
            <Users size={16} />
            Our People
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Meet the Team</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            The Travel Health Data Commons is led by a diverse group of clinicians, researchers, and technologists committed to improving global health surveillance through shared standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                {/* PLACEHOLDER LOGIC:
                  In a real app, you would use: <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                  For now, we use a nice generic icon.
                */}
                <User size={40} className="text-slate-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-teal-600 mb-2">{member.role}</p>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">{member.institution}</p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-600 mb-6">Interested in contributing to the commons?</p>
          <a href="mailto:contact@thdc.org" className="text-teal-600 font-bold hover:underline">
            Get in touch with us
          </a>
        </div>
      </div>
    </section>
  );
};

const Hero = ({ scrollToSection }) => (
  <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50">
    {/* Abstract Background Pattern */}
    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50"></div>
    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Proposal for a Data Commons
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
          Advancing Travel Medicine Through <span className="text-teal-600">Shared Digital Standards & Resources</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          We propose a <strong>Travel Health Data Commons (THDC)</strong>: an openly-governed initiative to catalyze the development of interoperable travel health tools.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={PAPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center"
          >
            Read the Perspective Pre-print
          </a>          
          <button 
            onClick={() => scrollToSection('join')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Join the Initiative <ArrowRight size={18} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce cursor-pointer text-slate-400 hover:text-teal-600 transition-colors inline-block" onClick={() => scrollToSection('mission')}>
          <ChevronDown size={32} className="mx-auto" />
        </div>

      </div>
    </div>
  </section>
);

const Mission = () => (
  <section id="mission" className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">The Problem: Rapid Innovation without Shared Standards</h2>
          <p className="text-slate-600 mb-4 text-lg leading-relaxed">
            How many international travellers get illnesses such as travellers’ diarrhoea (TD)? Studies range from 30% to 70%. The discrepancy isn't just due to biology or physiology; it's because we all use different definitions and recall windows.
          </p>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed">
            In travel medicine, the absence of common definitions and data formats makes signals noisier, comparisons harder, research slower, and surveillance weaker.
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-teal-500">
            <h3 className="font-bold text-slate-800 mb-2">Our Position</h3>
            <p className="text-slate-700 italic">
              "Not one platform, but shared standards and resources. The leverage lies between systems: aligned case definitions, core survey elements, and interoperable formats."
            </p>
          </div>
        </div>
        <div className="md:w-1/2 grid grid-cols-1 gap-4">
          <div className="bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Puzzle className="text-rose-500" size={32} />
              <h4 className="font-bold text-slate-900">Fragmentation</h4>
            </div>
            <p className="text-sm text-slate-500">Hundreds of health apps but limited interoperability.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BadgeQuestionMark className="text-blue-500" size={32} />
              <h4 className="font-bold text-slate-900">Inconsistency</h4>
            </div>
            <p className="text-sm text-slate-500">Varying definitions leading to shaky clinical evidence.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-amber-500" size={32} />
              <h4 className="font-bold text-slate-900">Incompatibility</h4>
            </div>            
            <p className="text-sm text-slate-500">Datasets siloed by different formats and protocols.</p>
          </div>
          <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-teal-600" size={32} />
              <h4 className="font-bold text-teal-900">The Solution</h4>
            </div>            
            <p className="text-sm text-teal-700">A Commons of shared standards and resources.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Components = () => {
  const components = [
    {
      icon: <FileText size={24} className="text-teal-600" />,
      title: "Consensus Definitions",
      desc: "Standard definitions for syndromes (e.g., TD, febrile illness) using established severity scales like Likert."
    },
    {
      icon: <BookDashed size={24} className="text-blue-600" />,
      title: "Template Questionnaires",
      desc: "Multilingual templates for pre-travel, during-travel, and post-travel phases with comparable core items."
    },
    {
      icon: <Cpu size={24} className="text-purple-600" />,
      title: "Pre-trained AI",
      desc: "LLMs customized for travel data collection and decision support with documented guardrails."
    },
    {
      icon: <Share2 size={24} className="text-orange-600" />,
      title: "Interoperable Data",
      desc: "HL7 FHIR profiles and standard terminologies (SNOMED CT, ICD-10, LOINC) to promote FAIR practices."
    },
    {
      icon: <FolderCode size={24} className="text-indigo-600" />,
      title: "Reference Software",
      desc: "Modules for consent, offline-first survey delivery, itinerary parsing, and de-identification."
    },
    // {
    //   icon: <ShieldCheck size={24} className="text-green-600" />,
    //   title: "Evaluation Frameworks",
    //   desc: "Guidance for accuracy, usability, equity, and privacy safeguards for AI-mediated tools."
    // },
    {
      icon: <Users size={24} className="text-rose-600" />,
      title: "Open Governance",
      desc: "Transparent versioning and community input involving clinicians, researchers, technologists, and health ethics experts."
    }
  ];

  return (
    <section id="components" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Components of the Commons</h2>
          <p className="text-slate-600 text-lg">
            THDC isn't a single app or data format. It's a set of building blocks that lowers the cost of 
            building trustworthy digital tools for travel health and facilitates global collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => (
  <section id="impact" className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
        
        <h2 className="text-3xl font-bold mb-12 relative z-10">What Could Shared Protocols Deliver?</h2>
        
        <div className="grid md:grid-cols-3 gap-10 relative z-10">
          <div>
            <div className="text-teal-400 font-bold text-xl mb-3">Consistent Data</div>
            <p className="text-slate-300">Comparable estimates of disease incidence regardless of the collection method or platform used.</p>
          </div>
          <div>
            <div className="text-teal-400 font-bold text-xl mb-3">Efficiency</div>
            <p className="text-slate-300">Reduced cost and time by reusing core components rather than rebuilding them from scratch each time.</p>
          </div>
          <div>
            <div className="text-teal-400 font-bold text-xl mb-3">Global Collaboration</div>
            <p className="text-slate-300">Rapid comparison of studies across regions and standardized benchmarking for AI models.</p>
          </div>
          <div>
            <div className="text-teal-400 font-bold text-xl mb-3">Real-Time Surveillance</div>
            <p className="text-slate-300">Immediate cross-border tracking during health crises by aggregating data from clinics and apps.</p>
          </div>
          <div>
            <div className="text-teal-400 font-bold text-xl mb-3">Ethical Standards</div>
            <p className="text-slate-300">Privacy and security by design, with equity explicitly measured in participatory surveillance.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Roadmap = () => (
  <section id="roadmap" className="py-20 bg-slate-50 border-b border-slate-200">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">A 12-Month Roadmap to Version 1.0</h2>
      <div className="space-y-8">
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-24 font-bold text-teal-600 text-right pt-1">Months 1-4</div>
          <div className="border-l-2 border-teal-200 pl-6 pb-2">
            <h4 className="font-bold text-slate-800 text-lg">Scoping Review</h4>
            <p className="text-slate-600">Map the landscape of digital/AI tools and lessons from mature governance models.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-24 font-bold text-teal-600 text-right pt-1">Months 3-8</div>
          <div className="border-l-2 border-teal-200 pl-6 pb-2">
            <h4 className="font-bold text-slate-800 text-lg">Expert Panels & Consensus</h4>
            <p className="text-slate-600">Recruit panels and run consensus rounds to define core principles and priorities.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-24 font-bold text-teal-600 text-right pt-1">Months 6-10</div>
          <div className="border-l-2 border-teal-200 pl-6 pb-2">
            <h4 className="font-bold text-slate-800 text-lg">Consortium Establishment</h4>
            <p className="text-slate-600">Formally establish the ISTM Technology Consortium with clear IP and governance.</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-24 font-bold text-teal-600 text-right pt-1">Months 11-12</div>
          <div className="border-l-2 border-teal-200 pl-6 pb-2">
            <h4 className="font-bold text-slate-800 text-lg">Strategic Launch</h4>
            <p className="text-slate-600">Present outcomes, strategic roadmap, and initial shared resources.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const JoinForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: 'Researcher',
    interest: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated yet");
      return;
    }
    
    setStatus('submitting');
    
    try {
      // Rule 1: Use specific path structure
      // Ideally this would be users/{uid}/registrations, but for a public guestbook/signup list where
      // the "admin" (you) needs to see it, we use public/data. 
      // Note: In a production app, this would be a secure Cloud Function or Write-Only collection.
      const collRef = collection(db, 'artifacts', appId, 'public', 'data', 'thdc_registrations');
      
      await addDoc(collRef, {
        ...formData,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', organization: '', role: 'Researcher', interest: '' });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setStatus('error');
    }
  };

  return (
    <section id="join" className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Join the Initiative</h2>
          <p className="text-slate-600">
            We invite clinics, public health agencies, researchers, vendors, and traveller communities to join the THDC. 
            Register below to receive updates and participate in expert panels.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Thank You!</h3>
              <p className="text-slate-600">Your registration has been received. We will be in touch with updates.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-6 text-teal-600 font-medium hover:underline"
              >
                Register another person
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Organization / Institution</label>
                <input
                  type="text"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="University of ..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                >
                  <option>Clinician</option>
                  <option>Researcher</option>
                  <option>Public Health Official</option>
                  <option>Vendor / Developer</option>
                  <option>Member of Traveller Community</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">How would you like to contribute?</label>
                <textarea
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="I'm interested in using THDC's core case definitions in my app..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md ${
                  status === 'submitting' ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                {status === 'submitting' ? 'Registering...' : 'Register for Updates'}
              </button>
              
              {status === 'error' && (
                <p className="text-red-500 text-sm text-center mt-2">Something went wrong. Please try again later.</p>
              )}
              
              <p className="text-xs text-slate-400 text-center mt-4">
                By registering, you agree to receive email updates about the THDC initiative. 
                We respect your privacy and will not share your data.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="bg-slate-800 text-teal-500 p-1.5 rounded-lg">
          <Globe size={20} />
        </div>
        <span className="text-lg font-bold text-white">THDC</span>
      </div>
      <div className="text-sm text-center md:text-right">
        <p>© {new Date().getFullYear()} Travel Health Data Commons.</p>
        <p className="mt-1">Led by the ISTM Technology Special Interest Group.</p>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'team'

  useEffect(() => {
    const initAuth = async () => {
      // Prioritize custom token if available (mostly for preview env)
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (e) {
          console.error("Custom token auth failed", e);
          await signInAnonymously(auth);
        }
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-slate-900 antialiased min-h-screen flex flex-col">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} scrollToSection={scrollToSection} />
      
      {currentView === 'landing' ? (
        <>
          <Hero scrollToSection={scrollToSection} />
          <Mission />
          <Components />
          <Benefits />
          <Roadmap />
          <JoinForm user={user} />
        </>
      ) : (
        <Team />
      )}
      
      <Footer />
    </div>
  );
};

export default App;