import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLanguage } from '../../contexts/LanguageContext';

// Animación de gradiente para el texto
const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Estilo para el título con gradiente animado (MOVido fuera del componente)
const AnimatedTitle = styled.h2`
  font-size: 1.6rem;
  margin: 0 0 0.4rem 0;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(90deg, #0a9d58, #8bc34a, #ffeb3b, #8bc34a, #0a9d58);
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradient} 8s ease infinite;
  display: block;
  padding: 0 5px 2px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  letter-spacing: -0.3px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 1200px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 992px) {
    font-size: 1.4rem;
    max-width: 800px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.1;
    margin-bottom: 0.3rem;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
    letter-spacing: -0.2px;
  }
`;

// Types
interface Statistic {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
}



// Estilos simplificados para el slider
const SlideTrack = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1); /* Transición más suave */
  will-change: transform; /* Mejora el rendimiento */
  
  & > div {
    flex: 0 0 100%;
    min-width: 100%;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

// Usamos $ para indicar que son props transitorias (no se pasan al DOM)
// El componente Slide fue eliminado ya que no se estaba utilizando

// Styled components
// Estilos para el contenedor principal del slider
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 720px; /* Ajustada para bajar más el contenido */
  overflow: hidden;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 180px; /* Aumentado para bajar más el contenedor */
  
  /* Ajustes para pantallas grandes */
  @media (max-width: 1440px) {
    height: 600px;
  }
  
  /* Ajustes para laptops */
  @media (max-width: 1200px) {
    height: 550px;
  }
  
  /* Ajustes para tablets */
  @media (max-width: 992px) {
    height: 500px;
    padding-top: 80px;
  }
  
  /* Ajustes para móviles */
  @media (max-width: 768px) {
    height: 450px;
    padding-top: 60px;
  }
  
  /* Ajustes para móviles pequeños */
  @media (max-width: 480px) {
    height: 380px;
    padding-top: 50px;
  }
`;

const StatisticsSection: React.FC = () => {
  const { t } = useLanguage();
  // Image paths - Rutas de imágenes actualizadas
  const sliderImages = [
    '/img/11/fdobotellasslider.jpg',
    '/img/03/tortugaplastico1.jpg',
    '/img/04/fdoplastijuguetes.jpg',
    '/img/03/microplastics1.jpg',
    '/img/2050.png',
    '/img/Planta4k-2r.jpeg'
  ];
  
  // Verificar rutas de imágenes
  console.log('Rutas de imágenes del slider:', sliderImages);

  // Verificar existencia de imágenes (solo en desarrollo)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sliderImages.forEach(img => {
        const imgElement = new Image();
        imgElement.src = img;
        imgElement.onload = () => console.log(`Imagen cargada: ${img}`);
        imgElement.onerror = () => console.error(`Error al cargar imagen: ${img}`);
      });
    }
  }, []);

  const statisticsData: Statistic[] = useMemo(() => [
    {
      id: 1,
      title: t('statistics.stat1_title'),
      description: t('statistics.stat1_description'),
      image: sliderImages[0],
      alt: "Botellas de plástico apiladas"
    },
    {
      id: 2,
      title: t('statistics.stat2_title'),
      description: t('statistics.stat2_description'),
      image: sliderImages[1],
      alt: "Tortuga marina afectada por plásticos"
    },
    {
      id: 3,
      title: t('statistics.stat3_title'),
      description: t('statistics.stat3_description'),
      image: sliderImages[2],
      alt: "Juguetes de plástico"
    },
    {
      id: 4,
      title: t('statistics.stat4_title'),
      description: t('statistics.stat4_description'),
      image: sliderImages[3],
      alt: "Microplásticos en el océano"
    },
    {
      id: 5,
      title: t('statistics.stat5_title'),
      description: t('statistics.stat5_description'),
      image: sliderImages[4],
      alt: "Predicción de plásticos en el océano para 2050"
    },
    {
      id: 6,
      title: t('statistics.stat6_title'),
      description: t('statistics.stat6_description'),
      image: sliderImages[5],
      alt: "Planta de transformación de plásticos"
    }
  ], [sliderImages, t]);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  // Note: isLastTwoSlides was removed as it was not being used
  const timeoutRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Function to go to the next slide
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % statisticsData.length);
    
    // Programar la siguiente transición
    if (isPlaying && !isHovered) {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 5000); // 5 segundos por slide
    }
  }, [statisticsData.length, isPlaying, isHovered]);
  
  // Function to go to a specific slide
  const goToSlide = useCallback((index: number) => {
    // Limpiar timeout existente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Asegurar que el índice esté dentro de los límites
    if (index < 0) {
      index = statisticsData.length - 1;
    } else if (index >= statisticsData.length) {
      index = 0;
    }
    
    // Actualizar la diapositiva actual
    setCurrentSlide(index);
    
    // Iniciar el autoplay si está habilitado y no hay hover
    if (isPlaying && !isHovered) {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 5000);
    }
  }, [statisticsData.length, isPlaying, isHovered, nextSlide]);
  
  // Iniciar autoplay al montar y cuando cambia el estado de hover
  useEffect(() => {
    if (isPlaying && !isHovered) {
      // Limpiar timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Iniciar el ciclo de transiciones
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 5000);
    }
    
    // Limpieza al desmontar o cuando cambian las dependencias
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPlaying, isHovered, nextSlide]);
  
  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  
  // Debug current slide and hover state
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Estado actual - Diapositiva:', currentSlide + 1, 'de', statisticsData.length, '- Hover:', isHovered);
      console.log('Intervalo activo:', timeoutRef.current !== null);
    }
  }, [currentSlide, isHovered, statisticsData.length]);
  
  // Manejar el estado de hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (isPlaying && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        nextSlide();
      }, 5000);
    }
  }, [isPlaying, nextSlide]);
  

  
  // Intersection Observer for entrance animation
  useEffect(() => {
    const currentRef = sliderRef.current;
    if (currentRef) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-slide-in');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(currentRef);
      
      return () => observer.disconnect();
    }
    return undefined;
  }, []);
  
  // Función para reproducir sonido (actualmente deshabilitada por restricciones del navegador)
  // Se mantiene como referencia para una implementación futura con interacción del usuario
  
  // La animación de gradiente se ha movido directamente al estilo del componente AnimatedTitle

  

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div ref={sliderRef}>
        <SliderContainer 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <SlideTrack style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${statisticsData.length * 100}%`
          }}>
            {statisticsData.map((stat) => (
              <div 
                key={stat.id} 
                style={{
                  flex: '0 0 100%',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${stat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: '#000',
                  filter: 'brightness(0.7)'
                }} />
                <div style={{
                  maxWidth: '900px',
                  width: '90%',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  margin: '0 auto 30px',
                  transform: 'translateY(40px)',
                  boxSizing: 'border-box',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'auto'
                }}>
                  <AnimatedTitle>{stat.title}</AnimatedTitle>
                  <p style={{
                    fontSize: '0.8rem',
                    lineHeight: '1.25',
                    margin: '0.2rem auto 0',
                    maxWidth: '800px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 400,
                    color: '#ffffff',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center',
                    padding: '0 10px',
                    width: '100%',
                    boxSizing: 'border-box',
                    letterSpacing: '0.3px', /* Espaciado de letras más ajustado */
                    textTransform: 'uppercase', /* Texto en mayúsculas para mejor legibilidad */
                    opacity: 0.95 /* Ligera transparencia para efecto moderno */
                  }}>
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </SlideTrack>
        </SliderContainer>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
        padding: '8px 12px',
        borderRadius: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
      }}>
        {statisticsData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentSlide ? '24px' : '12px',
              height: '12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: index === currentSlide ? '#0a4b2a' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            aria-label={`Ir a la diapositiva ${index + 1}`}
            aria-current={index === currentSlide ? 'step' : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticsSection;
