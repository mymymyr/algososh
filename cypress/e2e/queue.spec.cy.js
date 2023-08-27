import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";

describe('Очередь', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/queue');
    });

    it('Если в инпуте пусто, то кнопка добавления недоступна', () => {
        cy.contains('Добавить').as('button');
        cy.get('@button').should('be.disabled');
        cy.get('input').should('have.value', '');
    });

    it('Добавление элемента в очередь', () => {
        const resNumbers = [1, 1, 2, 3, 5];

        const checkResNumber = (count, items) => {
            for (let i = 0; i <= count; i++) {
                cy.get(items[i]).parent().invoke("attr", "class")
                    .then((className) => expect(className).contains(count === i ? 'circle_changing' : 'circle_default'));
            }
        }

        cy.get('button').eq(1).as('button');
        cy.get('@button').should('have.text', 'Добавить');
        cy.get('@button').should('be.disabled');

        for (let i = 0; i < resNumbers.length; i++) {
            cy.get('input').type(resNumbers[i]);
            cy.get('input').should('have.value', resNumbers[i]);
            cy.get('@button').should('be.enabled');
            cy.get('@button').click();
            cy.get('@button')
                .invoke("attr", "class")
                .then((className) => expect(className).contains('loader'));
            cy.get('[class^="text text_type_circle"]').then((items) => {
                checkResNumber(i, items);
            });
            cy.wait(SHORT_DELAY_IN_MS);
            cy.get('[class^="text text_type_circle"]').then((items) => {
                cy.get(items[0]).parent().parent().should('contains.text', 'head');
                cy.get(items[i]).should('have.text', resNumbers[i]);
                cy.get(items[i]).parent().parent().should('contains.text', 'tail');
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
        cy.get('input').type(4);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@removeButton').should('be.enabled');
        cy.get('@button').should('be.disabled');
        cy.get('input').type(3);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@removeButton').should('be.enabled');

        cy.get('@removeButton').click();

        cy.get('@removeButton')
            .invoke("attr", "class")
            .then((className) => expect(className).contains('loader'));

        cy.get('[class^="text text_type_circle"]').then((items) => {
            cy.get(items[0]).should('have.text', '4');
            cy.get(items[0]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains('circle_changing'));
            cy.get(items[1]).should('have.text', '3');
            cy.get(items[1]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains('circle_default'));

        });

        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('[class^="text text_type_circle"]').then((items) => {
            cy.get(items[0]).should('have.text', '');
            cy.get(items[0]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains('circle_default'));
            cy.get(items[1]).should('have.text', '3');
            cy.get(items[1]).parent().invoke("attr", "class")
                .then((className) => expect(className).contains('circle_default'));

            cy.get(items[0]).parent().parent().should('not.contains.text', 'tail');
            cy.get(items[0]).parent().parent().should('not.contains.text', 'head');
            cy.get(items[1]).parent().parent().should('contains.text', 'head');
            cy.get(items[1]).parent().parent().should('contains.text', 'tail');
        });
    });

    it('Поведение кнопки «Очистить»', () => {
        cy.get('button').eq(3).as('clearButton');
        cy.get('button').eq(1).as('button');
        cy.get('@button').should('have.text', 'Добавить');
        cy.get('@clearButton').should('have.text', 'Очистить');

        cy.get('@button').should('be.disabled');
        cy.get('input').type(4);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@clearButton').should('be.enabled');
        cy.get('@button').should('be.disabled');
        cy.get('input').type(3);
        cy.get('@button').should('be.enabled');
        cy.get('@button').click();
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('@clearButton').should('be.enabled');

        cy.get('@clearButton').click();

        cy.get('[class^="queue-page_circles"]').should('have.text', '0123456');
    });
});