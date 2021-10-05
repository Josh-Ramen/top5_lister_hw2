import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './tps/jsTPS';
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction';
import MoveItem_Transaction from './transactions/MoveItem_Transaction';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // THIS WILL HANDLE TRANSACTIONS
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            keyNamePairMarkedForDeletion: null,
            moveStartIndex: null,
            moveEndIndex: null,
            canClose: false,
            canUndo: false,
            canRedo: false,
            editing: false,
            keysDown: []
        }
    }
    updateUndoRedo = () => {
        if (this.tps.hasTransactionToUndo() && !this.state.editing) {
            this.setState({
                canUndo: true
            })
        } else {
            this.setState({
                canUndo: false
            })
        }
        if (this.tps.hasTransactionToRedo() && !this.state.editing) {
            this.setState({
                canRedo: true
            })
        } else {
            this.setState({
                canRedo: false
            })
        }
    }
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.updateUndoRedo();
        }
    }
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.updateUndoRedo();
        }
    }
    editing = (isEditing) => {
        this.setState(({
            editing: isEditing
        }), () => {
            this.updateUndoRedo();
        })
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        this.closeCurrentList();

        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);

            // ALSO ENABLE THE CLOSE BUTTON
            this.setState({
                canClose: true
            })
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
            this.tps.clearAllTransactions();
            this.updateUndoRedo();
        });
    }
    addChangeItemTransaction = (index, newItem) => {
        let oldItem = this.state.currentList.items[index];
        if (oldItem !== newItem) {
            let transaction = new ChangeItem_Transaction(this.renameListItem, index, oldItem, newItem);
            this.tps.addTransaction(transaction);
            this.updateUndoRedo();
        } 
    }
    renameListItem = (index, newItem) => {
        let currentList = this.state.currentList;
        currentList.items[index] = newItem;
        
        this.setState(prevState => ({
            currentList: prevState.currentList,
        }), () => {
            let list = this.db.queryGetList(this.state.currentList.key);
            list.items[index] = newItem;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        })
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        // MANUALLY CLOSE THE LIST
        this.setState( ({
            currentList: null
        }), () => {
            // CLEAR ALL TRANSACTIONS
            this.tps.clearAllTransactions();
            this.updateUndoRedo();
            
            // DO NORMAL LOADLIST STUFF
            let newCurrentList = this.db.queryGetList(key);
            this.setState(prevState => ({
                currentList: newCurrentList,
                sessionData: prevState.sessionData,
                canClose: true
            }), () => {
                // ANY AFTER EFFECTS?
            });
        })
        
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            keyNamePairMarkedForDeletion : prevState.keyNamePairMarkedForDeletion,
            sessionData: this.state.sessionData,
            canClose: false
        }), () => {
            // ANY AFTER EFFECTS?
            this.tps.clearAllTransactions();
            this.updateUndoRedo();
        });
    }
    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState(({
            keyNamePairMarkedForDeletion: keyNamePair
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.showDeleteListModal();
    }
    confirmDeleteList = () => {
        // WE MAY NEED TO RESET CURRENT LIST
        if (this.state.currentList != null && this.state.keyNamePairMarkedForDeletion.key === this.state.currentList.key) {
            this.closeCurrentList();
        }

        // REMOVE KEY FROM KEY NAME PAIRS
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        newKeyNamePairs.splice(newKeyNamePairs.indexOf(this.state.keyNamePairMarkedForDeletion), 1);
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // DELETE FROM STATE
        this.setState( prevState => ({
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // DELETE LIST FROM DB
            this.db.mutationDeleteList(this.state.keyNamePairMarkedForDeletion.key);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });

        this.hideDeleteListModal();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    moveStart = (index) => {
        this.setState( ({
            moveStartIndex: index
        }), () => {
            // ANY AFTER EFFECTS?
            // NO FUCK OFF
        });
    }
    moveEnd = (index) => {
        this.setState( ({
            moveEndIndex: index
        }), () => {
            // ANY AFTER EFFECTS?
            if (this.state.moveStartIndex !== this.state.moveEndIndex) {
                this.addMoveItemTransaction();
            }
        });
    }
    addMoveItemTransaction = () => {
        let transaction = new MoveItem_Transaction(this.moveItem, this.state.moveStartIndex, this.state.moveEndIndex);
        this.tps.addTransaction(transaction);
        this.updateUndoRedo();
    }
    moveItem = (start, end) => {
        let currentList = this.state.currentList;
        currentList.items.splice(end, 0, currentList.items.splice(start, 1)[0]);
        
        this.setState(prevState => ({
            currentList: prevState.currentList,
        }), () => {
            let list = this.db.queryGetList(this.state.currentList.key);
            list = currentList;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        })
    }
    handleKeyDown = (event) => {
        if (event.key === "z" || event.key === "y" || event.key === "Control") {
            if (!this.state.keysDown.includes(event.key)) {
                let updatedKeys = [...this.state.keysDown, event.key];
                this.setState(({
                    keysDown: updatedKeys
                }), () => {
                    if (this.state.keysDown.includes("z") && this.state.keysDown.includes("Control")) {
                        this.undo();
                    }
                    if (this.state.keysDown.includes("y") && this.state.keysDown.includes("Control")) {
                        this.redo();
                    }
                });
            }
        }
    }
    handleKeyUp = (event) => {
        if (event.key === "z" || event.key === "y" || event.key === "Control") {
            if (this.state.keysDown.includes(event.key)) {
                let updatedKeys = this.state.keysDown;
                updatedKeys.splice(updatedKeys.indexOf(event.key), 1);
                this.setState({
                    keysDown: updatedKeys
                })
            }
        }
    }
    render() {
        return (
            <div id="app-root" tabIndex="-1" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    canClose={this.state.canClose}
                    canUndo={this.state.canUndo}
                    canRedo={this.state.canRedo}
                    />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                    editingCallback={this.editing}
                    canClose={this.state.canClose}
                />
                <Workspace
                    renameListItemCallback={this.addChangeItemTransaction}
                    moveStartCallback={this.moveStart}
                    moveEndCallback={this.moveEnd}
                    editingCallback={this.editing}
                    currentList={this.state.currentList} />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    keyNamePairMarkedForDeletion={this.state.keyNamePairMarkedForDeletion}
                    deleteListCallback={this.deleteList}
                    confirmDeleteListCallback={this.confirmDeleteList}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
            </div>
        );
    }
}

export default App;
