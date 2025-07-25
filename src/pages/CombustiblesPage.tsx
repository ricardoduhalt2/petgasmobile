import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTrashAlt, FaRecycle, FaOilCan, FaTint, FaCheckDouble, FaCheck } from 'react-icons/fa';
import { Chart, registerables } from 'chart.js';
import { useLanguage } from '../contexts/LanguageContext';

// Register Chart.js components
Chart.register(...registerables);

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/img/combustibles.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  padding: 140px 20px 100px;
  text-align: center;
  position: relative;
  margin-bottom: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNjAwIDYwMCI+PHBhdGggZmlsbD0iI2ZmYzEwNyIgZmlsbC1vcGFjaXR5PSIwLjA1IiBkPSJNNDQwIDMwMEM0NDAgMTc5LjQgMzQ4LjYgOTAgMjM1IDkwUzMwIDE3OS40IDMwIDMwMHM5MS40IDIxMCAyMDUgMjEwIDIwNS05MS40IDIwNS0yMTB6Ii8+PC9zdmc+') center/cover no-repeat;
    opacity: 0.1;
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1000px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin: 0 0 1.5rem 0;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  background: linear-gradient(90deg, #fff, #7CDA24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #0a4b2a;
  font-size: 2.2rem;
  margin: 0 0 3rem 0;
  position: relative;
  padding-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #11914B, #7CDA24);
    border-radius: 2px;
  }
`;

const ProcessSection = styled.section`
  padding: 5rem 0;
  background: #f8f9fa;
`;

// Container styles are now handled by react-bootstrap Container component

const ProcessCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ProcessCard = styled.div<{ $isVisible: boolean; $delay: number }>`
  background: white;
  border-radius: 15px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0,0,0,0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0;
  animation: ${({ $isVisible, $delay }) => 
    $isVisible ? css`${fadeIn} 0.6s ease-out ${$delay}s forwards` : 'none'
  };
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    
    .card-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 15px 30px rgba(17, 145, 75, 0.4) !important;
    }
  }
  
  .card-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(45deg, #11914B, #7CDA24);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    color: white;
    font-size: 2rem;
    box-shadow: 0 8px 20px rgba(17, 145, 75, 0.25);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  h3 {
    color: #0a4b2a;
    font-size: 1.4rem;
    margin: 0 0 1rem 0;
  }
  
  p {
    color: #4a6b57;
    line-height: 1.7;
    margin: 0;
  }
`;

const FuelsSection = styled.section`
  padding: 5rem 0;
  background: white;
`;

// Container styles are now handled by react-bootstrap Container component

const FuelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FuelCard = styled.div<{ $isVisible: boolean; $delay: number }>`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid #e0f0e6;
  opacity: 0;
  animation: ${({ $isVisible, $delay }) => 
    $isVisible ? css`${fadeIn} 0.6s ease-out ${$delay}s forwards` : 'none'
  };
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.15);
  }
`;

// Process card icon styles moved to inline styles

const FuelImage = styled.div`
  width: 100%;
  height: 250px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(10, 75, 42, 0.1) 0%, rgba(10, 75, 42, 0.4) 100%);
    transition: opacity 0.4s ease;
  }
  
  ${FuelCard}:hover &::after {
    opacity: 0.8;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    
    ${FuelCard}:hover & {
      transform: scale(1.05);
    }
  }
`;

// Fuel content styles moved to inline components

const CombustiblesPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const processSectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Trigger animation when component mounts
    setIsVisible(true);
    
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Initialize chart when component mounts
    if (chartRef.current) {
      initChart();
    }

    // Clean up chart on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [location]);

  const initChart = () => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Datos reales de la versión original
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'PETGAS ULTRA (48%)',
          'PETDIESEL (28%)',
          'Heavy PetDiesel (12%)',
          'PETFINA (5%)',
          'PETSOLEO (5%)',
          'RESIDUO (2%)'
        ],
        datasets: [{
          data: [48, 28, 12, 5, 5, 2],
          backgroundColor: [
            'rgba(17, 145, 75, 0.8)',   // Verde PETGAS
            'rgba(124, 218, 36, 0.8)',   // Verde claro PETDIESEL
            'rgba(76, 175, 80, 0.8)',    // Verde Heavy PetDiesel
            'rgba(139, 195, 74, 0.8)',   // Verde claro PETFINA
            'rgba(205, 220, 57, 0.8)',   // Amarillo PETSOLEO
            'rgba(158, 158, 158, 0.8)'   // Gris RESIDUO
          ],
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 20,
          hoverBackgroundColor: [
            'rgba(17, 145, 75, 1)',
            'rgba(124, 218, 36, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(139, 195, 74, 1)',
            'rgba(205, 220, 57, 1)',
            'rgba(158, 158, 158, 1)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            title: {
              display: true,
              text: 'Porcentaje (%)'
            }
          }
        }
      }
    });
  };

  // Proceso de conversión - Datos reales de la versión original
  const processSteps = [
    {
      id: 1,
      icon: <FaTrashAlt />,
      title: t('combustibles.step1_title'),
      description: t('combustibles.step1_description')
    },
    {
      id: 2,
      icon: <FaRecycle />,
      title: t('combustibles.step2_title'),
      description: t('combustibles.step2_description')
    },
    {
      id: 3,
      icon: <FaOilCan />,
      title: t('combustibles.step3_title'),
      description: t('combustibles.step3_description')
    },
    {
      id: 4,
      icon: <FaTint />,
      title: t('combustibles.step4_title'),
      description: t('combustibles.step4_description')
    },
    {
      id: 5,
      icon: <FaCheckDouble />,
      title: t('combustibles.step5_title'),
      description: t('combustibles.step5_description')
    }
  ];

  // Datos reales de combustibles de la versión original
  const fuels = [
    {
      id: 1,
      name: t('combustibles.petgas_ultra_name'),
      image: '/img/combustibles/petgas-ultra.png',
      description: t('combustibles.petgas_ultra_description'),
      properties: [t('combustibles.petgas_ultra_prop1'), t('combustibles.petgas_ultra_prop2')]
    },
    {
      id: 2,
      name: t('combustibles.petdiesel_name'),
      video: '/img/diesel.mp4',
      description: t('combustibles.petdiesel_description'),
      properties: [t('combustibles.petdiesel_prop1'), t('combustibles.petdiesel_prop2'), t('combustibles.petdiesel_prop3')]
    },
    {
      id: 3,
      name: t('combustibles.heavy_petdiesel_name'),
      image: '/img/combustibles/avion.png',
      description: t('combustibles.heavy_petdiesel_description'),
      properties: [t('combustibles.heavy_petdiesel_prop1'), t('combustibles.heavy_petdiesel_prop2'), t('combustibles.heavy_petdiesel_prop3')]
    },
    {
      id: 4,
      name: t('combustibles.petfina_name'),
      video: '/img/parafina.mp4',
      description: t('combustibles.petfina_description'),
      properties: [t('combustibles.petfina_prop1'), t('combustibles.petfina_prop2'), t('combustibles.petfina_prop3')]
    },
    {
      id: 5,
      name: t('combustibles.petsoleo_name'),
      image: '/img/combustibles/petdiesel.jpg',
      description: t('combustibles.petsoleo_description'),
      properties: [t('combustibles.petsoleo_prop1'), t('combustibles.petsoleo_prop2'), t('combustibles.petsoleo_prop3')]
    },
    {
      id: 6,
      name: t('combustibles.coque_name'),
      image: '/img/coque.jpeg',
      description: t('combustibles.coque_description'),
      properties: [t('combustibles.coque_prop1'), t('combustibles.coque_prop2'), t('combustibles.coque_prop3')]
    }
  ];


  return (
    <div className="combustibles-page">
      <HeroSection>
        <HeroContent>
          <HeroTitle>{t('combustibles.hero_title')}</HeroTitle>
          <HeroSubtitle>
            {t('combustibles.hero_subtitle')}
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <ProcessSection ref={processSectionRef}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10} className="text-center">
              <SectionTitle>{t('combustibles.process_title')}</SectionTitle>
              <p className="lead">
                {t('combustibles.process_subtitle')}
              </p>
            </Col>
          </Row>
          
          <ProcessCards>
            {processSteps.map((step, index) => (
              <ProcessCard 
                key={step.id}
                $isVisible={isVisible}
                $delay={index * 0.15}
                className="process-card"
              >
                <div className="card-icon">
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </ProcessCard>
            ))}
          </ProcessCards>


          {/* Sección de Ventajas Competitivas eliminada */}
        </Container>
      </ProcessSection>

      <FuelsSection>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <SectionTitle>{t('combustibles.products_title')}</SectionTitle>
              <p className="lead">
                {t('combustibles.products_subtitle')}
              </p>
            </Col>
          </Row>
          
          <FuelsGrid>
            {fuels.map((fuel, index) => (
              <FuelCard 
                key={fuel.id}
                $isVisible={isVisible}
                $delay={index * 0.15}
                className="fuel-card"
              >
                <FuelImage>
                {fuel.video ? (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseOver={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.transform = 'scale(1)';
                    }}
                  >
                    <source src={fuel.video} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : (
                  <img 
                    src={fuel.image} 
                    alt={fuel.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Usar una imagen de placeholder genérica si la principal falla
                      target.src = '/img/placeholder-plastic.jpg';
                      target.alt = `Imagen no disponible - ${fuel.name}`;
                      target.title = `Imagen ilustrativa - ${fuel.name}`;
                      // Aplicar estilos para imágenes de relleno
                      target.style.objectFit = 'cover';
                      target.style.opacity = '0.8';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                )}
              </FuelImage>
                <div className="fuel-content">
                  <h3>{fuel.name}</h3>
                  <p>{fuel.description}</p>
                  <ul className="fuel-properties">
                    {fuel.properties.map((prop, i) => (
                      <li key={i}>
                        <FaCheck style={{color: '#11914B', marginRight: '8px'}} /> {prop}
                      </li>
                    ))}
                  </ul>
                </div>
              </FuelCard>
            ))}
          </FuelsGrid>
        </Container>
      </FuelsSection>
    </div>
  );
};

export default CombustiblesPage;
