import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_CHANGING_CLASS, CIRCLE_CLASS, CIRCLE_DEFAULT_CLASS, CIRCLE_MODIFIED_CLASS, INPUT_ELEMENT, LOADER_CLASS, RECURSION_PAGE } from "../constants/constants";


describe('Строка', () => {
    beforeEach(() => {
        cy.visit(RECURSION_PAGE);
    });

    it('Если в инпуте пусто, то кнопка добавления недоступна', () => {
        cy.get('button').last().as('button');
        cy.get('@button').contains('Развернуть');
        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).should('have.value', '');
    });

    it('Строка разворачивается корректно', () => {
        const testString = 'abcd';

        cy.get('button').last().as('button');
        cy.get('@button').contains('Развернуть');
        cy.get(INPUT_ELEMENT).type(testString);
        cy.get(INPUT_ELEMENT).should('have.value', testString);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.get('@button')
            .invoke("attr", "class")
            .then((className) => expect(className).contains(LOADER_CLASS));

        cy.get(CIRCLE_CLASS).then((items) => {
            items.each(item => {
                cy.get(items[item]).as('circle_left');
                cy.get(items[testString.length - item - 1]).as('circle_right');

                cy.get(items[item]).children().should('have.text', testString[item]);
                cy.get('@circle_left').invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
                cy.get('@circle_right').invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            })
        });

        cy.get('@button').should('be.disabled');

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            items.each(item => {
                cy.get(items[item]).as('circle_left');
                cy.get(items[testString.length - item - 1]).as('circle_right');

                cy.get(items[item]).children().should('have.text', testString[item]);

                cy.get('@circle_left').invoke("attr", "class")
                    .then((className) => expect(className).contains(item === 0 || item === 3 ? CIRCLE_CHANGING_CLASS : CIRCLE_DEFAULT_CLASS));
                cy.get('@circle_right').invoke("attr", "class")
                    .then((className) => expect(className).contains(item === 0 || item === 3 ? CIRCLE_CHANGING_CLASS : CIRCLE_DEFAULT_CLASS));
            })
        });

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@button').should('be.disabled');

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).children().should('have.text', testString[3]);
            cy.get(items[3]).children().should('have.text', testString[0]);

            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
            cy.get(items[3]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));

            cy.get(items[1]).children().should('have.text', testString[1]);
            cy.get(items[2]).children().should('have.text', testString[2]);

            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[2]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
        });

        cy.get('@button').should('be.disabled');

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            items.each(item => {
                cy.get(items[item]).as('circle_left');
                cy.get(items[testString.length - item - 1]).as('circle_right');

                cy.get(items[item]).children().should('have.text', testString[testString.length - item - 1]);

                cy.get('@circle_left').invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
                cy.get('@circle_right').invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
            })
        });

        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).should('have.value', '');
    });
});
