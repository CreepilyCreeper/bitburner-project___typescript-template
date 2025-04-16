import { NS } from "@ns";

export async function main(ns: NS) {
  const target = ns.args[0] as string;
  ns.disableLog('ALL');
  ns.print("ns.getServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
  ns.print("ns.getServerSecurityLevel: " + ns.getServerSecurityLevel(target));
  ns.print("ns.getServerMaxMoney: " + ns.getServerMaxMoney(target));
  ns.print("ns.getServerMoneyAvailable: " + ns.getServerMoneyAvailable(target));
  ns.enableLog('ALL');
  while ((ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target))) {
    await ns.weaken(target);
  }
  while ((ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) || (ns.getServerMaxMoney(target) > ns.getServerMoneyAvailable(target))) {
    await ns.grow(target);
    await ns.weaken(target);
  }
  ns.disableLog('ALL');
  ns.print("\n\n\n" + target + " prepared");
  ns.print("ns.getServerMinSecurityLevel: " + ns.getServerMinSecurityLevel(target));
  ns.print("ns.getServerSecurityLevel: " + ns.getServerSecurityLevel(target));
  ns.print("ns.getServerMaxMoney: " + ns.getServerMaxMoney(target));
  ns.print("ns.getServerMoneyAvailable: " + ns.getServerMoneyAvailable(target));
  ns.enableLog('ALL');
}