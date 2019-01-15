const EXAMPLE = `1, 1
1, 6
8, 3
3, 4
5, 5
8, 9`;

const INPUT = `262, 196
110, 109
58, 188
226, 339
304, 83
136, 356
257, 50
315, 148
47, 315
73, 130
136, 91
341, 169
334, 346
285, 248
76, 233
334, 64
106, 326
48, 207
64, 65
189, 183
300, 247
352, 279
338, 287
77, 277
220, 152
77, 295
49, 81
236, 294
321, 192
43, 234
180, 69
130, 122
166, 225
301, 290
49, 176
62, 156
346, 55
150, 138
214, 245
272, 241
50, 283
104, 70
215, 184
339, 318
175, 123
250, 100
134, 227
96, 197
312, 174
133, 237`;

function manhattanDistance(a, b) {
  return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}


function parsePoint(coord, i) {
  const [x, y] = coord.split(', ');
  const id = String(i);
  return { x, y, id };
}

function findClosestPoint(points, x, y) {
  let minDistance = Infinity;
  let closestPoint = null;
  let pointsAtDistance = 0;
  for (const p of points) {
    const d = manhattanDistance({x, y}, p);

    if (d < minDistance) {
      minDistance = d;
      closestPoint = p;
      pointsAtDistance = 1;
    } else if (d === minDistance) {
      pointsAtDistance += 1;
    }
  }

  if (pointsAtDistance > 1) {
    return null;
  }
  return closestPoint;
}

function isPointBounded(point, bounds) {
  const xBounded = (point.x > bounds.x0 && point.x < bounds.width);
  const yBounded = (point.y > bounds.y0 && point.y < bounds.height);

  return (xBounded && yBounded);
}

function getBounds(points) {
  const xCoords = points.map(p => p.x);
  const yCoords = points.map(p => p.y);


  const x0 = Math.min(...xCoords);
  const y0 = Math.min(...yCoords);

  const width = Math.max(...xCoords);
  const height = Math.max(...yCoords);

  return { x0, y0, width, height };
}

function countFrequency(rows) {
  return rows.reduce((counts, row) => {
    row.forEach(elem => {
      if (elem != undefined) {
        counts[elem] = (counts[elem] || 0) + 1;
      }
    });

    return counts;
  }, {});
}

function findMaxFreq(points, frequencies) {
  let max = 0;
  for (const p of points) {
    console.log(p);
    const value = frequencies[p.id]
    if (value > max) {
      max = value;
    }
  }

  return max;
}

function solution(input) {
  const rawCoords = input.split('\n');

  const points = rawCoords.map(parsePoint)

  const bounds = getBounds(points);
  const { x0, y0, width, height } = bounds;


  const rows = Array.from({ length: height });
  for (let i = 0; i < rows.length; i++) {
    rows[i] = Array.from({ length: width });
  }

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const closest = findClosestPoint(points, x, y);

      if (closest) {
        rows[y][x] = closest.id;
      }
    }
  }

  const frequencies = countFrequency(rows);

  const boundedPoints = points.filter(p => isPointBounded(p, bounds));

  const result = findMaxFreq(boundedPoints, frequencies);

  return result
}

console.log(solution(INPUT));
