import server from "./server/server.js";

async function main() {
    server.app.listen(server.port, () => {
        console.log("Server started on port ", server.port);
    });
}

main();
