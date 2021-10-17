import { Direction, RobotState } from './model';

export function formatRobotState(state: RobotState): string {
    const { x, y, dir } = state;
    const dirText = Direction[dir];
    const lostText = state.isLost ? ' LOST' : '';

    return `${x} ${y} ${dirText}${lostText}`;
}
