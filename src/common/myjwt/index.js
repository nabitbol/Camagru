import crypto from "node:crypto";

class Jwt {
    jwt;

    constructor() { };

    #base64UrlEncode(str) {
        return Buffer.from(str)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    #base64UrlDecode(base64Url) {
        let base64 = base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const paddingLength = (4 - (base64.length % 4)) % 4;

        base64 += '=='.slice(0, paddingLength);

        return Buffer.from(base64, 'base64').toString('utf8');
    }

    #isTokenExpired(expireAt) {
        const now = new Date();
        const expirationDate = new Date(expireAt);

        return (expirationDate.getTime() - now.getTime()) < 0;
    }

    #signToken(secret, headerPayload) {
        const signature = crypto.createHmac('sha256', secret)
            .update(headerPayload)
            .digest('base64url');

        return signature;
    }

    /**
     * @function verify
     * @param {string} token 
     * @param {string} secret 
     * @returns {object}
     * 
     * @description
     * This function validates a JWT's authenticity by:
     * 1. Recreating the expected signature using the same
     * algorithm and secret key used during token creation.
     * 2. Comparing the recreated signature to the signature included 
     * in the JWT.
     * If the signatures match, indicating that the token has not 
     * been tampered with, the function decodes and returns the JWT's 
     * payload as a UTF-8 encoded object.
     * Otherwise, if the signatures do not match, an "Invalid token" 
     * error is thrown.
     */
    verify(token, secret) {
        let encodedHeader, encodedPayload, signature
        [encodedHeader, encodedPayload, signature] = token.split('.');

        const encodedHeaderPayload = encodedHeader + "." + encodedPayload;
        const compSignature = this.#signToken(secret, encodedHeaderPayload);

        if (compSignature !== signature)
            throw Error('Failed to verified token, invalid signature');

        const decodedPayload = JSON.parse(this.#base64UrlDecode(encodedPayload));

        if (this.#isTokenExpired(decodedPayload.expat))
            throw Error('Token expired');

        return decodedPayload;
    }

    /**
     * @function sign
     * @param {object} data 
     * @param {string} secret 
     * @param {{duration: number}} expirationOptions 
     * @returns {string}
     * 
     * @description
     * Creates a JSON Web Token (JWT) for user authentication.
     *
     * Uses symmetric encryption to sign the JWT's header and payload.
     *
     * **Important:** The payload is not encrypted.
     * Do not include sensitive information like credentials.
     *
     * Use the `verify` method to validate the token's authenticity and integrity.
     */
    sign(data, secret, expirationOptions = { duration: 15 }) {

        const now = new Date();
        const experationDate = new Date(now.getTime() +
            expirationOptions.duration * 60 * 1000);

        const header = {
            alg: 'HS256',
            typ: 'JWT'
        }

        const payload = {
            data,
            iat: now,
            expat: experationDate
        }

        const encodedHeader = this.#base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.#base64UrlEncode(JSON.stringify(payload));

        this.jwt = encodedHeader + "." + encodedPayload;
        this.jwt += "." + this.#signToken(secret, this.jwt);

        return this.jwt;
    }
}

export default Jwt;