import { createApp } from './app';
import { env } from './config/env';


const app = createApp();

app.listen(env.API_PORT, () => {
    console.log(`Server listening on http://${env.API_HOST}:${env.API_PORT}`);
});
