# Performance tests

```sh
npm run test:perf
```

It starts the API on port 3100 and loads it with [k6](https://grafana.com/docs/k6/) in Docker for
20 seconds: 10 virtual users ask for `GET /api/greeting` again and again. You need Docker, nothing
else. On Docker Desktop (macOS, Windows), turn on host networking in Settings > Resources >
Network first: k6 reaches the API through `--network host`. The test is in `tests/perf/api.ts`.

## Read the result in 10 seconds

Look only at `THRESHOLDS`:

```text
  █ THRESHOLDS

    http_req_duration{scenario:default}
    ✓ 'p(95)<200' p(95)=232.29µs

    http_req_failed{scenario:default}
    ✓ 'rate<0.01' rate=0.00%
```

- `✓` everywhere: OK, the command exits with 0.
- One `✗`: too slow or too many errors. The command exits with a code other than 0.

| Line    | Means                                         | Limit    |
| ------- | --------------------------------------------- | -------- |
| `p(95)` | 95% of requests were faster than this         | < 200 ms |
| `rate`  | Share of failed requests (error or no answer) | < 1%     |

## The rest of the output

You need it only when a threshold fails:

- `http_reqs`: how many requests in total, and per second (`/s`), the throughput.
- `http_req_duration`: the times. `avg` is the mean, `med` the middle, `max` the slowest one.
  Trust `p(95)` more than `avg`: one slow request hides in the mean.
- `checks_failed`: requests that did not answer `200`.
- Units: `µs` is a microsecond, `ms` a millisecond (1 ms = 1000 µs).

## Change the test

Change the load (`vus`, `duration`) or the limits (`thresholds`) in `options` in
`tests/perf/api.ts`. Compare numbers only from the same machine: a laptop and CI give different
times.
