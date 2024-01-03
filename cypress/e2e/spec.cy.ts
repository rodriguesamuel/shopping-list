describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  });
});

describe('Auth', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  });
  it('clicks the link authenticate and shold go to auth page', () => {

    cy.visit('http://localhost:4200/shopping-list');

    cy.contains('Authenticate').click();

    cy.url().should('include', '/auth');
  });
});

describe('Add', () => {
  it('Add item', () => {
    cy.visit('http://localhost:4200/shopping-list');

    cy.get('#name').type('farinha');
    cy.get('#amount').type('2');

    cy.contains('Add').click();

    cy.get('.list-group-item').should('have.length', 3);
  });
});

describe('Clear', () => {
  it('Add item', () => {
    cy.visit('http://localhost:4200/shopping-list');

    cy.get('#name').type('farinha');
    cy.get('#amount').type('2');

    cy.contains('Clear').click();

    cy.get('#name').should('have.value', '')
  });

  it('Delete item', () => {
    cy.visit('http://localhost:4200/shopping-list');

    cy.get('#name').type('farinha');
    cy.get('#amount').type('2');

    cy.contains('Add').click();

    cy.contains('farinha').click();
    cy.contains('Delete').click();

    cy.get('.list-group-item').should('have.length', 2);
  });
});

