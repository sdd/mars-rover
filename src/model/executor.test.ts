import { expect } from 'chai';

import { runGame } from './executor';
import { Direction, GameInput, Instruction, RobotState } from './model';

describe('runGame', () => {
    it('successfully executes the example game from the text', () => {
        const inputFromExampleText: GameInput = {
            gridConfig: {
                width: 5,
                height: 3,
            },
            robotRequests: [
                {
                    initialState: {
                        x: 1,
                        y: 1,
                        dir: Direction.E,
                        isLost: false,
                    },
                    instructions: [
                        Instruction.R,
                        Instruction.F,
                        Instruction.R,
                        Instruction.F,
                        Instruction.R,
                        Instruction.F,
                        Instruction.R,
                        Instruction.F,
                    ],
                },
                {
                    initialState: {
                        x: 3,
                        y: 2,
                        dir: Direction.N,
                        isLost: false,
                    },
                    instructions: [
                        Instruction.F,
                        Instruction.R,
                        Instruction.R,
                        Instruction.F,
                        Instruction.L,
                        Instruction.L,
                        Instruction.F,
                        Instruction.F,
                        Instruction.R,
                        Instruction.R,
                        Instruction.F,
                        Instruction.L,
                        Instruction.L,
                    ],
                },
                {
                    initialState: {
                        x: 0,
                        y: 3,
                        dir: Direction.W,
                        isLost: false,
                    },
                    instructions: [
                        Instruction.L,
                        Instruction.L,
                        Instruction.F,
                        Instruction.F,
                        Instruction.F,
                        Instruction.L,
                        Instruction.F,
                        Instruction.L,
                        Instruction.F,
                        Instruction.L,
                    ],
                },
            ],
        };

        const result = runGame(inputFromExampleText);

        const expected: RobotState[] = [
            {
                x: 1,
                y: 1,
                dir: Direction.E,
                isLost: false,
            },
            {
                x: 3,
                y: 3,
                dir: Direction.N,
                isLost: true,
            },
            {
                x: 2,
                y: 3,
                dir: Direction.S,
                isLost: false,
            },
        ];

        expect(result).to.eql(expected);
    });
});
