/** @param {NS} ns */
export async function main(ns) {
	setTimeout(function() {
		ns.tprint("I have slept for ten seconds. I should fire last.")
	}, 10000)
	setTimeout(function() {
		ns.tprint("I have slept for two seconds. I should fire second.")
	}, 2000)
	await ns.asleep(1000)
	ns.tprint("I should fire first.")
	await ns.asleep(10000) // If the main thread returns, the timeouts are cancelled

}