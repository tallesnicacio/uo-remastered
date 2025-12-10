# Repository Guidelines

## Project Structure & Module Organization
- Work inside `ServUO/` (solution root). `Server/` hosts the core C# engine (`Server.csproj`), networking, persistence, and entrypoint. `Scripts/` holds gameplay logic (items, spells, quests, services); mirror its folder taxonomy when adding new systems. `Config/` stores server settings (`Server.cfg`, `*.cfg`)—keep environment-specific values out of source control. `Data/`, `Spawns/`, `RevampedSpawns/`, and `SpawnsOld/` provide world data and spawn layouts. `Ultima/` contains client asset readers and supporting utilities. The `makefile`, `_windebug.bat`, and `_winrelease.bat` orchestrate builds and runtime flags.

## Build, Test, and Development Commands
- Linux/macOS: `cd ServUO && make debug` for a debug build with verbose console; `make` or `make release` for optimized binaries. Windows: `_windebug.bat` for debug, `_winrelease.bat` for release. When needed, `dotnet build ServUO.sln` (Mono/.NET SDK 10+) also produces binaries. Before running, review `Config/Server.cfg` and related `*.cfg` to set data paths and ports. Launch the built server from `ServUO/` (e.g., `mono ServUO.exe` on Unix or `ServUO.exe` on Windows).

## Coding Style & Naming Conventions
- `.editorconfig` enforces UTF-8, spaces, 4-space indents, trailing whitespace cleanup, and final newlines. Use PascalCase for types, methods, and public members; camelCase for locals/parameters; prefix private fields with `_` only if already present in the edited file. Follow existing namespace and folder patterns in `Scripts/` to keep features discoverable. Prefer small, focused scripts with descriptive class names (e.g., `VoidPoolController`, `HousePlacementTool`).

## Testing Guidelines
- No automated test suite is present; validate changes by running the server with `make debug` (or `_windebug.bat`) and exercising the affected system in-game. For spawn/config changes, load into a local world and watch the console for warnings or serialization errors. Include reproduction steps and observed results in your change notes.

## Commit & Pull Request Guidelines
- Use concise, imperative commit subjects similar to repo history (`Regained linux compability`, `readme fix`). Optional scope prefixes are welcome (`Scripts: fix pet res`). Para PRs, inclua: resumo, issue/feature link, impacto de configs (`Config/*.cfg`), migrations de dados/saves, e testes manuais (comandos/áreas). Prints/Gumps apenas para mudanças de UI. Não commitar segredos.

## Progresso Atual (MVP)
- Servidor Bun: login/ping/chat/target/kill/move com validação de mapa/colisão; snapshots periódicos; regen de HP/Mana/Stamina; persistência de sessão (memória).
- Cliente: Canvas renderer com sombras/animação, pathfinding A* com fila de passos, seleção/tooltip, overlay/log/status, chat, HUD (HP/Mana/Stamina/EXP), feedback visual de erro.
- Comandos: `/ping`, `/who`, `/kill <id>`; clique direito move (fila), clique esquerdo inspeciona/target.
