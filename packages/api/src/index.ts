import { CompositionRoot, Environment } from '@efuller/api/src/shared/composition/compositionRoot';

const env = process.env.NODE_ENV || 'production';

const compositionRoot = new CompositionRoot(env as Environment);
const apiServer = compositionRoot.getApiServer();

async function bootstrap() {
  await apiServer.start()
    .catch((err) => {
      console.error('Server Start: ', err);
    });
}

bootstrap();