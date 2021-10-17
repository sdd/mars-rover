import { expect } from 'chai';

import { formatRobotState } from './formatter';
import { Direction, RobotState } from './model';

describe('formatRobotState', () => {
    it('formats a robot state to the expected string output style', () => {
        const robotStates: RobotState[] = [
            { x: 1, y: 1, dir: Direction.E, isLost: false },
            { x: 3, y: 3, dir: Direction.N, isLost: true },
            { x: 2, y: 3, dir: Direction.S, isLost: false },
        ];

        const expectedFromProblemText = `1 1 E
3 3 N LOST
2 3 S`;

        const result = robotStates.map(formatRobotState).join('\n');

        expect(result).to.eql(expectedFromProblemText);
    });
});
