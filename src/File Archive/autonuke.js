/** @param {NS} ns */
export async function main(ns) {
  //method is to use a queue(targets), Breadth First Search
  //scan, remove host from result then add to queue(targets)
  //once scanned: move onto next in queue(targets)
  //end when targets has been completely scanned, no more added to queue
  let home = 'home';
  let targets = new Array;
  targets = targets.concat(ns.scan(home));
  //ns.tprint(targets);

  for (let i = 0; i < targets.length; i++) {
    //await ns.sleep(50);
    let temptargets = ns.scan(targets[i]);
    let deleted = temptargets.splice(0, 1);
    //ns.tprint('deleted:'+deleted);
    targets = targets.concat(temptargets);
    //ns.tprint(i + '      ' + targets);
    if (i >= 100) {
      ns.tprint('\n\n\nINF LOOP\n\n\n');
      break;
    }
  }
  ns.tprint('Target Count: ' + targets.length + '\nList: ' + targets );
  ns.tprint('');
  //ns.tprint('\nHAVE ROOT ACCESS TO:')
  let targetsnuked = new Array;
  for (let i = 0; i < targets.length; i++) {
    let portsOpened = 0;
    if (ns.fileExists("brutessh.exe", home)) {ns.brutessh(targets[i]); portsOpened++;}
    if (ns.fileExists("ftpcrack.exe", home)) {ns.ftpcrack(targets[i]); portsOpened++;}
    if (ns.fileExists("relaysmtp.exe", home)) {ns.relaysmtp(targets[i]); portsOpened++;}
    if (ns.fileExists("httpworm.exe", home)) {ns.httpworm(targets[i]); portsOpened++;}
    if (ns.fileExists("sqlinject.exe", home)) {ns.sqlinject(targets[i]); portsOpened++;}
    if (ns.getPlayer().skills.hacking >= ns.getServer(targets[i]).requiredHackingSkill && portsOpened >= ns.getServerNumPortsRequired(targets[i])) {
      ns.nuke(targets[i]);
    }
    //ns.tprint(targets[i]);
    if (ns.hasRootAccess(targets[i])) {
      targetsnuked.push(targets[i]);
      //ns.tprint(targets[i]);
    }
  }
  
  //if (ns.fileExists("server_list.txt")) ns.clear("server_list.txt");
  try {ns.clear("server_list.txt");} catch {}
  //await ns.asleep(100000);
  for (let i = 0; i < targets.length-1; i++) {
    ns.write("server_list.txt",targets[i]+',','a');
  }
  ns.write("server_list.txt",targets[targets.length-1],'a');
  
  //targetsnuked.sort(sortservers);
  //ns.tprint(targetsnuked);

  //if (ns.fileExists("nuked_list.txt")) ns.clear("nuked_list.txt");
  try {ns.clear("nuked_list.txt");} catch {}
  for (let i = 0; i < targetsnuked.length-1; i++) {
    ns.write("nuked_list.txt",targetsnuked[i]+',','a');
  }
  ns.write("nuked_list.txt",targetsnuked[targetsnuked.length-1],'a');

  ns.tprint('Root Access Count: ' + targetsnuked.length + '\nList: ' + targetsnuked);
  ns.tprint('');
  
  //sort according to money generated
  //money rate = hack_threads * (hackPercent * ns.getServerMaxMoney) * hackChance / hackTime(or weakTime or growTime)

  //hackPercent = (100 - server.hackDifficulty)/100 * (player.skills.hacking - server.requiredHackingSkill + 1)/player.skills.hacking * BitnodeMults / 240

  //skillChance = (clamp(1.75 * player.skills.hacking, 1, Number.MAX_VALUE) - server.requiredHackingSkill) / clamp(1.75 * player.skills.hacking, 1, Number.MAX_VALUE)
  //hackChance = skillChance * (100 - server.hackDifficulty)/100

  //skillFactor = 2.5 * (server.requiredHackingSkill * server.hackDifficulty + 500) / (player.skills.hacking + 50)
  //hackTime = 5 * skillFactor / player.mults.hacking_speed / BitnodeMults / playerIntelligenceBonus
  //playerIntelligenceBonus = 1 + (1 * Math.pow(ns.getPlayer().skills.intelligence, 0.8)) / 600
  
  //server.hackDifficulty_increase = 0.002 * Math.min(threads, maxThreadNeeded)
  //maxThreadNeeded = Math.ceil(1 / percentHacked)
  //


  //growTime = hackTime * 3.2
  //weakTime = hackTime * 4

  //factors affecting money generated: server.hackDifficulty(weaken), player.skills.hacking, server.requiredHackingSkill
  //let money_rate = (100 - server.hackDifficulty)/100 * (player.skills.hacking - server.requiredHackingSkill + 1)/player.skills.hacking / 240 * server.moneyMax * (Math.max(1.75 * player.skills.hacking, 1) - server.requiredHackingSkill) / Math.max(1.75 * player.skills.hacking) * (100 - server.hackDifficulty)/100 / (5 * 2.5) / (server.requiredHackingSkill * server.hackDifficulty + 500) * (player.skills.hacking + 50) * hack_threads * player.mults.hacking_speed * BitnodeMults.HackingSpeedMultiplier * playerIntelligenceBonus * BitnodeMults.ScriptHackMoney
  
  //ns.getPlayer().mults.hacking_speed
  //ns.getServer().requiredHackingSkill


  //might want to account for effectiveness of weak and grow from cores
  //grow rate = (server.moneyAvailable + grow_threads) * growPercent / growTime
  //growPercent = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * player.mults.hacking_grow * (1+(cores-1)/16))
  //adjGrowthRate = min(1 + 0.03/server.hackDifficulty, 1.0035)
  //numServerGrowthCyclesAdjusted = threads * server.serverGrowth/100 * BitNodeMultipliers.ServerGrowthRate
  //growTime = hackTime * 3.2
  //server.fortify(2 * 0.002 * usedCycles)
  
  //weak rate = weakAmount / weakTime
  //weakAmount = 0.05 * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate
  //new_server.hackDifficylty = server.hackDifficulty - 0.05 * threads * coreBonus * BitNodeMultipliers.ServerWeakenRate
  //weakTime = hackTime * 4


  //sorting method depends on batching method
  //in general, too small batch will not use full ram, too large batch will not use full time
  //get largest batch that does not use full ram, sort based on that
  //if continuous, calculate number of batches from weakTime + delta*3    (use the time between batches to get how many parallel batches there are)
  //if non-continuous, calculate number of batches from hackTime/4/delta



  /*
  function sortservers(a, b) {
    let a_server = ns.getServer(a);
    let b_server = ns.getServer(b);
    let player = ns.getPlayer();
    if (ns.fileExists("Formulas.exe")) {
      a_server.hackDifficulty = a_server.minDifficulty;
      b_server.hackDifficulty = b_server.minDifficulty;

      let a_money_rate = (ns.formulas.hacking.hackPercent(a_server, player) * a_server.moneyMax) * ns.formulas.hacking.hackChance(a_server, player) / ns.formulas.hacking.hackTime(a_server, player);
      let b_money_rate = (ns.formulas.hacking.hackPercent(b_server, player) * b_server.moneyMax) * ns.formulas.hacking.hackChance(b_server, player) / ns.formulas.hacking.hackTime(b_server, player);
      return a_money_rate - b_money_rate;
    }
    else {
      let a_money_rate = (100 - a_server.hackDifficulty)/100 * (player.skills.hacking - a_server.requiredHackingSkill + 1)/player.skills.hacking / 240 * a_server.moneyMax * (Math.max(1.75 * player.skills.hacking, 1) - a_server.requiredHackingSkill) / Math.max(1.75 * player.skills.hacking, 1) * (100 - a_server.hackDifficulty)/100 / (5 * 2.5 * a_server.requiredHackingSkill * a_server.hackDifficulty + 500) * (player.skills.hacking + 50) * player.mults.hacking_speed;
      let b_money_rate = (100 - b_server.hackDifficulty)/100 * (player.skills.hacking - b_server.requiredHackingSkill + 1)/player.skills.hacking / 240 * b_server.moneyMax * (Math.max(1.75 * player.skills.hacking, 1) - b_server.requiredHackingSkill) / Math.max(1.75 * player.skills.hacking, 1) * (100 - b_server.hackDifficulty)/100 / (5 * 2.5 * b_server.requiredHackingSkill * b_server.hackDifficulty + 500) * (player.skills.hacking + 50) * player.mults.hacking_speed;
      //ns.tprint(a, ' ', a_money_rate);
      //ns.tprint(b, ' ', b_money_rate);
      return a_money_rate - b_money_rate;
    }
  }
  */
  

}