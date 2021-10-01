import React from "react";

export default class Statusbar extends React.Component {
    render() {
        const {currentList} = this.props;
        let name = "";
        if (currentList) {
            name = "Top 5 " + currentList.name;
        }
        return (
            <div id="top5-statusbar">
                {name}
            </div>
        )
    }
}