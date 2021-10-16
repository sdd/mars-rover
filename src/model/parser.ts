import chunk from 'lodash/chunk';
import { Ok, Err, Result } from 'ts-results';

import type { GameInput, GridConfig, RobotDescriptor, RobotState } from './model';
import { Direction, Instruction } from './model';

/**
 * All possible parsing errors
 */
export enum GameInputParseError {
    GRID_CONFIG = 'Could not parse grid config correctly',
    ROBOT_INITIAL_STATE = 'could not parse initial robot state correctly',
    ROBOT_INSTRUCTIONS = 'could not parse robot instruction list correctly',
}

// from problem definition - max permitted coord val in both axes
export const MAX_COORD_VAL = 50;

export function parseInput(rawInput: string): Result<GameInput, GameInputParseError> {
    // split input into lines, filtering out any empty ones
    const [gridConfigRaw, ...robotStateRaw] = rawInput.split('\n').filter(notEmpty);

    const gridConfig = parseGridConfig(gridConfigRaw);

    // split the raw lines of robot input into two-line
    // chunks (1 chunk per robot)
    const perRobotRawState: string[][] = chunk(robotStateRaw, 2);

    // map each chunk through the parser to get a list of Results
    const robotRequestResults = perRobotRawState.map(([initialState, instructions]) =>
        parseRobotInput(initialState, instructions),
    );

    // Result.all maps from Result<RobotDescriptor, GameInputParseError>[]
    // to Result<RobotDescriptor[], GameInputParseError>
    const robotRequestsResult = Result.all(...robotRequestResults);

    // return either the first error that was encountered or a valid GameInput
    return Result.all(gridConfig, robotRequestsResult).map(([gridConfig, robotRequests]) => ({
        gridConfig,
        robotRequests,
    }));
}

/**
 * a predicate to filter empty strings
 * @param s the string to test for emptiness
 * @returns true if the string is not empty
 */
function notEmpty(s: string): boolean {
    return s.length > 0;
}

/**
 *
 * @param str the raw input line to parse into a GridConfig
 * @returns GridConfig the grid width and height
 */
export function parseGridConfig(str: string): Result<GridConfig, GameInputParseError> {
    const [width, height]: number[] = str
        .trim()
        .split(' ')
        .map(x => parseInt(x, 10));

    if (!isValidCoord(width) || !isValidCoord(height)) {
        return Err(GameInputParseError.GRID_CONFIG);
    }

    return Ok({ width, height });
}

export function parseRobotInput(
    rawInitialState: string,
    rawInstructions: string,
): Result<RobotDescriptor, GameInputParseError> {
    const [xRaw, yRaw, dirRaw] = rawInitialState.trim().split(' ');
    const [x, y] = [xRaw, yRaw].map(n => parseInt(n, 10));

    if (!isValidCoord(x) || !isValidCoord(y)) {
        return Err(GameInputParseError.ROBOT_INITIAL_STATE);
    }

    const dir = parseDirection(dirRaw);

    const initialState = dir.map(dir => ({ x, y, dir }));
    const instructions = Result.all(...rawInstructions.split('').map(parseInstruction));

    return Result.all(initialState, instructions).map(([initialState, instructions]) => ({
        initialState,
        instructions,
    }));
}

/**
 *
 * @param n the item to check if it is a valid grid coordinate or not
 * @returns boolean true if valid
 */
export function isValidCoord(n: number): boolean {
    return Number.isFinite(n) && n >= 0 && n <= MAX_COORD_VAL;
}

/**
 * Tries to parse a raw string into a Direction enum
 * @param str the raw string that you are trying to parse into a Direction
 * @returns Result<Direction, GameInputParseError> a direction or a parse error
 */
export function parseDirection(str: string): Result<Direction, GameInputParseError> {
    const direction: Direction | undefined = (<any>Direction)[str];
    return direction === undefined ? Err(GameInputParseError.ROBOT_INITIAL_STATE) : Ok(direction);
}

/**
 * Tries to parse a raw string into an Instruction enum
 * @param str the raw string that you are trying to parse into a Instruction
 * @returns Result<Instruction, GameInputParseError> a direction or a parse error
 */
export function parseInstruction(str: string): Result<Instruction, GameInputParseError> {
    const instruction: Instruction | undefined = (<any>Instruction)[str];
    return instruction === undefined ? Err(GameInputParseError.ROBOT_INSTRUCTIONS) : Ok(instruction);
}
