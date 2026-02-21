// tests/load/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp up to 20 users
    { duration: '1m',  target: 20 },   // hold at 20 users
    { duration: '30s', target: 0  },   // ramp down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // <1% error rate
    http_req_duration: ['p(95)<500'],   // 95% of requests under 500ms
  },
};

export default function () {
  const res = http.get(__ENV.TARGET_URL + '/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
