describe('Testing User Onboarding form', function () {
    beforeEach(function() {
        cy.visit('http://localhost:3000/')
    })

    it('Tests inputs, textarea, checkbox, and submit button', function(){
        cy.get('input[name="name"]')
        .type('Drew')
        .should('have.value', 'Drew')
        cy.get('input[name="email"]')
        .type('drew@drew.com')
        .should('have.value', 'drew@drew.com')
        cy.get('#password')
        .type('123456')
        .should('have.value', '123456')
        cy.get('[type=checkbox]')
        .check()
        .should('be.checked')
        cy.get('[data-cy="submit"]')
        .click()
    })
})