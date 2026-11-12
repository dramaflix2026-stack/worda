# WORLDA — viagens imersivas

Protótipo independente em Next.js da primeira experiência: **Copacabana, Rio de Janeiro**.

## O que já funciona

- Landing page responsiva com entrada no destino.
- Roteiro editorial de cinco capítulos (marcadores de uma caminhada conceitual de 15 minutos).
- Botões de avançar/voltar, pausa do roteiro, alternância entre modo guiado e exploração e seleção de capítulos.
- Texto contextual do guia.
- Visualizador Pannellum 360° quando uma imagem panorâmica licenciada é configurada.
- Placeholder claramente identificado enquanto não há imagem 360° real.

## Ainda não funciona

- Caminhada contínua ao longo de uma rota real, reprodução de vídeo ou áudio, narração de IA, perguntas respondidas por LLM, tempo de reprodução automático, sincronização de progresso, multi-cenas e VR.
- Os cinco capítulos não são coordenadas GPS, nem representam um percurso georreferenciado.

## Executar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse http://localhost:3000.

## Configurar panorama real

Adicione a `.env.local`:

```bash
NEXT_PUBLIC_COPA_PANORAMA_URL=https://seu-dominio.com/copacabana-360.jpg
```

Use um JPG equiretangular 2:1 com autorização comercial e acesso CORS. O mesmo panorama será exibido em todos os capítulos até que façamos o registro de cenas distintas por parada. A biblioteca Pannellum é carregada via CDN nesta primeira prova de conceito e exige conexão com a internet.

**Não copie imagens do Google Street View, Disney ou vídeos de terceiros sem as permissões cabíveis.**

## Roadmap

1. Obter um panorama 360° real e licenciado de Copacabana.
2. Criar um grafo de cenas com coordenadas/hotspots e navegação entre panoramas.
3. Integrar trecho de vídeo 360° em movimento ou sequência de panoramas gravados.
4. Criar API de guia com conteúdo histórico referenciado e controles de custo.
5. Integrar TTS, progressão persistida e testes com usuários.
6. Avaliar WebXR e perfis de desempenho para headset.

## Aviso

Este protótipo usa arte gerada por CSS como placeholder; não é imagem autêntica de Copacabana. Os textos do guia são ilustrativos. WORLDA é nome provisório.
