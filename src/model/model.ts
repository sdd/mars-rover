export type GridConfig = {
    width: number;
    height: number;
};

export enum Direction {
    N = 'N',
    E = 'E',
    S = 'S',
    W = 'W',
}

export type RobotState = {
    x: number;
    y: number;
    dir: Direction; // the direction the robot is facing
};

export enum Instruction {
    R = 'R', // Turn Right
    L = 'L', // Turn Left
    F = 'F', // Move 1 step in the direction the robot is facing
}

/**
 * Contains the initial state of a robot
 * alongside its list of instructions, parsed from
 * the input text
 */
export type RobotDescriptor = {
    initialState: RobotState;
    instructions: Instruction[];
};

/**
 * When the input text is ran through the parser,
 * if it is valid we use a GameInput type to
 * represent the game input semantically.
 */
export type GameInput = {
    gridConfig: GridConfig;
    robotRequests: RobotDescriptor[];
};
