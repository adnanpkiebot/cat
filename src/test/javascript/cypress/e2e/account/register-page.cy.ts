import {
  usernameRegisterSelector,
  emailRegisterSelector,
  firstPasswordRegisterSelector,
  secondPasswordRegisterSelector,
  submitRegisterSelector,
  classInvalid,
  classValid,
} from '../../support/commands';

describe('/account/register', () => {
  beforeEach(() => {
    cy.visit('/account/register');
  });

  beforeEach(() => {
    cy.intercept('POST', '/api/register').as('registerSave');
  });

  it('should be accessible through menu', () => {
    cy.visit('');
    cy.clickOnRegisterItem();
    cy.url().should('match', /\/account\/register$/);
  });

  it('should load the register page', () => {
    cy.get(submitRegisterSelector).should('be.visible');
  });

  it('requires username', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(usernameRegisterSelector).should('have.class', classInvalid);
    cy.get(usernameRegisterSelector).type('test');
    cy.get(usernameRegisterSelector).blur();
    cy.get(usernameRegisterSelector).should('have.class', classValid);
  });

  it('should not accept invalid email', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(emailRegisterSelector).should('have.class', classInvalid);
    cy.get(emailRegisterSelector).type('testtest.fr');
    cy.get(emailRegisterSelector).blur();
    cy.get(emailRegisterSelector).should('have.class', classInvalid);
  });

  it('requires email in correct format', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(emailRegisterSelector).should('have.class', classInvalid);
    cy.get(emailRegisterSelector).type('test@test.fr');
    cy.get(emailRegisterSelector).blur();
    cy.get(emailRegisterSelector).should('have.class', classValid);
  });

  it('requires first password', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid);
    cy.get(firstPasswordRegisterSelector).type('test@test.fr');
    cy.get(firstPasswordRegisterSelector).blur();
    cy.get(firstPasswordRegisterSelector).should('have.class', classValid);
  });

  it('requires password and confirm password to be same', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid);
    cy.get(firstPasswordRegisterSelector).type('test');
    cy.get(firstPasswordRegisterSelector).blur();
    cy.get(firstPasswordRegisterSelector).should('have.class', classValid);
    cy.get(secondPasswordRegisterSelector).should('have.class', classInvalid);
    cy.get(secondPasswordRegisterSelector).type('test');
    cy.get(secondPasswordRegisterSelector).blur();
    cy.get(secondPasswordRegisterSelector).should('have.class', classValid);
  });

  it('requires password and confirm password have not the same value', () => {
    cy.get(submitRegisterSelector).click();
    cy.get(firstPasswordRegisterSelector).should('have.class', classInvalid);
    cy.get(firstPasswordRegisterSelector).type('test');
    cy.get(firstPasswordRegisterSelector).blur();
    cy.get(firstPasswordRegisterSelector).should('have.class', classValid);
    cy.get(secondPasswordRegisterSelector).should('have.class', classInvalid);
    cy.get(secondPasswordRegisterSelector).type('otherPassword');
    cy.get(secondPasswordRegisterSelector).blur();
    cy.get(secondPasswordRegisterSelector).should('have.class', classInvalid);
  });

  it('register a valid user', () => {
    const randomEmail = 'Alphonso.Conroy@gmail.com';
    const randomUsername = 'Roberto_Gislason-Langworth';
    cy.get(usernameRegisterSelector).type(randomUsername);
    cy.get(emailRegisterSelector).type(randomEmail);
    cy.get(firstPasswordRegisterSelector).type('jondoe');
    cy.get(secondPasswordRegisterSelector).type('jondoe');
    cy.get(submitRegisterSelector).click();
    cy.wait('@registerSave').then(({ response }) => expect(response.statusCode).to.equal(201));
  });
});
