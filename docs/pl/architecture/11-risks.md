# 11. Ryzyka i dług techniczny

| Ryzyko                                                  | Skutek                                                            | Co zrobić                                                 |
| ------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------- |
| `@stryker-mutator/vitest-runner` nie obsługuje Vitest 5 | Stryker używa wolniejszego command runnera                        | Wrócić do niego po naprawie stryker-js #6210              |
| Darmowe modele AI na OpenRouter pojawiają się i znikają | Opcjonalne review przez AI nie działa, dopóki nie zmienisz modelu | Zmienić `AI_REVIEW_MODEL`                                 |
| Brak CI na release PR                                   | Wymagane checki zablokowałyby jego merge                          | Bypass w rulesecie albo osobisty token dla release-please |
| `BREAKING CHANGE:` w opisie pull requesta               | Squash merge podbija wersję major                                 | Pisać to tylko przy prawdziwych zmianach łamiących        |
| Agenci pracują z konta opiekunki projektu               | "Require review from Code Owners" nie zadziała                    | Dać agentom własne konto, jeśli review jest wymagane      |
