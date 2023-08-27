import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_CHANGING_CLASS, CIRCLE_DEFAULT_CLASS, CIRCLE_TEXT, HEAD, INPUT_ELEMENT, LOADER_CLASS, QUEUE_PAGE, TAIL } from "../constants/constants";

describe('Очередь', () => {
    beforeEach(() => {
        cy.visit(QUEUE_PAGE);
    });

    it('Если в инпуте пусто, то кнопка добавления недоступна', () => {
        cy.contains('Добавить').as('button');
        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).should('have.value', '');
    });

    it('Добавление элемента в очередь', () => {
        const resNumbers = [1, 1, 2, 3, 5];

        const checkResNumber = (count, items) => {
            for (let i = 0; i <= count; i++) {
                cy.get(items[i]).parent().invoke("attr", "class")
                    .then((className) => expect(className).contains(count === i ? CIRCLE_CHANGING_CLASS : CIRCLE_DEFAULT_CLASS));
            }
        }

        cy.get('button').eq(1).as('button');
        cy.get('@button').should('have.text', 'Добавить');
        cy.get('@button').should('be.disabled');

        for (let i = 0; i < resNumbers.length; i++) {
            cy.get(INPUT_ELEMENT).type(resNumbers[i]);
            cy.get(INPUT_ELEMENT).should('have.value', resNumbers[i]);
            cy.get('@button').should('be.enabled');
            cy.get('@button').click();
            cy.get('@button')
                .invoke("attr", "class")
                .then((className) => expect(className).contains(LOADER_CLASS));
            cy.get(CIRCLE_TEXT).then((items) => {
                checkResNumber(i, items);
            });
            cy.wait(SHORT_DELAY_IN_MS);
            cy.get(CIRCLE_TEXT).then((items) => {
                cy.get(items[0]).parent().parent().should('contains.text', HEAD);
                cy.get(items[i]).should('have.text', resNumbers[i]);
                cy.get(items[i]).parent().parent().should('contains.text', TAIL);
            });

        }
    });

    it('Удаление элемента из очереди', () => {
        cy.get('button').eq(2).as('removeButton');
        cy.get('button').eq(1).as('button');
        cy.get('@button').should('have.text', 'Добавить');
        cy.get('@removeButton').should('have.text', 'Удалить');
        cy.get('@removeButton').should('be.disabled');

        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).type(4);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@removeButton').should('be.enabled');
        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).type(3);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@removeButton').should('be.enabled');

        cy.get('@removeButton').click();

        cy.get('@removeButton')
            .invoke("attr", "class")
            .then((className) => expect(className).contains(LOADER_CLASS));

        cy.get(CIRCLE_TEXT).then((items) => {
            cy.get(items[0]).should('have.text', '4');
            cy.get(items[0]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[1]).should('have.text', '3');
            cy.get(items[1]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));

        });

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get(CIRCLE_TEXT).then((items) => {
            cy.get(items[0]).should('have.text', '');
            cy.get(items[0]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            cy.get(items[1]).should('have.text', '3');
            cy.get(items[1]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));

            cy.get(items[0]).parent().parent().should('not.contains.text', TAIL);
            cy.get(items[0]).parent().parent().should('not.contains.text', HEAD);
            cy.get(items[1]).parent().parent().should('contains.text', HEAD);
            cy.get(items[1]).parent().parent().should('contains.text', TAIL);
        });
    });

    it('Поведение кнопки «Очистить»', () => {
        cy.get('button').eq(3).as('clearButton');
        cy.get('button').eq(1).as('button');
        cy.get('@button').should('have.text', 'Добавить');
        cy.get('@clearButton').should('have.text', 'Очистить');

        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).type(4);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@clearButton').should('be.enabled');
        cy.get('@button').should('be.disabled');
        cy.get(INPUT_ELEMENT).type(3);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@clearButton').should('be.enabled');

        cy.get('@clearButton').click();

        cy.get('[class^="queue-page_circles"]').should('have.text', '0123456');
    });
});
