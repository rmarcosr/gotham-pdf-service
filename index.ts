import { routes } from './src/routes.ts';


const server = Bun.serve({
    port: 3000,
    routes
});

console.log(`Server running on http://localhost:${server.port}`);
