import { Direction, RobotState } from './model';

/**
 * formats a RobotState into a string
 * @param state a RobotState to format to a string
 * @returns a string matching the challenge output format for a particular robot
 */
export function formatRobotState(state: RobotState): string {
    const { x, y, dir } = state;
    const dirText = Direction[dir];
    const lostText = state.isLost ? ' LOST' : '';

    return `${x} ${y} ${dirText}${lostText}`;
}
