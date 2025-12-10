import collision from "../../data/collision.json";

export const demoObstacles = (collision.blocked as [number, number][]).map(([x, y]) => ({ x, y }));
