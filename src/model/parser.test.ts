import { expect } from 'chai';

import { parseInput, GameInputParseError } from './parser';

describe('parseInput', () => {
    it('returns a valid GameInput when the input string is correctly formatted', () => {
        const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL`;

        const result = parseInput(input);

        expect(result.ok).to.be.true;
    });

    it('returns an error if there is an invalid grid config value', () => {
        const input = `5 300
1 1 
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 A
LLFFFLFLFL`; // ERROR is on the "5 300" line, 300 is too large a value for a grid

        const result = parseInput(input);

        expect(result.ok).to.be.false;
        expect(result.val).to.eq(GameInputParseError.GRID_CONFIG);
    });

    it('returns an error if there is an unparsable initial state for a robot', () => {
        const input = `5 3
1 1 
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 A
LLFFFLFLFL`; // ERROR is on the "0 3 A" line, A is an invalid dir

        const result = parseInput(input);

        expect(result.ok).to.be.false;
        expect(result.val).to.eq(GameInputParseError.ROBOT_INITIAL_STATE);
    });

    it('returns an error if there is an unparsable instruction for a robot', () => {
        const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLWLFL`; // ERROR is on the "LLFFFLWLFL" line, W is an invalid instruction

        const result = parseInput(input);

        expect(result.ok).to.be.false;
        expect(result.val).to.eq(GameInputParseError.ROBOT_INSTRUCTIONS);
    });

    it('handles empty robot instructions', () => {
        const input = `5 3
`; // ERROR is on the "LLFFFLWLFL" line, W is an invalid instruction

        const result = parseInput(input);

        expect(result.ok).to.be.true;
    });

    it('returns an error if there is an unparsable instruction for a robot', () => {
        const input = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W`; // ERROR missing instructions line for last robot

        const result = parseInput(input);

        expect(result.ok).to.be.false;
        expect(result.val).to.eq(GameInputParseError.ROBOT_INSTRUCTIONS);
    });
});
