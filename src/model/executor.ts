import { None, Some } from 'ts-results';
import {
    Direction,
    GameInput,
    GridConfig,
    Instruction,
    RobotDescriptor,
    RobotRunResult,
    RobotState,
    ScentedLocations,
} from './model';

/**
 * Maps a direction to the one 90 degrees to the left
 */
const MAP_LEFT = {
    [Direction.N]: Direction.W,
    [Direction.E]: Direction.N,
    [Direction.S]: Direction.E,
    [Direction.W]: Direction.S,
};

/**
 * Maps a direction to the one 90 degrees to the right
 */
const MAP_RIGHT = {
    [Direction.N]: Direction.E,
    [Direction.E]: Direction.S,
    [Direction.S]: Direction.W,
    [Direction.W]: Direction.N,
};

/**
 * Maps a Direction to it's associated change
 * in x coords if moving forward in that direction
 */
const MAP_MOVE_X = {
    [Direction.N]: 0,
    [Direction.E]: 1,
    [Direction.S]: 0,
    [Direction.W]: -1,
};

/**
 * Maps a Direction to it's associated change
 * in y coords if moving forward in that direction
 */
const MAP_MOVE_Y = {
    [Direction.N]: 1,
    [Direction.E]: 0,
    [Direction.S]: -1,
    [Direction.W]: 0,
};

/**
 * Processes a run for a single bot
 * @param gridConfig the dimensions of the world grid
 * @param scentedLocations a list of places where previous bots have died
 * @param robotDescriptor the initial state and set of insructions to process
 * @returns
 */
export function executeRobotInstructions(
    gridConfig: GridConfig,
    scentedLocations: ScentedLocations,
    robotDescriptor: RobotDescriptor,
): RobotRunResult {
    const { instructions } = robotDescriptor;
    let currentState: RobotState = { ...robotDescriptor.initialState };

    for (const instruction of instructions) {
        switch (instruction) {
            case Instruction.L:
                currentState.dir = MAP_LEFT[currentState.dir];
                break;

            case Instruction.R:
                currentState.dir = MAP_RIGHT[currentState.dir];
                break;

            case Instruction.F:
                // determine the coords that the bot is trying to move forward into
                const newX = currentState.x + MAP_MOVE_X[currentState.dir];
                const newY = currentState.y + MAP_MOVE_Y[currentState.dir];

                // check if the bot is trying to move off the grid
                if (newX < 0 || newX > gridConfig.width || newY < 0 || newY > gridConfig.height) {
                    // check to see if the current square is not scented
                    if (
                        scentedLocations.find(loc => loc.x === currentState.x && loc.y === currentState.y) === undefined
                    ) {
                        // Went off the world. Goodbye little bot 🤖💀⚰️
                        currentState.isLost = true;
                    }
                } else {
                    // move was to a valid square - make it happen
                    currentState.x = newX;
                    currentState.y = newY;
                }
                break;

            default:
                console.error(`Unimplemented Instruction: ${instruction}`);
        }

        // stop processing instructions if the robot is lost
        if (currentState.isLost) {
            break;
        }
    }

    return {
        finalState: currentState,
    };
}

/**
 * takes a fully parsed game input and runs all the robot instructions
 * in sequence, scenting any locations where robots die as we go
 * @param gameInput
 * @returns the final fate of all the robots
 */
export function runGame(gameInput: GameInput): RobotState[] {
    const scentedLocations: ScentedLocations = [];
    const { gridConfig, robotRequests } = gameInput;

    return robotRequests.map(robotRequest => {
        const result = executeRobotInstructions(gridConfig, scentedLocations, robotRequest);

        // if the robot fell off the world, add its
        // final grid location to the list of scented
        // locations
        if (result.finalState.isLost) {
            scentedLocations.push({ x: result.finalState.x, y: result.finalState.y });
        }

        return result.finalState;
    });
}
