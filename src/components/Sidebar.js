import React from "react";
import ListCard from "./ListCard";

export default class Sidebar extends React.Component {
    handleClick = () => {
        if (!this.props.canClose) {
            this.props.createNewListCallback();
        }
    }
    render() {
        let addClass = "top5-button";
        if (this.props.canClose) {
            addClass = addClass + "-disabled";
        }
        const { heading,
                currentList,
                keyNamePairs,
                deleteListCallback, 
                loadListCallback,
                renameListCallback,
                editingCallback} = this.props;
        return (
            <div id="top5-sidebar">
                <div id="sidebar-heading">
                    <input 
                        type="button" 
                        id="add-list-button" 
                        onClick={this.handleClick}
                        className={addClass} 
                        value="+" />
                    {heading}
                </div>
                <div id="sidebar-list">
                {
                    keyNamePairs.map((pair) => (
                        <ListCard
                            key={pair.key}
                            keyNamePair={pair}
                            selected={(currentList !== null) && (currentList.key === pair.key)}
                            deleteListCallback={deleteListCallback}
                            loadListCallback={loadListCallback}
                            renameListCallback={renameListCallback}
                            editingCallback={editingCallback}
                        />
                    ))
                }
                </div>
            </div>
        );
    }
}