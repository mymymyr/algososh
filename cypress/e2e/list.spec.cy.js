import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_CHANGING_CLASS, CIRCLE_CLASS, CIRCLE_DEFAULT_CLASS, CIRCLE_MODIFIED_CLASS, HEAD, INPUT_ELEMENT, LIST_PAGE, TAIL } from "../constants/constants";

describe('Список', () => {
    beforeEach(() => {
        cy.visit(LIST_PAGE);
    });

    it('Если в инпуте пусто, то кнопка добавления недоступна', () => {
        cy.get(INPUT_ELEMENT).should('have.value', '');

        cy.contains('Добавить в head').as('addToHeadBtn');
        cy.get('@addToHeadBtn').should('be.disabled');

        cy.contains('Добавить в tail').as('addToTailBtn');
        cy.get('@addToTailBtn').should('be.disabled');

        cy.contains('Добавить по индексу').as('addByIndexBtn');
        cy.get('@addByIndexBtn').should('be.disabled');

        cy.contains('Удалить по индексу').as('delByIndexBtn');
        cy.get('@delByIndexBtn').should('be.disabled');
    });

    it('Отрисовка дефолтного списка', () => {
        cy.get(CIRCLE_CLASS).then((items) => {
            const count = items.length;
            for (let i = 0; i < count; i++) {
                cy.get(items[i]).invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            }
            cy.get(items[0]).parent().should('contains.text', HEAD);
            cy.get(items[count - 1]).parent().should('contains.text', TAIL)
        });
    });

    it('Добавление элемента в head', () => {
        cy.get(INPUT_ELEMENT).eq(0).type(4);
        cy.contains('Добавить в head').as('addToHeadBtn');
        cy.get('@addToHeadBtn').should('be.enabled');
        cy.get('@addToHeadBtn').click();

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).parent().should('contains.text', '4');
            cy.get(items[0]).parent().should('not.contains.text', HEAD);
            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).parent().should('contains.text', '4');
            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
            cy.get(items[0]).parent().should('contains.text', HEAD);

        });

        cy.wait(DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).parent().should('contains.text', '4');
            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            cy.get(items[0]).parent().should('contains.text', HEAD);
        });
    });

    it('Добавление элемента в tail', () => {
        cy.get(INPUT_ELEMENT).eq(0).type(4);
        cy.contains('Добавить в tail').as('addToTailBtn');
        cy.get('@addToTailBtn').should('be.enabled');
        cy.get('@addToTailBtn').click();

        cy.get(CIRCLE_CLASS).then((items) => {
            const count = items.length;

            cy.get(items[count - 2]).parent().should('contains.text', '4');
            cy.get(items[count - 2]).parent().should('not.contains.text', HEAD);
            cy.get(items[count - 2]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            const count = items.length;
            cy.get(items[count - 1]).parent().should('contains.text', '4');
            cy.get(items[count - 1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
            cy.get(items[count - 1]).parent().should('contains.text', TAIL);

        });

        cy.wait(DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            const count = items.length;

            cy.get(items[count - 1]).parent().should('contains.text', '4');
            cy.get(items[count - 1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            cy.get(items[count - 1]).parent().should('contains.text', TAIL);
        });
    });

    it('Добавление элемента по индексу', () => {
        cy.get(INPUT_ELEMENT).eq(0).type(4);
        cy.get(INPUT_ELEMENT).eq(1).type(1);

        cy.contains('Добавить по индексу').as('addByIndexBtn');
        cy.get('@addByIndexBtn').should('be.enabled');
        cy.get('@addByIndexBtn').click();

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).parent().should('contains.text', '4');
            cy.get(items[0]).parent().should('not.contains.text', HEAD);
            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[1]).parent().should('contains.text', '4');
            cy.get(items[1]).parent().should('not.contains.text', HEAD);
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[1]).parent().should('contains.text', '4');
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
        });

        cy.wait(DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[1]).parent().should('contains.text', '4');
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
        });
    });

    it('Удаление элемента из head', () => {
        let data = [];
        cy.get(CIRCLE_CLASS).children().each((child) => {
            data.push(child.text());
        })

        cy.contains('Удалить из head').as('delByHeadBtn');
        cy.get('@delByHeadBtn').should('be.enabled');
        cy.get('@delByHeadBtn').click();

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).parent().should('contains.text', data[0]);
            cy.get(items[0]).parent().should('contains.text', HEAD);
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[0]).should('have.text', '');
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            cy.get(items[0]).should('have.text', data[1]);
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[0]).parent().should('contains.text', HEAD);

        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            for (let i = 0; i < items.length; i++) {
                cy.get(items[i]).parent().should('contains.text', data[i + 1]);
                cy.get(items[i]).invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            }
            cy.get(items[0]).parent().should('contains.text', HEAD);
        });
    });

    it('Удаление элемента из tail', () => {
        let data = [];
        cy.get(CIRCLE_CLASS).children().each((child) => {
            data.push(child.text());
        })

        cy.contains('Удалить из tail').as('delByTailBtn');
        cy.get('@delByTailBtn').should('be.enabled');
        cy.get('@delByTailBtn').click();

        cy.get(CIRCLE_CLASS).then((items) => {
            expect(items.length - 1).to.equal(data.length);

            const count = items.length;
            cy.get(items[count - 1]).parent().should('contains.text', data[count - 2]);
            cy.get(items[count - 1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[count - 2]).should('have.text', '');
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            expect(items.length - 1).to.equal(data.length);

            const count = items.length;

            cy.get(items[count - 1]).should('have.text', data[count - 2]);

            cy.get(items[count - 1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[0]).parent().should('contains.text', HEAD);

        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            for (let i = 0; i < items.length; i++) {
                cy.get(items[i]).parent().should('contains.text', data[i]);
                cy.get(items[i]).invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            }
            cy.get(items[0]).parent().should('contains.text', HEAD);
        });
    });

    it('Удаление элемента по индексу', () => {
        let data = [];
        cy.get(CIRCLE_CLASS).children().each((child) => {
            data.push(child.text());
        })
        cy.get(INPUT_ELEMENT).eq(1).type(1);
        cy.contains('Удалить по индексу').as('delByIndexBtn');
        cy.get('@delByIndexBtn').should('be.enabled');
        cy.get('@delByIndexBtn').click();

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            expect(items.length).to.equal(data.length);
            const count = items.length;
            cy.get(items[1]).parent().should('contains.text', data[1]);
            cy.get(items[0]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_CHANGING_CLASS));
            cy.get(items[1]).should('have.text', '');
            cy.get(items[1]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_MODIFIED_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            const index = items.length > 1 ? 1 : 0;
            cy.get(items[index]).should('have.text', data[index === 0 ? 0 : index + 1]);

            cy.get(items[index]).invoke("attr", "class")
                .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
        });

        cy.wait(SHORT_DELAY_IN_MS);

        cy.get(CIRCLE_CLASS).then((items) => {
            for (let i = 0, j = 0; i < items.length; i++, j++) {
                if (i == 1) {
                    j += 1;
                }
                cy.get(items[i]).parent().should('contains.text', data[j]);
                cy.get(items[i]).invoke("attr", "class")
                    .then((className) => expect(className).contains(CIRCLE_DEFAULT_CLASS));
            }
            cy.get(items[0]).parent().should('contains.text', HEAD);
        });
    });
});
