#!/usr/bin/env node
/**
 * Generates admin console credentials for .env.local / the host environment.
 *
 *   pnpm admin:credentials            # prompts for the password (hidden)
 *
 * Prints ADMIN_PASSWORD_HASH (scrypt) and a fresh ADMIN_SESSION_SECRET.
 * The plain password is never written anywhere.
 */
import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline";

const N = 16384, r = 8, p = 1, KEY_LENGTH = 64;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : "");
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

let password = process.env.ADMIN_PASSWORD_INPUT; // for non-interactive use (CI); avoid shell history
if (!password) {
  password = await ask("Admin password: ", { hidden: true });
  const again = await ask("Repeat password: ", { hidden: true });
  if (password !== again) {
    console.error("Passwords don't match.");
    process.exit(1);
  }
}
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const key = await new Promise((resolve, reject) =>
  scrypt(password, salt, KEY_LENGTH, { N, r, p, maxmem: 256 * N * r }, (e, k) => (e ? reject(e) : resolve(k))),
);

console.log("\nAdd these to .env.local (or your host's environment):\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${key.toString("base64url")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
console.log("\nAlso set ADMIN_USERNAME. Changing ADMIN_SESSION_SECRET signs everyone out.\n");
