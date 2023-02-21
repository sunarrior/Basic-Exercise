import util from "util";
const { generatePrime } = await import("node:crypto");

const generatePrimePromise = util.promisify(generatePrime);
let p = await generatePrimePromise(64, { bigint: true });
let q = await generatePrimePromise(64, { bigint: true });

// console.log(p);
const n = p * q;

console.log(n.toString(16));
