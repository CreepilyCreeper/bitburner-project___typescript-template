/** @param {NS} ns */
export async function main(ns) {
  if (ns.args[1]) ns.sleep(ns.args[1]);
  await ns.hack(ns.args[0]);
}