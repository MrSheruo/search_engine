import server from "./server/server.js";
import { seed } from "./preprocessing/seed.js";

async function main() {
    // seed
    await seed();

    server.app.listen(server.port, () => {
        console.log("Server started on port ", server.port);
    });
}

main();