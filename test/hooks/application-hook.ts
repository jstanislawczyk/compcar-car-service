import {Application} from '../../src/application';

export const application: Application = new Application();

before(async () => {
  await application.bootstrap();
});

after(async () => {
  await application.close();
});
