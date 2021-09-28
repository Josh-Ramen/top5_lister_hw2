import React from "react";

export default class ItemCard extends React.Component {
    
    render() {
        const {currentList, index} = this.props;

        return(
            <div className="top5-item">{currentList.items[index]}</div>
        )
    }
}