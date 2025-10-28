import { RouteTest } from "./types";

const routesTests: RouteTest[] = [
  {
    description: "shoud return 200",
    url: "/explorer",
    method: "get",
    expectedStatus: 200,
  },
];

export default routesTests;
