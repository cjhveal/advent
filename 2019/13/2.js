const fs = require('fs');
const readline = require('readline');

const DEBUG = false;

class IntCodeComputer {
  constructor(program) {
    this.pointer = 0;
    this.relativeBase = 0;
    this.memory = Array(2**16 + 1).fill(0);

    for (const [index, word] of program.entries()) {
      this.memory[index] = word;
    }

    this.inputs =[];
    this.outputs = [];

    this.operations = {
      '01': (a, b) => a + b,
      '02': (a, b) => a * b,
      '07': (a, b) => a < b ? 1 : 0,
      '08': (a, b) => a === b ? 1 : 0,
    }

    this.halted = false;
  }

  execute() {
    while(this.memory[this.pointer] !== 99) {
      const stepValue = this.step();
      if (stepValue && stepValue.interrupt) {
        return this.outputs;
      }
    }

    return this.terminate();
  }

  parseOpcode() {
    const value = this.memory[this.pointer];

    const chars = String(value).padStart(5, '0');

    const third = chars[0];
    const second = chars[1];
    const first = chars[2];
    const opcode = chars.slice(3);

    const modes = { first, second, third };

    return {
      opcode, modes, fullOpcode: chars,
    }
  }

  step() {
    const {opcode, modes, fullOpcode} = this.parseOpcode();

    if (opcode === '03') {
      const location = this.getParam(1, '1')

      if (this.inputs.length === 0) {
        return { interrupt: true };
      }

      const inputValue = this.inputs.pop();

      this.setValue(location, inputValue, modes.first);

      this.pointer += 2;
    } else if (opcode === '04') {
      const value = this.getParam(1, modes.first);

      this.outputs.push(value);

      this.pointer += 2;
    } else if (opcode === '01' || opcode === '02' || opcode === '07' || opcode === '08') {
      const operation = this.operations[opcode];

      const input1 = this.getParam(1, modes.first);
      const input2 = this.getParam(2, modes.second)
      const output = this.getParam(3, '1')

      if (DEBUG) {
        console.log(this.pointer, fullOpcode, input1, input2, output);
      }

      const value = operation(input1, input2);

      this.setValue(output, value, modes.third);

      this.pointer += 4;
    } else if (opcode === '05' || opcode === '06') {
      const value = this.getParam(1, modes.first);
      const nextPointer = this.getParam(2, modes.second);

      if (DEBUG) {
        console.log(this.pointer, fullOpcode, value, nextPointer);
      }


      if (opcode === '05' && value !== 0) {
        this.pointer = nextPointer;
      } else if (opcode === '06' && value === 0) {
        this.pointer = nextPointer;
      } else {
        this.pointer += 3;
      }
    } else if (opcode === '09') {
      const value = this.getParam(1, modes.first);
      
      this.relativeBase += value;

      this.pointer += 2;

    } else if (opcode === '99') {
      throw new Error('should have halted');
    } else {
      if (DEBUG) {
        console.log(this.pointer, this.memory[this.pointer], fullOpcode)
      }
      throw new Error(`unknown opcode ${opcode}`);
    }
  }

  setValue(param, value, mode) {
    const address = mode === '0' ? param : this.relativeBase + param;

    this.memory[address] = value;
  }

  getParam(index, mode) {
    const value = this.memory[this.pointer + index];

    return this.getValue(value, mode);
  }

  getValue(value, mode) {
    if (mode === '1') {
      return value;
    } else if (mode === '2') {
      const address = this.relativeBase + value;
      return this.memory[address];
    } else {
      return this.memory[value];
    }
  }

  enqueueInput(inputs) {
    this.inputs = [...inputs.reverse(), ...this.inputs];
  }

  clearOutput() {
    this.outputs = [];
  }

  terminate() {
    this.halted = true;

    return this.outputs;
  }

}

const DRAW_SCREEN = true;

const GAME_WIDTH = 35;
const GAME_HEIGHT = 20;

const TILE_IDS = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4,
};

// a < b:  -1
// a > b:   1
// a === b: 0
function compareNumbers(a, b) {
  return a - b;
}

class ArcadeMachine {
  constructor(program) {
    this.computer = new IntCodeComputer(program);

    this.buffer = new Map();

    this.score = 0;


    this.paddlePosition = null;
    this.ballPosition = null;

    this.aiPlayer = true;

    if (!this.aiPlayer) {
      this.initInput();
    }
  }

  initInput() {
    this.inputInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  drawToBuffer(instruction) {
    const [x, y, tileId] = instruction;

    if (x === -1 && y === 0) {
      this.score = tileId;
    } else {
      if (tileId === TILE_IDS.PADDLE) {
        this.paddlePosition = {x, y};
      } else if (tileId === TILE_IDS.BALL) {
        this.ballPosition = {x, y}
      }
      this.buffer.set(`${x},${y}`, tileId);
    }
  }

  drawBufferToScreen() {
    let finalBuffer = '';

    for (let y = 0; y <= GAME_HEIGHT; y++) {
      for (let x = 0; x <= GAME_WIDTH; x++) {
        const tileId = this.buffer.get(`${x},${y}`);
        const char = this.getCharForTile(tileId);

        finalBuffer += char;
      }

      finalBuffer += '\n';
    }

    console.log(finalBuffer);
  }

  getCharForTile(tileId) {
    switch(tileId) {
      case TILE_IDS.EMPTY:
        return ' ';
      case TILE_IDS.WALL:
        // unicode block
        return `\u2588`;

      case TILE_IDS.BLOCK:
        return `#`;
      case TILE_IDS.PADDLE:
        return `_`;
      case TILE_IDS.BALL:
        return `o`;
      default:
        return ' ';
    }
  }

  getAiInput() {
    if (!this.paddlePosition || !this.ballPosition) {
      return 0;
    }

    const difference = this.ballPosition.x - this.paddlePosition.x;

    const direction = Math.sign(difference);

    return direction;
  }

  consumeInput() {
    return new Promise((resolve, reject) => {
      if (this.aiPlayer) {
        resolve(this.getAiInput());
      } else {
        this.inputInterface.question('Input:', (response) => {
          const input = this.getInputForKey(response);
          resolve(input);
        });
      }
    });
  }

  getInputForKey(key) {
    switch (key) {
      case 'a':
        return -1;
      case 'd':
        return 1;
      case 's':
      default:
        return 0;
    }
  }


  playRound(input) {
    if (input || input === 0) {
      this.computer.enqueueInput([input]);
    }

    const output = this.computer.execute();

    const drawInstructions = chunk(output, 3);

    for (const instruction of drawInstructions) {
      this.drawToBuffer(instruction);
    }

    if (DRAW_SCREEN) {
      this.drawBufferToScreen();
    }
  }

  async playGame() {
    let input = null;
    while (!this.computer.halted) {
      this.playRound(input);
      input = await this.consumeInput();
    }
  }
}


function chunk(input, chunkSize) {
  const array = [...input];
  const result = [];
  while (array.length) {
    const value = array.splice(0, chunkSize);
    result.push(value);
  }
  return result;
}

const BLOCK_TILE_ID = 2;

function playRound(computer) {
  computer.execute();
}

async function main() {
  const input = fs.readFileSync('./input.txt', 'utf8');

  const initialProgram = input.split(',').map(Number);

  // alter memory to enable free play
  initialProgram[0] = 2;

  const arcadeMachine = new ArcadeMachine(initialProgram);

  await arcadeMachine.playGame();


  return arcadeMachine.score;
}

async function test() {
  const result = await main();
  console.log(result);
}


test();
