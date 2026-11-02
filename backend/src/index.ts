import {createApp} from './app';

const port = Number(process.env.PORT ?? 3333);
const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`Cadastro+ API em http://0.0.0.0:${port}`);
});
