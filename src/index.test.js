/* eslint-env node, mocha */

import { expect } from 'chai';
import myLibrary from './index';

describe('My Library', () => {
    it('should exist', () => {
        expect(myLibrary).to.be.a('number');
    });

    it('should export 137', () => {
        expect(myLibrary).to.equal(137);
    });
});
