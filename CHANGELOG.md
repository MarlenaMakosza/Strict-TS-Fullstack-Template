# Changelog

## [0.2.0](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/compare/v0.1.0...v0.2.0) (2026-10-17)


### Features

* add a Result type, explain the enum trade-off and drop Renovate ([#18](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/18)) ([8fa2c5b](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/8fa2c5ba0d8fea8e4443fa2df87a4bd3ef05de8f))
* log through pino in src/logger.ts ([#12](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/12)) ([2f0f2e3](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/2f0f2e379895271a0f81311002fac43b95310738))


### Documentation

* add arc42 architecture pages and coding conventions ([#10](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/10)) ([34aac3c](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/34aac3c3cf3a5fbe756c7537c175d4b819c820b8))
* bring "What you get" up to date ([#21](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/21)) ([33a3710](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/33a37109d6933fc65071f5c1179ed619461b4a6b))
* complete the arc42 sections ([#11](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/11)) ([c102e65](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/c102e651c6fb4107cade6cc271d3190afe8d00be))
* describe codebase-memory-mcp as an optional code graph for agents ([#17](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/17)) ([759a4bc](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/759a4bc7de4eca6369f6c0b0214dbeae100206ca))
* publish the documentation on GitHub Pages ([#8](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/8)) ([f4d7acf](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/f4d7acf7f6eac816d469a73cadfef13cf6968e23))
* say that CI is set up only for GitHub Actions ([#20](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/20)) ([f4e346b](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/f4e346bc7c2dedf33402277d1704a1eeed612bcb))


### Tests

* add a database integration test with Testcontainers ([#19](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/19)) ([d65e904](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/d65e9043a1e88e104870441a800b961efd21e7c6))
* add property-based tests with fast-check ([#15](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/15)) ([49e8502](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/49e85028883c98494461dc6d730fd52e5aef968b))


### CI

* add a dependency audit gate and a security policy ([#16](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/16)) ([25d2e58](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/25d2e5841fb61acb46d5267d563c62d59e47eca3))

## [0.1.0](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/compare/v0.0.1...v0.1.0) (2026-10-15)


### Features

* add commitlint config ([2131e1d](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/2131e1d483ef9ccc5cf9e8432aecda9e6ef06935))
* add CRAP and duplicated code gates ([ad0f4a7](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/ad0f4a7ae8a6063dcc0549248eef4184cb4289d8))
* enforce environment access with an Archgate ADR ([12f2db5](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/12f2db5c2404d121686eca4b9f4a5fb7e3423ec0))
* **eslint:** add markdown rules ([3907e6c](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/3907e6c94c9855d89830f756e2071a9393b681e2))
* **packages:** Add scripts to update dependencies ([176c365](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/176c3654c9ea42bfa1728365e18f36735c078e50))
* record which AI tool and model wrote each change ([#7](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/7)) ([910050d](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/910050da0d747c4fbdb7e36458468e052e05e711))


### Bug Fixes

* resolve conflicting ESLint rules for boolean assertions ([ce03b8e](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/ce03b8ecba2c86f967f92933613e6e6a9aea6865))


### Documentation

* add architect and documenter roles ([fc974c2](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/fc974c250af3cb3d35be0f14819c2cb0986521fa))
* add edge-case hunter role ([30627c1](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/30627c1c0e41888ec6892647fc23485684333a57))
* add English guide and Polish README ([0d9e460](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/0d9e460d09c0706972ad477463ce5bbebf77ae4f))
* add Polish guide to the agent workflow ([24c5690](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/24c56905e441d1eb8c99451d2fe4c4aa302f7939))
* add rules and roles for AI agents ([8a59079](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/8a59079d69190cd710d91e92f498f0dc868e007a))
* drop the Polish translation rule from the documenter role ([1105df1](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/1105df1eb9973fd02db7c9ac632239ebf5da4591))
* link the source post, add install and AI removal steps ([33e0869](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/33e0869c6a509d78683d124cf385af2dee565803))
* list every reference to remove with the AI setup ([1f77263](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/1f7726394053a073f04b96324f076d0238d8011c))
* move the documentation into docs/ with a Polish locale ([04ca0b2](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/04ca0b2e0f78fdee8ea9c4fa580215d59f2526c3))
* move the documentation into docs/ with a Polish locale ([788560f](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/788560fc9ff360682cf5cc04976f5fbf3d326237))
* point the agent rules and guides to Playwright ([127690d](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/127690d86c2702857db5fbadaa6b917a12a849a1))
* present the template for both human and AI coding ([9cf8625](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/9cf8625f618b912eaeb11fc239077002aa7c6651))
* present the template for both human and AI coding ([d73808f](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/d73808f11c9d599205802dc810105051cb5203c8))
* **readme:** update README ([16d94dd](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/16d94dd8a1af8baa31ee811346df86b514573900))
* **readme:** update README with npm check updates tool ([5fd0893](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/5fd089307bbeba7ee33536fe29a1e1448c71a179))
* rename the section of tools left out of the template ([df1ca9a](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/df1ca9afb6be8a6fcba5af8fb6d89614e3120472))
* rewrite README and document the new gates ([d32b636](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/d32b6362b0ea333ec74fa15a5fc886ce3334a6a7))
* shorten the note on the source post ([4fe2fca](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/4fe2fcaf12d57840bbace12a8eddd2a124ab9122))
* Update README.md ([a80d1a3](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/a80d1a35b8c02dbb8c7c0a948e6859abddad9876))
* Update README.md ([8294430](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/82944300a149c0d47ba248f9df7b025e909d4c3f))
* Update README.md ([2cb9123](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/2cb9123df898f3c5a348bed89f3405cfc3315bde))


### Tests

* add Gherkin end-to-end example ([e6decde](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/e6decde67b3b9060694db1bac8f62137fc4000ec))
* enforce coverage and mutation thresholds ([c9efdd8](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/c9efdd8cf8384f7297a661f17f31a68448cfd8fc))
* run Gherkin scenarios with Playwright instead of Cypress ([6695ef0](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/6695ef0af68303dff5737364872884c443fc1b0e))
* run Gherkin scenarios with Playwright instead of Cypress ([bdfb96d](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/bdfb96dfea889bff1cf7822fb2ee2eda4998321a))


### Build

* ignore the generated CHANGELOG in formatters and linters ([#6](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/6)) ([418cd51](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/418cd5147048cd0aa6f10fba3e38c06e144c64a0))


### CI

* add optional AI review by a second model ([ac35987](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/ac359878a6379fd802e8ce57f060283678da631e))
* build the docs in validate:full and CI ([be2fe78](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/be2fe78caec9319b72f73a46032371a3cfef7cb1))
* run mutation and e2e tests, add code owners ([5932503](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/5932503d0cf996c93470c922ad5b0f210c660f69))
* version releases and the CHANGELOG with release-please ([#4](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/issues/4)) ([95a9f9b](https://github.com/MarlenaMakosza/Ultimate-TS-AI-project/commit/95a9f9b928105187ebe51e79c15a7b716e91a371))
