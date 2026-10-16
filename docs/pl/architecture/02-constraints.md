# 2. Ograniczenia

| Ograniczenie                     | Powód                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Node.js 24                       | Uruchamia pliki `.ts` bezpośrednio przez usuwanie typów, bez kroku budowania |
| TypeScript, `erasableSyntaxOnly` | Usuwanie typów nie obsługuje enumów ani innej składni, która generuje kod    |
| Tylko moduły ES                  | `"type": "module"`; importy względne mają rozszerzenie `.ts`                 |
| Bez frameworka                   | Szablon nadaje się do CLI, usług i bibliotek                                 |
| PostgreSQL z Drizzle             | Popularny zestaw relacyjny; usuń go, gdy projekt nie ma bazy danych          |
| Tylko narzędzia open source      | Każde narzędzie działa lokalnie i w CI bez płatnego konta                    |
