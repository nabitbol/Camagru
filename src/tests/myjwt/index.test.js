import { describe, expect, it } from "vitest";
import Jwt from "@camagru/myjwt";

const jwt = new Jwt();

const data = {
    email: 'test@test.t',
};
const secret = 'secretTest';

describe('Test verify', () => {
    const token = jwt.sign(data, secret);

    const payload = jwt.verify(token, secret);

    it('Jwt is verified', () => {
        expect(payload.data).toEqual(data);
    });

});
