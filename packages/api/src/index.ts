import { CompositionRoot } from '@efuller/api/src/shared/composition/compositionRoot';

const compositionRoot = new CompositionRoot();
const apiServer = compositionRoot.getApiServer();

async function bootstrap() {
  await apiServer.start()
    .catch((err) => {
      console.error('Server Start: ', err);
    });
}

bootstrap();