import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  TrendingUp,
  Cloud,
  Filter,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

export function LandingPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [demoRef, demoInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const benefits = [
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-[#FF9900]" />,
      title: "Análisis rápido de miles de productos",
      description: "Procesa grandes listas de productos en pocos minutos, no en horas",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-[#FF9900]" />,
      title: "Compatible con Amazon y proximamente con Walmart",
      description: "Analiza oportunidades en los mayores marketplaces",
    },
    {
      icon: <Filter className="w-8 h-8 text-[#FF9900]" />,
      title: "Filtros avanzados",
      description: "ROI, rank, fees y más métricas para decisiones precisas",
    },
    {
      icon: <Cloud className="w-8 h-8 text-[#FF9900]" />,
      title: "Sin instalación",
      description: "Accede desde cualquier lugar, todo en la nube",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Vendedor en Amazon",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      content: "Scanlist.pro me ahorró horas de trabajo cada semana. Ahora puedo analizar cientos de productos en minutos.",
    },
    {
      name: "María González",
      role: "Emprendedora Digital",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      content: "La precisión del análisis es increíble. He encontrado productos rentables que antes pasaba por alto.",
    },
    {
      name: "David Smith",
      role: "Wholesale Seller",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      content: "La mejor inversión para mi negocio. El ROI de usar Scanlist.pro fue positivo desde el primer mes.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-orange-50/30" />
          <div className="absolute right-0 bottom-0 w-full h-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full h-full bg-[#041E42] bg-cover bg-center opacity-10"
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#041E42] mb-6"
          >
            Convierte tus listas de productos en{" "}
            <span className="text-[#FF9900]">oportunidades rentables</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Escanea tus archivos CSV y descubre qué productos son ganadores en Amazon y Walmart — en segundos.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-[#FF9900] text-white font-semibold text-lg hover:bg-[#e88a00] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Empieza gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        ref={benefitsRef}
        initial="hidden"
        animate={benefitsInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 rounded-xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-[#041E42] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Demo Section */}
      <motion.section
        ref={demoRef}
        initial="hidden"
        animate={demoInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#041E42] mb-4">
              Cómo funciona Scanlist.pro
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sube tu lista, obtén insights valiosos y toma decisiones informadas en minutos
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
              alt="Demo Scanlist.pro"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041E42]/80 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Análisis en tiempo real</h3>
                <p className="text-lg opacity-90">
                  Visualiza métricas clave, tendencias y oportunidades de manera instantánea
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        ref={testimonialsRef}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={staggerChildren}
        className="py-24 bg-white px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#041E42] mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Únete a cientos de vendedores que ya optimizaron su negocio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-[#041E42]">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-24 bg-[#041E42] px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Crea tu cuenta y empieza gratis hoy mismo
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Únete a la comunidad de vendedores exitosos que ya optimizaron su proceso de sourcing
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-[#FF9900] text-white font-semibold text-lg hover:bg-[#e88a00] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Comenzar ahora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#041E42] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Scanlist.pro</h3>
              <p className="text-white/70">
                Herramienta de análisis para vendedores de Amazon y Walmart
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-white/70 hover:text-white">Inicio</Link></li>
                <li><Link to="/login" className="text-white/70 hover:text-white">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="text-white/70 hover:text-white">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white">Privacidad</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Términos</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-white">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/70">
            <p>© 2025 Scanlist.pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}