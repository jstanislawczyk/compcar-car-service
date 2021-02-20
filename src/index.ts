import 'reflect-metadata';
import {Application} from './application';

const application: Application = new Application();
application.bootstrap().then();
