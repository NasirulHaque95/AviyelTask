/// <reference types="Cypress" />

describe("Find all url in the web page and check if the links are valid and exists & Verify web pages header meta tags for SEO,", () => {
    it("Should be able to Find all the valid url's", () => {
        cy.visit('http://uitestingplayground.com/home')
        cy.get("a").each($a => {
            const message = $a.text();
            expect($a, message).to.have.attr("href").not.contain("undefined")
            cy.log($a.attr('href'));
          });
    });
    it('Chack the validity of all links on the page', () => {

        cy.visit('http://uitestingplayground.com/home')
        cy.get('a').each(page => {
          cy.request(page.prop('href'))
          .then(response => {
            expect(response.status).to.eq(200)
          })
        })
      });
      
    it("Should Verify SEO header meta tags", () => {
        cy.visit('http://uitestingplayground.com/home')
        cy.title().should("eq", "UI Test Automation Playground");
    });
})