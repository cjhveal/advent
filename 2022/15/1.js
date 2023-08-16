const fs = require('fs');

const DEBUG = false;


const reportRegex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
function parseReport(rawReport) {
  const match = rawReport.match(reportRegex);

  if (!match) {
    throw new Error('unable to parse report: ' + rawReport);
  }

  const [fullMatch, ...values] = match;
  const [sensorX, sensorY, beaconX, beaconY] = values.map(n => parseInt(n, 10));

  return {
    sensor: { x: sensorX, y: sensorY},
    beacon: { x: beaconX, y: beaconY},
  }
}

/* manhattan distance */
function distanceBetween(pointA, pointB) {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
}

class BeaconTracker {
  constructor(target, targetBeacons) {
    this.target = target;

    this.targetBeacons = new Set(targetBeacons);

    this.targetSet = new Set();
  }

  trackReport(report) {
    const { sensor, beacon } = report;


    const beaconDelta = distanceBetween(sensor, beacon);

    const targetDelta = Math.abs(this.target - sensor.y);

    if (DEBUG) {
    console.log(report)
    console.log(beaconDelta, targetDelta);
    }


    if (targetDelta <= beaconDelta) {
      const size = beaconDelta - targetDelta;

      const start = sensor.x - size;
      const end = sensor.x + size;
      if (DEBUG) {
        console.log(size, start, end);
      }

      for (let i = start; i <= end; i++) {
        this.excludeBeacon(i);
      }
    }
  }

  excludeBeacon(position) {
    if (!this.targetBeacons.has(position)) {
      this.targetSet.add(position);
    }
  }

  size() {
    return this.targetSet.size;
  }
}

function main(inputFile, target) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const reports = input.split('\n').map(parseReport);

  const targetBeacons = [];
  for (let report of reports) {
    const {beacon} = report;

    if (beacon.y === target) {
      targetBeacons.push(beacon.x);
    }
  }

  const tracker = new BeaconTracker(target, targetBeacons);

  for (const report of reports) {
    tracker.trackReport(report);
    console.log(tracker.targetSet.size);
  }

  return tracker.size();
}

function test() {
  console.log(main('./input.txt', 2000000));
}

function example() {
  console.log(main('./example.txt', 10));
}

function example2() {
  console.log(main('./example2.txt'));
}

function example3() {
  console.log(main('./example3.txt'));
}

function example4() {
  console.log(main('./example4.txt'));
}

function example5() {
  console.log(main('./example5.txt'));
}

test();
//example();
//example2();
