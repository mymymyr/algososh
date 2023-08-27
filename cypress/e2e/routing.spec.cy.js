import { FIBONACCI_PAGE, LIST_PAGE, QUEUE_PAGE, RECURSION_PAGE, SORTING_PAGE, STACK_PAGE } from '../constants/constants';

describe('Переход по страницам', function () {
    beforeEach(function () {
        cy.visit('/');
    });

    const hrefPathSelector = (url) => `a[href="${url}"]`

    const checkMainLinks = () => {
        cy.get(hrefPathSelector(RECURSION_PAGE)).should('be.visible');
        cy.get(hrefPathSelector(FIBONACCI_PAGE)).should('be.visible');
        cy.get(hrefPathSelector(SORTING_PAGE)).should('be.visible');
        cy.get(hrefPathSelector(STACK_PAGE)).should('be.visible');
        cy.get(hrefPathSelector(QUEUE_PAGE)).should('be.visible');
        cy.get(hrefPathSelector(LIST_PAGE)).should('be.visible');
    }

    it('Проверит доступность главной страницы', function () {
        checkMainLinks();
    });

    it('Проверит доступность страницы со строкой', function () {
        cy.get(hrefPathSelector(RECURSION_PAGE)).click();
        cy.contains('Строка');
        cy.contains('К оглавлению');
    });

    it('Проверит доступность страницы с последовательностью Фибоначчи', function () {
        cy.get(hrefPathSelector(FIBONACCI_PAGE)).click();
        cy.contains('Последовательность Фибоначчи');
        cy.contains('К оглавлению');
    });

    it('Проверит доступность страницы с сортировкой массива', function () {
        cy.get(hrefPathSelector(SORTING_PAGE)).click();
        cy.contains('Сортировка массива');
        cy.contains('К оглавлению');
    });

    it('Проверит доступность страницы со стеком', function () {
        cy.get(hrefPathSelector(STACK_PAGE)).click();
        cy.contains('Стек');
        cy.contains('К оглавлению');
    });

    it('Проверит доступность страницы с очередью', function () {
        cy.get(hrefPathSelector(QUEUE_PAGE)).click();
        cy.contains('Очередь');
        cy.contains('К оглавлению');
    });

    it('Проверит доступность страницы со связным списком', function () {
        cy.get(hrefPathSelector(LIST_PAGE)).click();
        cy.contains('Связный список');
        cy.contains('К оглавлению');
    });

    it('Проверит возврат к главной странице', function () {
        cy.get(hrefPathSelector(RECURSION_PAGE)).click();
        cy.contains('К оглавлению').click();
        checkMainLinks();
    });
});
