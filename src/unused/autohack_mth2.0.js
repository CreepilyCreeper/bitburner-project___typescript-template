/** @param {NS} ns */


/*
we have a certain amount of ram for each unit time
goal is to utilize all ram, but have as many batches as possible
delta is spacing between each operation (h,g,w), min 20ms, max 200ms
switch targets just before the batch is about to hit the server
also switch targets when hack speed increases (either from level up or augment purchase)

cannot prep any new batches on same server after batches start completing (if prep while not weakened time will desync)
cannot prepare any more batches if this batch's hack preps after first batch ends
batch window length = length of hack
number of batches = hacklength / delta / 4 round down
cpucore bonus is 1+(cores-16)/16, not too significant, ignore if using multiple servers to batch

best server is money per ram second, ram * second for each thing in batch

REDUNDANCY SAFETY PROCEDURE
Before hack finishes (maybe delta/2 before hack applies), check server difficulty min and money max
if not kill hack, report to log 

config
hwgw
delta = 50ms (20ms to 200ms)
multiple servers
hack,grow,weak cost = 1.75ram

-----batch steps-----

sort servers to hack
  move nuked_list.txt to Array
  order servers based on larger better
  1: server.maxMoney / server.minDifficulty * server.serverGrowth
  2: server.maxMoney / server.minDifficulty
  save list to autohackv2.0 servers file
  could generate a graph, would look nice

calculate how many threads we can run on all servers
  run autonuke.js to get nuked_list.txt, move to Array
  get ram of each server
  server_maxThreads = server.maxRam / 1.75
  create array of nuked servers with times

prepare hosts
  scp weak hack grow files

calculate batch size, batch cycles, etc of each server
  get server hackTime
  Math.floor(hackTime / delta / 4) = maxBatches per go (else next hack starts during batch finish)
  server_maxThreads / maxBatches = thread_count per batch

weaken server
  server.hackDifficulty - server.minDifficulty = 0.05 * weak_threads * coreBonus * BitNodeMultipliers.ServerWeakenRate
  try
    let BNmults_serverWeakenRate = ns.getBitNodeMultipliers().ServerWeakenRate;
  catch
    let BNmults_serverWeakenRate = 1
  finally
    weak_threads = Math.ceil((server.hackDifficulty - server.minDifficulty) / 0.05 / BNmults_serverWeakenRate)
  get weakTime
  run weak on all servers, space out according to weakTime
  check if server is done weakening, if not REPORT ERROR and loop above

calculate prep batch composition
  search by splitting in half every loop
  start with 1/2 of maxThreads
  repeat {
    try
      let BNmults_serverWeakenRate = ns.getBitNodeMultipliers().ServerWeakenRate;
    catch
      let BNmults_serverWeakenRate = 1
    finally
      weak_threads = 2*0.002*growThreads / 0.05 / BNmults_serverWeakenRate)
    if not enough threads
      if old too many threads save new setup
      else add half
    if too many threads
      if old not enough threads save old setup
      else lose half
  } until a setup has been decided

start prep batch
  loop for (maxBatches per go) times {
    hack(target, sleepDuration)
    weak(target, sleepDuration)
    grow(target, sleepDuration)
    weak(target, sleepDuration)
  }

calculate batch composition (loops)
  search by splitting in half every loop
  start with 1/2 threads per batch
  repeat {
    get hacked away money
    get min threads to weak from server.hackDifficulty increase
    get min threads to grow from remaining money from hacked away money
    get min threads to weak from server.hackDifficulty increase
    if not enough threads
      if old too many threads save new setup
      else add half
    if too many threads
      if old not enough threads save old setup
      else lose half
  } until a setup has been decided

 start batching
  VERSION 1: (hogs ram while delaying)
  loop for (maxBatches per go) times {
    hack(target, sleepDuration)
    weak(target, sleepDuration)
    grow(target, sleepDuration)
    weak(target, sleepDuration)
  }
  VERSION 2: (no hog ram while delaying)
  time_start = Date.getTime()
  first_weak1 at time_start + delta
  first_weak2 at time_start + delta*3
  first_hack  at time_start + weakTime - hackTime
  first_grow  at time_start + delta*2 + weakTime - growTime 
  i_w1, i_w2, i_h, i_g = 0
  while (true) {
    if Date.getTime() > first_weak1 + delta*4*i_w1
      i_w1++
      weak(target)
    if Date.getTime() > first_weak2 + delta*4*i_w2
      i_w2++
      weak(target)
    if Date.getTime() > first_hack + delta*4*i_h
      i_h++
      hack(target)
    if Date.getTime() > first_grow + delta*4*i_g
      i_g++
      grow(target)
    await ns.asleep()
  }
*/


export async function main(ns) {
  //config
  ns.tail();
  const HOME_RAM_BUFFER = 32;
  const RAM_SINGLE_THREAD = 1.75;
  const DELTA = 50;

  let home = ns.getServer("home");
  if (home.maxRam - home.ramUsed >= ns.getScriptRam("autonuke.js", "home")) {
    ns.exec("autonuke.js", "home");
  }
  else {
    ns.scp("autonuke.js", "foodnstuff", "home");
    ns.exec("autonuke.js", "foodnstuff");
    await ns.asleep(10);
    ns.scp("server_list.txt", "home", "foodnstuff");
    ns.scp("nuked_list.txt", "home", "foodnstuff");
  }

//sort servers to hack

  let targets = new Array;
  targets = ns.read("nuked_list.txt").split(',');

  targets.sort((b, a) => {
    let a_server = ns.getServer(a);
    let b_server = ns.getServer(b);
    return a_server.moneyMax / a_server.minDifficulty * a_server.serverGrowth - b_server.moneyMax / b_server.minDifficulty * b_server.serverGrowth;
  });
  
  //ns.tprint("TARGET SORTING:");
  try {ns.clear("autohackv2.0_servers.txt");} catch {}
  for (let i = 0; i < targets.length-1; i++) {
    //ns.tprint(targets[i]+' '+ns.getServer(targets[i]).serverGrowth);
    //ns.tprint('Formula 1:'+targets[i]+' '+(ns.getServer(targets[i]).moneyMax / ns.getServer(targets[i]).minDifficulty * ns.getServer(targets[i]).serverGrowth));
    //ns.tprint('Formula 2:'+targets[i]+' '+(ns.getServer(targets[i]).moneyMax / ns.getServer(targets[i]).minDifficulty));
    if (targets[i].serverGrowth > 0) {
      ns.write("autohackv2.0_servers.txt",targets[i]+',','a');
    }
  }
  ns.write("autohackv2.0_servers.txt",targets[targets.length-1],'a');

//calculate how many threads we can run on all servers

  let hosts = [...targets];

  let hosts_threads_max = new Array;
  for (let i = 0; i < targets.length; i++) {
    hosts_threads_max[i] = Math.floor(ns.getServer(hosts[i]).maxRam / RAM_SINGLE_THREAD);
    ns.tprint(targets[i]+' '+hosts_threads_max[i]);
  }
  hosts.push("home");
  hosts_threads_max.push(Math.max(0, home.maxRam - HOME_RAM_BUFFER) / RAM_SINGLE_THREAD);
  ns.tprint(targets[targets.length-1]+' '+hosts_threads_max[targets.length-1]);

//prepare servers
  for (let i = 0; i < targets.length; i++) {
    ns.scp(["hack.js", "grow.js", "weaken.js"]);
  }

//calculate batch size, batch cycles, etc
  
  let targets_maxBatches = new Array;
  for (let i = 0; i < targets.length; i++) {
    targets_maxBatches[i] = Math.floor(ns.getHackTime(targets[i])/DELTA/4);
    ns.tprint(targets[i]+' '+targets_maxBatches[i]);
  }
  let maxThreads = hosts_threads_max.reduce((a,b) => a+b, 0);

//loop until hacktime or hackspeed changes which ruins the batch

  let oldspeed = ns.getHackTime("foodnstuff");
  while(oldspeed != ns.getHackTime("foodnstuff")){ 
  //let oldspeed = ns.getHackingMultipliers().speed;
  //while(oldspeed != ns.getHackingMultipliers().speed){ 

    await ns.asleep();
    let target = ns.getServer(targets[0]);
    //ns.print(targets);

   //weaken server

    let BNmults_serverWeakenRate = 1
    try {
      //let BNmults_serverWeakenRate = ns.getBitNodeMultipliers().ServerWeakenRate;
      throw new Error('BNMults Bypass');
    }
    catch {
    }
    let weak_threads = Math.ceil((server.hackDifficulty - server.minDifficulty) / 0.05 / BNmults_serverWeakenRate)
    
    let weak_time = ns.getWeakenTime(target.hostname);

    //running weak threads for full cycles first
    for (let i = Math.floor(weak_threads / maxThreads); i > 0; --i) {
      for (let i = 0; i < hosts.length; ++i) {
        ns.exec("weaken.js", hosts[i], hosts_threads_max[i]);
      }
    }
    //then distribute to remainder
    for (let i = weak_threads % maxThreads; i > 0;) {
      ns.exec("weaken.js", hosts[i], Math.min(i, hosts_threads_max[i]));
      i -= hosts_threads_max;
    }

    //get weakTime
    //run weak on all servers, space out according to weakTime
    //check if server is done weakening, if not REPORT ERROR and loop above
  }

}