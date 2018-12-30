import {createFromTemplate} from '../../utils/templatesManager';

const COMPLETED_VALUE = '__completed';
const HIDDEN_VALUE = '__hidden';

export class TodoListComponent {

    constructor(root, todoList) {
        this._root = root;
        this._list = todoList;
    }

    _setReadyModificator(item, value) {
        if (value === true)
            item.classList.add(COMPLETED_VALUE);
        else
            item.classList.remove(COMPLETED_VALUE);

        item.querySelector('.custom-checkbox_target').checked = value;
    }

    checkVisibility(item) {
        switch (this._list.getFilter()) {
            case 'all':
                item.classList.remove(HIDDEN_VALUE);
                break;
            case 'active':
                if (item.classList.contains('__completed'))
                    item.classList.add(HIDDEN_VALUE);
                else
                    item.classList.remove(HIDDEN_VALUE);
                break;
            case 'completed':
                if (!item.classList.contains('__completed'))
                    item.classList.add(HIDDEN_VALUE);
                else
                    item.classList.remove(HIDDEN_VALUE);
                break
        }
    }

    markAsDone(item) {
        this._setReadyModificator(item, true);
        this.checkVisibility(item);
    }

    removeTodo(item) {
        item.parentNode.removeChild(item);
        this._list.trigger('itemDelete');
    }

    editState(item) {
        if (item.classList.contains(COMPLETED_VALUE))
            this._setReadyModificator(item, false);
        else
            this._setReadyModificator(item, true);
        this._list.trigger('itemCheck');
        this.checkVisibility(item);
    }


    addTodo(todoText) {
        const newItemHTML = createFromTemplate(
            'todoItemTemplate',
            {
                text: todoText,
            }
        );
        console.log(newItemHTML);
        this._root.appendChild(newItemHTML);

        var removeItems = this._root.querySelectorAll('.todos-list_item_remove');
        var checkItems = this._root.querySelectorAll('.custom-checkbox_target');
        var removeItem = removeItems[removeItems.length - 1];
        var checkItem = checkItems[checkItems.length - 1];
        var parent = this;
        removeItem.addEventListener('click', function () {
            parent.removeTodo(this.closest('.todos-list_item'));
        });

        checkItem.addEventListener('click', function () {
            parent.editState(this.closest('.todos-list_item'));
        });
        this.checkVisibility(this._root.lastChild);

    }


}

