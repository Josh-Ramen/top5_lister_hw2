import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
    render() {
        const {currentList} = this.props;
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
                            index={0}/> 
                            <ItemCard
                            currentList={currentList}
                            index = {1}/> 
                            <ItemCard
                            currentList={currentList}
                            index = {2}/>
                            <ItemCard
                            currentList={currentList}
                            index = {3}/>
                            <ItemCard
                            currentList={currentList}
                            index = {4}/>
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