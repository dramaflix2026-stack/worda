export type Stop = { id: string; title: string; subtitle: string; minute: number; story: string; prompt: string; panorama?: string };

// These are editorial chapters, not a claimed GPS-accurate walking track.
export const stops: Stop[] = [
  { id: 'boas-vindas', title: 'Bem-vindo a Copacabana', subtitle: 'Nossa primeira parada', minute: 0, story: 'Bem-vindo a Copacabana, uma das paisagens mais reconhecidas do Rio de Janeiro. Antes de avançarmos, observe a praia e imagine os sons do mar. Você está livre para parar e explorar quando quiser.', prompt: 'O que torna Copacabana tão conhecida?' },
  { id: 'calcadao', title: 'O desenho do calçadão', subtitle: 'Cultura e paisagem', minute: 3, story: 'O desenho ondulado em pedras portuguesas é um dos símbolos da orla. Observe como o passeio faz parte da paisagem e da vida cotidiana do bairro.', prompt: 'Qual é a história do calçadão de Copacabana?' },
  { id: 'orla', title: 'Vida na orla', subtitle: 'Pessoas, esporte e encontros', minute: 6, story: 'A praia é um espaço de encontros. Observe a relação entre o mar, as atividades ao ar livre e os usos públicos da orla.', prompt: 'Como é a vida cotidiana em Copacabana?' },
  { id: 'arquitetura', title: 'A cidade ao redor', subtitle: 'Arquitetura e memória', minute: 10, story: 'Agora olhe para a cidade do outro lado da avenida. A orla mistura edifícios, hotéis, comércio e memórias de diferentes épocas.', prompt: 'Como Copacabana cresceu ao longo do tempo?' },
  { id: 'despedida', title: 'Seu próximo horizonte', subtitle: 'A viagem continua', minute: 13, story: 'Nossa primeira jornada chega ao fim. Você pode voltar a qualquer capítulo, contemplar o cenário ou descobrir novos destinos no futuro.', prompt: 'Que outros lugares do Rio vale conhecer?' },
];
export const totalMinutes = 15;
