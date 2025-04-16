/** @param {NS} ns **/

export function PortsHackable(ns) {	//get crackable ports
	let portcrack = 0;
	if (ns.fileExists("BruteSSH.exe", "home")) {	//check portcrack number
		++portcrack;
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		++portcrack;
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		++portcrack;
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		++portcrack;
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		++portcrack;
	}
	return (portcrack);
}
/** @param {NS} ns **/

export function TargetFinder(ns) {	//find target with most money
	let maxmoney = 0;
	let target = '';
	const playerhacklvldivider = 2;
	const arraylist = ["n00dles", "foodnstuff", "sigma-cosmetics", "joesguns", "hong-fang-tea", "harakiri-sushi", "iron-gym", "nectar-net", "CSEC", "max-hardware", "zer0", "phantasy", "omega-net", "neo-net", "silver-helix", "netlink", "avmnite-02h", "computek", "johnson-ortho", "the-hub", "crush-fitness", "zb-institute", "catalyst", "I.I.I.I", "rothman-uni", "syscore", "summit-uni", "aevum-police", "millenium-fitness", "alpha-ent", "rho-construction", "lexo-corp", "aerocorp", "global-pharm", "snap-fitness", "galactic-cyber", "omnia", "deltaone", "unitalife", "solaris", "icarus", "zeus-med", "defcomm", "univ-energy", "infocomm", "zb-def", "taiyang-digital", "nova-med", "titan-labs", "microdyne", "run4theh111z", "applied-energetics", "fulcrumtech", "helios", "vitalife", "stormtech", "4sigma", "omnitek", "kuai-gong", ".", "clarkinc", "b-and-a", "nwo", "powerhouse-fitness", "blade", "fulcrumassets", "ecorp", "megacorp", "The-Cave"];
	//ns.tprint(arraylist[i] + ns.getServerMaxMoney(arraylist[i]) + ns.getServerRequiredHackingLevel(arraylist[i]));
	for (let i = 0; i <= arraylist.length - 1; ++i) {
		//		ns.tprint(arraylist[i]);
		if (ns.getServerRequiredHackingLevel(arraylist[i]) <= Math.ceil(ns.getHackingLevel() / playerhacklvldivider) && ns.getServerMaxMoney(arraylist[i]) > maxmoney && ns.getServerNumPortsRequired(arraylist[i]) <= PortsHackable(ns)) {
			//if server hack lvl < player hack lvl + more money than old server
			target = arraylist[i];
			maxmoney = ns.getServerMaxMoney(target);
			ns.printf(target + ' ' + maxmoney + ' ' + ns.getServerRequiredHackingLevel(target));
		}
	}
	return (target);
}

export function docbypass() {	//bypasses ram cost of document
	return eval('document');
}

export function TerminalExecute(doc, cmd) {	//function for executing stuff in terminal
	const terminalInput = doc.getElementById("terminal-input");	// Acquire a reference to the terminal text field
	terminalInput.value = cmd;	// Set the value to the command you want to run.
	const handler = Object.keys(terminalInput)[1];	// Get a reference to the React event handler.
	terminalInput[handler].onChange({ target: terminalInput });	// Perform an onChange event to set some internal values.
	terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });	// Simulate an enter press
}

export function threadcount(ns, script, server = ns.getHostname()) {	//function for getting threadcount
	const threadcount = Math.floor((ns.getServerMaxRam(server)) / ns.getScriptRam(script));
	if (threadcount < 0) { threadcount = 0 }
	return threadcount;
}

export function hostnames(ns) {//gets all server names
	let templist = [];
	templist = ns.scan('home');
	let i = 0;
	let j = 0;
	let k = 0;
	let arraylist = templist;
	while (i <= arraylist.length - 1) {	//go thru whole of arraylist
		templist = ns.scan(arraylist[i]);
		//		ns.tprint(templist, arraylist);
		j = 0;
		while (j <= templist.length - 1) {
			k = 0;
			while (k <= arraylist.length - 1) {
				if (templist[j] == arraylist[k]) {
					//ns.tprint(templist[j], arraylist[k]);
					templist.splice(j, 1);
				}
				++k;
			}
			++j;
		}
		//ns.tprint(templist);
		arraylist.push(...templist);	//create array from templist, ...spreads 
		++i;
	}
	return (arraylist);
}