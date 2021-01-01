/// <reference types="Cypress" />

import hello from '../fixtures/hello.json';
import helloFoo from '../fixtures/helloFoo.json';

describe('Home page', () => {
  it('should render the responses', () => {
    cy.visit('/');
    cy.get('div[data-testid="helloPlain"]').contains('div', JSON.stringify(hello));
    cy.get('div[data-testid="helloWithName"]').contains('div', JSON.stringify(helloFoo));
  });
});
