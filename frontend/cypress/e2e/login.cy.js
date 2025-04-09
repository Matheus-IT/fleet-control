describe('Navigation', () => {
  it('should navigate to the about page', () => {
    cy.login('supervisor@supervisor.com', '123');

    cy.url().should('include', '/')
  })
})