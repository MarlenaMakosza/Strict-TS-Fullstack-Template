import type { Options } from 'k6/options';

import { check, sleep } from 'k6';
import http from 'k6/http';

const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:3000';
const START_ATTEMPTS = 100;
const POLL_INTERVAL_S = 0.1;
const OK = 200;

// The run fails when a threshold fails: k6 exits with a code other than 0. The thresholds count
// only the load, not the startup polls in setup().
export const options: Options = {
  duration: '20s',
  thresholds: {
    'http_req_duration{scenario:default}': ['p(95)<200'],
    'http_req_failed{scenario:default}': ['rate<0.01'],
  },
  vus: 10,
};

/** Waits for the API: npm starts it next to k6, so it may not answer yet. */
export function setup(): void {
  for (let attempt = 0; attempt < START_ATTEMPTS; attempt += 1) {
    if (http.get(`${BASE_URL}/api/health`).status === OK) {
      return;
    }

    sleep(POLL_INTERVAL_S);
  }

  throw new Error(`The API at ${BASE_URL} did not start`);
}

/** One virtual user asks for a greeting, again and again. */
export default function greeting(): void {
  const response = http.get(`${BASE_URL}/api/greeting?name=Ada`);

  check(response, { 'status is 200': answer => answer.status === OK });
}
