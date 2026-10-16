# 2. Constraints

| Constraint                       | Reason                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| Node.js 24                       | Runs `.ts` files directly by stripping the types, with no build step |
| TypeScript, `erasableSyntaxOnly` | Type stripping cannot handle enums or other emitted syntax           |
| ES modules only                  | `"type": "module"`; relative imports carry the `.ts` extension       |
| No framework                     | The template stays usable for CLIs, services and libraries           |
| PostgreSQL with Drizzle          | A common relational setup; remove it when a project has no database  |
| Open source tools only           | Every tool runs locally and in CI without a paid account             |
