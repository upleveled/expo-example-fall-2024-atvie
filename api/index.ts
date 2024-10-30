import path from 'node:path';
import { createRequestHandler } from '@expo/server/adapter/vercel';

export default createRequestHandler({
  build: path.join(__dirname, '../dist/server'),
});
