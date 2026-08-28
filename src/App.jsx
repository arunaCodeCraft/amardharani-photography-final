import { useState, useRef } from 'react'
import heroVideo from './assets/videos/hero-wedding.mp4'
import gallery1 from './assets/gallery/gallery-1.jpg'
import gallery2 from './assets/gallery/gallery-2.jpg'
import gallery3 from './assets/gallery/gallery-3.jpg'
import gallery4 from './assets/gallery/gallery-4.jpg'
import gallery5 from './assets/gallery/gallery-5.jpg'
import service1 from './assets/services/service-1.jpg'
import service2 from './assets/services/service-2.jpg'
import service3 from './assets/services/service-3.jpg'
import story1 from './assets/stories/story-1.jpg'
import story2 from './assets/stories/story-2.jpg'
import story3 from './assets/stories/story-3.jpg'
import story4 from './assets/stories/story-4.jpg'
import aboutImage from './assets/about/about.jpg'
import team1 from './assets/team/team-1.jpg'
import team2 from './assets/team/team-2.jpg'
import logoFooter from './assets/logo-footer.svg'
import logo from './assets/logo.jpg'
/**
 * AMARDHARANI PHOTOGRAPHY WEBSITE
 * Consolidated production-ready implementation
 * 
 * All sections, functionality, and interactivity in one main file
 * for clarity and simplicity.
 * 
 * Features:
 * - Cinematic video hero
 * - Responsive design (mobile, tablet, desktop)
 * - Enquiry form with validation
 * - Google Apps Script integration
 * - Phone/WhatsApp/Email functionality
 * - Smooth scrolling navigation
 */

// ============================================================
// VALIDATION UTILITIES
// ============================================================

const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')

  // Accept 10-digit Indian mobile number
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return true
  }

  // Also accept +91XXXXXXXXXX / 91XXXXXXXXXX
  if (/^91[6-9]\d{9}$/.test(cleaned)) {
    return true
  }

  return false
}

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateRequired = (value) => {
  return value && value.trim().length > 0
}

const validateEventDate = (dateString) => {
  if (!dateString) return false
  const selectedDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

const validateForm = (formData) => {
  const errors = {}
  if (!validateRequired(formData.name)) errors.name = 'Full name is required'
  if (!validateRequired(formData.phone)) errors.phone = 'Phone number is required'
  else if (!validatePhone(formData.phone)) errors.phone = 'Please enter a valid Indian phone number'
  if (!validateRequired(formData.email)) errors.email = 'Email address is required'
  else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address'
  if (!validateRequired(formData.eventType)) errors.eventType = 'Please select an event type'
  if (!validateRequired(formData.eventDate)) errors.eventDate = 'Event date is required'
  else if (!validateEventDate(formData.eventDate)) errors.eventDate = 'Event date must be in the future'
  if (!validateRequired(formData.location)) errors.location = 'Event location is required'
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

const normalizePhoneNumber = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.length === 10) return '+91' + cleaned
  if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned
  return cleaned.startsWith('+') ? cleaned : '+91' + cleaned
}

// ============================================================
// API SERVICE
// ============================================================

const submitEnquiry = async (formData) => {
  const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL
  
  if (!APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL not configured')
  }

  const payload = {
    name: formData.name,
    phone: normalizePhoneNumber(formData.phone),
    email: formData.email,
    eventType: formData.eventType,
    eventDate: formData.eventDate,
    location: formData.location,
    message: formData.message || '',
    submittedAt: new Date().toISOString(),
    source: 'Amardharani Photography Website',
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    return { success: true, message: 'Enquiry submitted successfully' }
  } catch (error) {
    console.error('Enquiry submission error:', error)
    throw new Error('Failed to submit enquiry. Please try again.')
  }
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function App() {
  // ============================================================
  // STATE
  // ============================================================
  
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    location: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ============================================================
  // REFS
  // ============================================================
  
  const heroRef = useRef(null)
  const storiesRef = useRef(null)
  const servicesRef = useRef(null)
  const aboutRef = useRef(null)
  const teamRef = useRef(null)
  const enquiryButtonRef = useRef(null)
  const footerRef = useRef(null)

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleOpenEnquiry = () => setIsEnquiryOpen(true)
  
  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false)
    if (enquiryButtonRef.current) enquiryButtonRef.current.focus()
  }

  const handleNavigation = (section) => {
    const refs = { home: heroRef, stories: storiesRef, services: servicesRef, about: aboutRef, team: teamRef }
    setIsMobileMenuOpen(false)
    
    
  if (section === 'contact') {
    window.open(
      'https://wa.me/919442236843?text=Hello%20Amardharani%20Photography,%20I%20would%20like%20to%20enquire%20about%20wedding%20photography',
      '_blank'
    )
    } else if (refs[section]?.current) {
      refs[section].current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const { isValid, errors: validationErrors } = validateForm(formData)
    
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await submitEnquiry(formData)
      setSubmitStatus('success')
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: '',
        eventDate: '',
        location: '',
        message: '',
      })
      setErrors({})

      setTimeout(() => handleCloseEnquiry(), 3000)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExploreStories = () => {
    storiesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="bg-warm-ivory">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-black/10 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-8 md:px-20 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
           <img
             src={logo}
            alt="Amardharani Photography"
            className="h-10 sm:h-12 w-auto max-w-[190px] object-contain"
            loading="eager"
          />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Home', id: 'home' },
              { label: 'Stories', id: 'stories' },
              { label: 'Services', id: 'services' },
              { label: 'About', id: 'about' },
              { label: 'Team', id: 'team' },
              { label: 'Contact', id: 'contact' },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigation(link.id)}
                className={`text-xs font-semibold tracking-wider transition-colors ${
                  link.id === 'home' 
                    ? 'text-gold relative' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
                {link.id === 'home' && (
                  <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"></span>
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <button
            ref={enquiryButtonRef}
            onClick={handleOpenEnquiry}
            className="hidden lg:block bg-white text-black px-6 py-3 text-xs font-semibold tracking-wider hover:bg-gold transition-colors"
          >
            LET'S CREATE YOUR STORY
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-deep-black border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Stories', id: 'stories' },
                { label: 'Services', id: 'services' },
                { label: 'About', id: 'about' },
                { label: 'Team', id: 'team' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.id)}
                  className="block w-full text-left text-sm font-semibold text-white hover:text-gold transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* ========== HERO ========== */}
        <section
  ref={heroRef}
  className="relative min-h-screen bg-deep-black overflow-hidden"
>
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              poster="/hero-poster.jpg"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
          </div>

          {/* Hero Content */}
         <div className="relative min-h-screen flex items-center justify-center z-10 px-5 pt-24 pb-16">
            <div className="w-full max-w-6xl mx-auto text-center flex flex-col items-center">
              <p className="text-gold text-xs font-semibold tracking-widest mb-6">
                AMARDHARANI PHOTOGRAPHY
              </p>

              <p className="text-white/80 text-xs font-semibold tracking-wider mb-12">
                WEDDING PHOTOGRAPHY • FILMS • CANDID • DRONE
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleExploreStories}
                  className="bg-gold text-black px-8 py-4 text-xs font-semibold tracking-wider hover:bg-gold/90 transition-colors"
                >
                  EXPLORE OUR STORIES
                </button>
                <button
                  onClick={handleOpenEnquiry}
                  className="border-2 border-white text-white px-8 py-4 text-xs font-semibold tracking-wider hover:bg-white/10 transition-colors"
                >
                  ENQUIRE NOW
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
            <div className="w-px h-6 bg-white/40 mb-2"></div>
            <svg className="w-4 h-4 text-white/60 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* ========== INTRODUCTION ========== */}
        <section className="bg-light-beige py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold-dark text-xs font-semibold tracking-wider mb-6">
              THE ART OF REMEMBERING
            </p>

            <h2 className="font-playfair text-3xl md:text-4xl mb-8 leading-tight">
              <span className="block">WE DON'T JUST CAPTURE</span>
              <span className="block">MOMENTS.</span>
              <span className="italic text-gray-600">WE PRESERVE THE FEELING.</span>
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              With over 18 years of experience, we have mastered the art of visual storytelling. 
              We believe every couple has a unique rhythm, and our goal is to document your 
              day exactly how it felt—authentic, raw, and beautifully yours.
            </p>

            <div className="flex justify-center">
              <div className="h-px w-24 bg-champagne-gold"></div>
            </div>
          </div>
        </section>

        {/* ========== FEATURED STORIES ========== */}
        <section ref={storiesRef} data-section="stories" className="bg-cream py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-gold-dark text-xs font-semibold tracking-wider mb-4">
                REAL MOMENTS, REAL LOVE
              </p>
              <h2 className="font-playfair text-4xl md:text-5xl mb-8">
                FEATURED STORIES
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {[
                { id: 1, couple: 'Arun & Priya', location: 'Chennai, Tamil Nadu' },
                { id: 2, couple: 'Rahul & Divya', location: 'Coimbatore, Tamil Nadu' },
                { id: 3, couple: 'Karthik & Sneha', location: 'Ooty, Nilgiris' },
                { id: 4, couple: 'Vignesh & Harini', location: 'Madurai, Tamil Nadu' },
              ].map((story) => (
                <div
                  key={story.id}
                  className={`group cursor-pointer ${
                    story.id === 2 ? 'md:translate-y-32' : ''
                  } ${
                    story.id === 4 ? 'md:translate-y-16' : ''
                  }`}
                >
                  <div className="overflow-hidden bg-gray-300 mb-4 h-96">
                    <img
                      src={[story1, story2, story3, story4][story.id - 1]}
                      alt={`${story.couple}'s wedding`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h3 className="font-playfair text-2xl mb-2 text-black">
                      {story.couple}
                    </h3>
                    <p className="text-gray-600 text-xs font-semibold tracking-wider">
                      {story.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SERVICES ========== */}
        <section ref={servicesRef} data-section="services" className="bg-deep-black py-24 px-8 md:px-20 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl text-white mb-6">
                TIRUCHENGODE SERVICES
              </h2>
              <p className="text-gold text-xs font-semibold tracking-wider">
                CRAFTED WITH PRECISION
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: '01', title: 'WEDDING\nPHOTOGRAPHY' },
                { number: '02', title: 'CINEMATIC\nFILMS' },
                { number: '03', title: 'DRONE &\nAERIAL STORIES' },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="group relative h-96 overflow-hidden cursor-pointer"
                >
                  <img
                    src={[service1, service2, service3][idx]}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>

                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    {service.number !== '01' && (
                      <p className="text-gold text-base mb-4">{service.number}</p>
                    )}
                    <h3 className="font-playfair text-2xl md:text-3xl mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <button className="flex items-center gap-2 text-white text-base font-light hover:text-gold transition-colors">
                      <span>DISCOVER MORE</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== WHY AMARDHARANI ========== */}
        <section ref={aboutRef} data-section="about" className="bg-light-beige flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 min-h-96">
            <img
              src={aboutImage}
              alt="Amardharani Photography team"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="md:w-1/2 flex items-center py-24 px-8 md:px-20">
            <div className="max-w-xl">
              <h2 className="font-playfair text-3xl md:text-4xl mb-12 leading-tight">
                <span className="block">EXPERIENCE BEHIND</span>
                <span className="block">EVERY FRAME</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  { title: '18 YEARS', description: 'Of mastering the art of capturing authentic emotions and timeless stories.' },
                  { title: 'AUTHENTIC STORYTELLING', description: 'Focusing on candid, unposed moments that reflect your true essence.' },
                  { title: 'PREMIUM EQUIPMENT', description: 'Utilizing state-of-the-art cameras and lenses for uncompromising quality.' },
                  { title: 'PHOTO • FILM • DRONE', description: 'Comprehensive coverage from every angle to tell your complete story.' },
                ].map((highlight, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-gold-dark font-base font-semibold text-base">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== JOURNEY ========== */}
        <section className="bg-cream py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl mb-6">
                OUR JOURNEY
              </h2>
              <p className="text-gold-dark text-xs font-semibold tracking-wider">
                A DECADE OF LOVE
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -translate-y-1/2"></div>

              {/* Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[
                  { year: '2008', title: 'THE BEGINNING', description: 'First steps into professional photography.' },
                  { year: '2012', title: 'GROWTH', description: 'Expanding our visual narrative.' },
                  { year: '2016', title: 'EXPANSION', description: 'Introducing cinematic wedding films.' },
                  { year: '2020', title: 'NEW ERA', description: 'Embracing drone and aerial stories.' },
                  { year: 'TODAY', title: 'AMARDHARANI PHOTOGRAPHY', description: 'A legacy of preserving feelings.' },
                ].map((milestone, idx) => (
                  <div key={idx} className="relative pt-12">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0">
                      {milestone.year === 'TODAY' ? (
                        <div className="w-4 h-4 rounded-full bg-deep-black border-2 border-gold-dark"></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gold-dark"></div>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-playfair text-2xl mb-2">
                        {milestone.year}
                      </h3>
                      <p className="text-gold-dark text-sm font-semibold mb-2">
                        {milestone.title}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== TEAM ========== */}
        <section ref={teamRef} data-section="team" className="bg-light-beige py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl mb-6">
                THE VISIONARIES
              </h2>
              <p className="text-gold-dark text-xs font-semibold tracking-wider">
                MEET THE TEAM
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-4xl mx-auto">
              {[
                { name: 'AMARNATH', role: 'Founder & Lead Photographer' },
                { name: 'HEMAPRIYAN', role: 'Cinematic Storyteller' },
              ].map((member, idx) => (
                <div key={idx} className="text-center">
                  <div className="aspect-[3/4] overflow-hidden bg-gray-300 mb-6">
                    <img
                      src={[team1, team2][idx]}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="font-playfair text-2xl mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gold-dark text-base font-light">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== QUOTE ========== */}
        <section className="relative bg-deep-black py-32 px-8 md:px-40 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 opacity-30">
            <img
              src="/placeholder-quote-bg.jpg"
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto text-center">
            <blockquote className="mb-8">
              <p className="font-playfair italic text-3xl md:text-4xl text-white leading-tight mb-8">
                "THE DAY MAY END.
                <span className="block">THE FEELING SHOULD NEVER."</span>
              </p>
            </blockquote>

            <footer className="text-gold text-sm font-light tracking-widest">
              — AMARDHARANI PHOTOGRAPHY
            </footer>
          </div>
        </section>

        {/* ========== GALLERY ========== */}
        <section className="bg-cream py-24 px-8 md:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-playfair text-4xl md:text-5xl mb-6">
                FROM OUR LENS
              </h2>
              <p className="text-gold-dark text-xs font-semibold tracking-wider">
                A GLIMPSE INTO OUR WORLD
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className={`overflow-hidden bg-gray-300 ${
                  idx === 1 ? 'md:col-span-1 md:row-span-2' : ''
                } ${
                  idx === 2 ? 'md:col-span-1 md:row-span-2' : ''
                } ${
                  idx === 5 ? 'md:col-span-1 md:row-span-2' : ''
                } ${
                  idx === 4 ? 'md:col-span-2' : ''
                }`}>
                  <img
                    src={[gallery1, gallery2, gallery3, gallery4, gallery5][idx - 1]}
                    alt={`Gallery image ${idx}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <a
                href="https://www.instagram.com/amardharaniphotography?igsi=MW9yanMyMnU0NmV1Zg=="
                className="border-2 border-deep-black text-deep-black px-8 py-4 text-xs font-semibold tracking-wider hover:bg-deep-black hover:text-white transition-colors"
              >
                FOLLOW OUR JOURNEY
              </a>
            </div>
          </div>
        </section>

        {/* ========== FINAL CTA ========== */}
        <section className="relative bg-deep-black py-32 px-8 md:px-40 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/placeholder-cta-bg.jpg"
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl text-white mb-12 leading-tight">
              YOUR STORY IS NEXT.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOpenEnquiry}
                className="bg-gold text-black px-8 py-4 text-xs font-semibold tracking-wider hover:bg-gold/90 transition-colors"
              >
                LET'S CREATE YOUR STORY
              </button>
              <a
                 href="tel:+919976655036"
                 className="border-2 border-white text-white px-8 py-4 text-xs font-semibold tracking-wider hover:bg-white/10 transition-colors inline-block"
              >
                CONTACT AMARDHARANI
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="bg-deep-black text-white pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-8 md:px-20">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/20">
            {/* Logo Section */}
            <div>
              <img
                src={logo}
                alt="Amardharani Photography"
                className="h-16 w-auto mb-4"
                loading="lazy"
              />
              <p className="text-gold text-xs font-semibold tracking-wider">
                CAPTURING LOVE. PRESERVING STORIES.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-base font-light mb-6">CONTACT</h4>
              <div className="space-y-4">
                <a href="tel:+919976655036" className="text-white/80 text-base hover:text-gold transition-colors">
                  +91 99766 55036
                </a>
                <a href="tel:+919442236843" className="block text-white/80 text-base hover:text-gold transition-colors">
                  +91 94422 36843
                </a>
                <a href="mailto:amardharaniphotography@gmail.com" className="block text-white/80 text-base hover:text-gold transition-colors">
                  amardharaniphotography@gmail.com
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white text-base font-light mb-6">SOCIAL</h4>
              <div className="space-y-4">
                <a href="https://www.instagram.com/amardharaniphotography?igsi=MW9yanMyMnU0NmV1Zg==" className="block text-white/80 text-base hover:text-gold transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-6">
            <p className="text-white/60 text-xs">
              © {new Date().getFullYear()} AMARDHARANI PHOTOGRAPHY. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <a href="#privacy" className="text-white/60 text-xs hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-white/60 text-xs hover:text-gold transition-colors">
                Terms of Service
              </a>
            </div>
          </div>

          {/* WhatsApp CTA */}
          
        </div>
      </footer>

      {/* ========== ENQUIRY MODAL ========== */}
      {isEnquiryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseEnquiry()}
          role="presentation"
        >
          <div
            className="bg-white w-full max-w-2xl max-h-screen overflow-y-auto relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={handleCloseEnquiry}
              className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="p-8 md:p-12">
              <h2 className="font-playfair text-4xl md:text-5xl text-black mb-4">
                LET'S CREATE YOUR STORY
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Tell us about your special day and we'll get back to you with our packages and availability.
              </p>

              {/* Form */}
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-green-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="font-playfair text-2xl mb-4">THANK YOU!</h3>
                  <p className="text-gray-700 text-lg mb-2">Your enquiry has been received.</p>
                  <p className="text-gray-600">Our team will contact you shortly.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-red-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <h3 className="font-playfair text-2xl mb-4">OOPS!</h3>
                  <p className="text-gray-700 text-lg mb-6">We couldn't send your enquiry right now.</p>
                  <p className="text-gray-600 mb-8">Please try again or call us directly.</p>
                  <button
                    onClick={() => setSubmitStatus(null)}
                    className="bg-gold text-black px-6 py-2 text-xs font-semibold tracking-wider hover:bg-gold/90 transition-colors"
                  >
                    TRY AGAIN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold`}
                      placeholder="Enter 10-digit mobile number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Event Type */}
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-semibold text-gray-900 mb-2">
                      Event Type *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.eventType ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold bg-white`}
                    >
                      <option value="">Select an event type</option>
                      {[
                        'Wedding Photography',
                        'Candid Photography',
                        'Wedding Film',
                        'Drone Photography / Videography',
                        'Pre-Wedding',
                        'Full Wedding Package',
                        'Other',
                      ].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-900 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.eventDate ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold`}
                    />
                    {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                      Event Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 border ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-gold`}
                      placeholder="City, State or Venue"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                      placeholder="Tell us more about your vision..."
                    ></textarea>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 text-xs font-semibold tracking-wider transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gold text-black hover:bg-gold/90'
                    }`}
                  >
                    {isSubmitting ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
                  </button>

                  {/* Contact Alternative */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm mb-3">
                      Prefer to talk directly? Call us anytime.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="tel:+919976655036"
                        className="text-gold font-semibold hover:text-gold/80 transition-colors"
                      >
                        +91 99766 55036
                      </a>
                      <span className="text-gray-400">•</span>
                      <a
                        href="tel:+919442236843"
                        className="text-gold font-semibold hover:text-gold/80 transition-colors"
                      >
                        +91 94422 36843
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
