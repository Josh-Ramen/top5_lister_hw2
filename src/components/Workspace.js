import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            moveStartIndex: -1,
            moveEndIndex: -1
        }
    }

    beginMove = (index) => {
        this.setState({
            moveStartIndex: index
        });
        console.log("Start: " + this.state.moveStartIndex);
    }

    endMove = (index) => {
        this.setState({
            moveEndIndex: index
        });
        console.log("End: " + this.state.moveEndIndex);
        //this.props.moveItemCallback(this.state.moveStartIndex, this.state.moveEndIndex);
    }

    render() {
        const { currentList,
                renameListItemCallback,
                moveStartCallback,
                moveEndCallback} = this.props;
        if (currentList) {
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                            <ItemCard
                            currentList={currentList}
                            index={0}
                            renameListItemCallback={renameListItemCallback}
                            moveStartCallback={moveStartCallback}
                            moveEndCallback={moveEndCallback}/>
                            <ItemCard
                            currentList={currentList}
                            index = {1}
                            renameListItemCallback={renameListItemCallback}
                            moveStartCallback={moveStartCallback}
                            moveEndCallback={moveEndCallback}/> 
                            <ItemCard
                            currentList={currentList}
                            index = {2}
                            renameListItemCallback={renameListItemCallback}
                            moveStartCallback={moveStartCallback}
                            moveEndCallback={moveEndCallback}/>
                            <ItemCard
                            currentList={currentList}
                            index = {3}
                            renameListItemCallback={renameListItemCallback}
                            moveStartCallback={moveStartCallback}
                            moveEndCallback={moveEndCallback}/>
                            <ItemCard
                            currentList={currentList}
                            index = {4}
                            renameListItemCallback={renameListItemCallback}
                            moveStartCallback={moveStartCallback}
                            moveEndCallback={moveEndCallback}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                        </div>
                    </div>
                </div>
            )
        }
    }
}