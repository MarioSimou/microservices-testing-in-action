/// <reference types="Cypress" />

import hello from '../fixtures/hello.json';
import helloFoo from '../fixtures/helloFoo.json';

describe('Home page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/hello/foo', { fixture: 'helloFoo.json' }).as('getHelloFoo');
    cy.intercept('GET', '/hello', { fixture: 'hello.json' }).as('getHello');
    cy.visit('/');
  });

  it('should render the responses', () => {
    cy.wait(['@getHello', '@getHelloFoo']);

    cy.get('div[data-testid="helloPlain"]').contains(JSON.stringify(hello));
    cy.get('div[data-testid="helloWithName"]').contains(JSON.stringify(helloFoo));
  });
});
