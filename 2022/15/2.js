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

function marshalPoint(point) {
  return `${point.x},${point.y}`;
}

function unmarshalPoint(rawPoint) {
    return rawPoint.split(',').map(n => parseInt(n, 10));
}

class BeaconTracker {
  constructor(gridSize, beacons) {
    this.gridSize = gridSize;
    this.beacons = new Set(beacons);

    this.targetSet = new Set();
  }

  trackReport(report) {
    const { sensor, beacon } = report;


    const beaconDelta = distanceBetween(sensor, beacon);
    const startY = sensor.y - beaconDelta;
    const endY = sensor.y + beaconDelta;


    if (DEBUG) {
      console.log(report)
      console.log(beaconDelta, startY, endY);
    }

    for (let y = startY; y <= endY; y++) {
      const targetDelta = Math.abs(y - sensor.y);

      const width = beaconDelta - targetDelta;

      const start = sensor.x - width;
      const end = sensor.x + width;

      if (DEBUG) {
        console.log(width, start, end);
      }

      for (let x = start; x <= end; x++) {
        this.excludeBeacon({x, y});
      }

    }

  }

  excludeBeacon(position) {
    const point = marshalPoint(position);
    if (!this.beacons.has(point)) {
      this.targetSet.add(point);
    }
  }

  size() {
    return this.targetSet.size;
  }
}

function main(inputFile, size) {
  const input = fs.readFileSync(inputFile, 'utf8');

  const reports = input.split('\n').map(parseReport);

  const targetBeacons = [];
  for (let report of reports) {
    const {beacon} = report;

    targetBeacons.push(marshalPoint(beacon));
  }

  const tracker = new BeaconTracker(size, targetBeacons);

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
