import jsTPS_Transaction from "../tps/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initMethod, initIndex, initOldItem, initNewItem) {
        super();

        this.method = initMethod;
        this.index = initIndex;
        this.oldItem = initOldItem;
        this.newItem = initNewItem;
    }
    doTransaction() {
        this.method(this.index, this.newItem);
    }
    
    undoTransaction() {
        this.method(this.index, this.oldItem);
    }
}