import '../styles/default.scss';

var all = 4;
var completed = 1;
var mode = 'all';

document.addEventListener("DOMContentLoaded", function () {
    Count(all - completed);
    var todoInput = document.querySelector('.todo-creator_text-input');
    var list = document.querySelector('.todos-list');
    var clear = document.querySelector('.todos-toolbar_clear-completed');
    var buttons = document.querySelector('.filters.todos-toolbar_filters');
    var checkbut = document.querySelector('.todo-creator_check-all');
    var form = document.querySelector('.todo-creator');

    todoInput.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            processingInput();
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    clear.addEventListener('click', function () {
        var checkboxes = list.querySelectorAll('.custom-checkbox_target');
        for (var i = checkboxes.length - 1; i >= 0; i--) {
            var item = checkboxes[i].closest('.todos-list_item');
            if (checkboxes[i].checked) {
                item.parentNode.removeChild(item);
            }
        }
        Count();
    });

    buttons.addEventListener('click', function (e) {
        changeMode(e.target.id);
    });

    checkbut.addEventListener('mouseup', function (e) {
        var checkboxes = list.querySelectorAll('.custom-checkbox_target');
        for (var i = 0; i < checkboxes.length; i++) {
            var item = checkboxes[i].closest('.todos-list_item');
            item.classList.add('__completed');
            checkboxes[i].checked = true;
            checkItem(item);
        }
        Count();
    });

    function processingInput() {
        var text = todoInput.value.trim();
        if (text.length !== 0) {
            add(text);
            todoInput.value = '';
        }
    }


});

function add(text) {
    var list = document.querySelector('.todos-list');
    list.insertAdjacentHTML("beforeEnd", resolveTemplate('listItem', {text: text}));
    var removeItems = list.querySelectorAll('.todos-list_item_remove');
    removeItems[removeItems.length - 1].addEventListener(
        'click',
        function () {
            var item = this.closest('.todos-list_item');
            item.parentNode.removeChild(item);
        }
    );
    var checkItems = list.querySelectorAll('.custom-checkbox_target');
    checkItems[checkItems.length - 1].addEventListener(
        'click',
        function () {
            var item = this.closest('.todos-list_item');
            if (item.classList.contains('__completed'))
                item.classList.remove('__completed');
            else
                item.classList.add('__completed');
            checkItem(item);
            Count();
        }
    );
    var textAreas = list.querySelectorAll('.todos-list_item_text');
    textAreas[textAreas.length - 1].addEventListener('keyup', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px'
    });

    var items = document.querySelectorAll('.todos-list_item');
    checkItem(items[items.length - 1]);
    all++;
    Count();
}

function Count() {
    var board = document.querySelector('.todo-board');
    var list = document.getElementsByClassName('todos-list_item');
    all = list.length;
    completed = 0;
    for (var i = 0; i < all; i++)
        if (list[i].classList.contains('__completed'))
            completed++;

    document.querySelector('.todos-toolbar_unready-counter').innerHTML = (all - completed) + ' items left';
    if (all > 0)
        board.classList.add('__has-content');
    else
        board.classList.remove('__has-content');
    updateBoard();
}

function clearButtons() {
    var filters = document.querySelectorAll('.filters-item');
    for (var j = 0; j < filters.length; j++)
        filters[j].classList.remove('__selected');

}

function changeMode(value) {
    if (value !== '') {
        mode = value;
        clearButtons();
        document.getElementById(mode).classList.add('__selected');
        updateBoard();
    }
    var items = document.getElementsByClassName('todos-list_item');
    for (var i = 0; i < items.length; i++) {
        var checkbox = document.getElementsByClassName('custom-checkbox_target')[i];
        switch (mode) {
            case 'active':
                if (checkbox.checked)
                    items[i].classList.add('__hidden');
                else
                    items[i].classList.remove('__hidden');
                break;
            case 'completed':
                if (!checkbox.checked)
                    items[i].classList.add('__hidden');
                else
                    items[i].classList.remove('__hidden');
                break;
            case 'all':
                items[i].classList.remove('__hidden');

        }
    }
}

function updateBoard() {
    var toolbar = document.querySelector('.todos-toolbar');
    if (all > 4 && mode === 'all' || completed > 4 && mode === 'completed' || all - completed > 4 && mode === 'active')
        toolbar.classList.add('__no-border');
    else
        toolbar.classList.remove('__no-border');
}

function resolveTemplate(templateId, templateData) {
    return document.getElementById(templateId).innerHTML.replace(
        /{([^{}]*)}/g,
        function (foundSubstring, dataKey) {

            var result = templateData[dataKey];

            return typeof result === 'string'
            || typeof result === 'number'
                ? result
                : foundSubstring;
        }
    );
}

function checkItem(item) {
    if (item.classList.contains('__completed')) {
        if (mode === 'active')
            item.classList.add('__hidden');
        else if (mode === 'completed')
            item.classList.remove('__hidden');
    } else {
        if (mode === 'active')
            item.classList.remove('__hidden');
        else if (mode === 'completed')
            item.classList.add('__hidden');
    }
}

