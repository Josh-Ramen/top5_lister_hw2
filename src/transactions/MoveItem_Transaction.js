import jsTPS_Transaction from "../tps/jsTPS.js"

/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
 export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initMethod, initOld, initNew) {
        super();
        this.method = initMethod;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.method(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.method(this.newItemIndex, this.oldItemIndex);
    }
}