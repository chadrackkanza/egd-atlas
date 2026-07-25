import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: true });

// Données mock stockées en mémoire.
let exportsData = [
  { id: 1, title: 'Carte Santé Kintambo', zone: 'Kintambo', format: 'PDF', date: '2026-06-20' },
  { id: 2, title: 'Carte Éducation Kinshasa', zone: 'Kinshasa', format: 'PDF', date: '2026-06-18' },
];

let historyData = [
  { id: 1, title: 'Export PDF', meta: 'Zone: Kintambo', date: '2026-06-20' },
  { id: 2, title: 'Export PNG', meta: 'Zone: Joli-Parc', date: '2026-06-17' },
];

const stats = {
  ecoles: 45,
  centresSante: 12,
  pointsEau: 38,
  population: '125 430',
  superficie: '8,45 km²',
};

fastify.get('/api/stats', async (request, reply) => {
  return stats;
});

// Redirige la racine vers le serveur de développement frontend pour rendre la visite de la racine du backend utile.
fastify.get('/', async (request, reply) => {
  const frontendPort = process.env.FRONTEND_PORT || 3000;
  const target = `http://localhost:${frontendPort}/`;
  reply.redirect(target);
});

fastify.get('/api/history', async (request, reply) => {
  return historyData;
});

fastify.get('/api/exports', async (request, reply) => {
  return exportsData;
});

fastify.post('/api/exports', async (request, reply) => {
  const body = request.body || {};
  const id = exportsData.length ? exportsData[0].id + 1 : 1;
  const item = {
    id,
    title: body.title || `Carte ${id}`,
    zone: body.zone?.territoire || 'Inconnue',
    format: body.format || 'PDF',
    date: new Date().toISOString().split('T')[0],
  };
  exportsData.unshift(item);
  historyData.unshift({ id, title: `Export ${item.format}`, meta: `Zone: ${item.zone}`, date: item.date });
  reply.code(201);
  return item;
});

fastify.post('/api/client-log', async (request, reply) => {
  const body = request.body || {};
  fastify.log.info({ clientLog: body }, 'client log');
  reply.code(204).send();
});

const port = Number(process.env.BACKEND_PORT || 8000);
await fastify.listen({ port, host: '0.0.0.0' });
console.log(`Serveur API mock prêt sur http://localhost:${port}`);
