# Testy wydajności

```sh
npm run test:perf
```

Komenda uruchamia API na porcie 3100 i przez 20 sekund obciąża je narzędziem
[k6](https://grafana.com/docs/k6/) w Dockerze: 10 wirtualnych użytkowników w kółko wysyła
`GET /api/greeting`. Potrzebujesz tylko Dockera. Na Docker Desktop (macOS, Windows) najpierw włącz
host networking w Settings > Resources > Network: k6 łączy się z API przez `--network host`. Test
jest w `tests/perf/api.ts`.

## Wynik w 10 sekund

Patrz tylko na `THRESHOLDS`:

```text
  █ THRESHOLDS

    http_req_duration{scenario:default}
    ✓ 'p(95)<200' p(95)=232.29µs

    http_req_failed{scenario:default}
    ✓ 'rate<0.01' rate=0.00%
```

- Wszędzie `✓`: jest dobrze, komenda kończy się kodem 0.
- Choć jeden `✗`: za wolno albo za dużo błędów. Komenda kończy się kodem innym niż 0.

| Linia   | Znaczy                                          | Limit    |
| ------- | ----------------------------------------------- | -------- |
| `p(95)` | 95% zapytań było szybszych niż ta wartość       | < 200 ms |
| `rate`  | Odsetek nieudanych zapytań (błąd lub brak odp.) | < 1%     |

## Reszta wyniku

Przyda się dopiero, gdy próg nie przejdzie:

- `http_reqs`: ile zapytań w sumie i na sekundę (`/s`), czyli przepustowość.
- `http_req_duration`: czasy. `avg` to średnia, `med` mediana, `max` najwolniejsze zapytanie.
  Ufaj bardziej `p(95)` niż `avg`: jedno wolne zapytanie ginie w średniej.
- `checks_failed`: zapytania, które nie odpowiedziały `200`.
- Jednostki: `µs` to mikrosekunda, `ms` milisekunda (1 ms = 1000 µs).

## Zmiana testu

Obciążenie (`vus`, `duration`) i limity (`thresholds`) zmieniasz w `options` w
`tests/perf/api.ts`. Porównuj liczby tylko z tej samej maszyny: laptop i CI dają inne czasy.
