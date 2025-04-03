describe('Navigation', () => {
  it('should navigate to the about page', () => {
    cy.visit('/login')

    cy.get('input[name="email"]').type('supervisor@supervisor.com')

    cy.get('input[name="password"]').type('123')


    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/')
  })
})