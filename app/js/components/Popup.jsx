/**
 * This is not used! But wanted to have the code in source
 * control if we wanted to use it in the future
 *

import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import $ from "jquery";
import calculatePopupOffsets from "../utils/calculatePopupOffsets.js";

const Popup = React.createClass({

    propTypes: {
        title   : PropTypes.string.isRequired,
        top     : PropTypes.number.isRequired,
        left    : PropTypes.number.isRequired,
        html    : PropTypes.string.isRequired
    },

    getInitialState() {
        return {
            isHidden: true,
            offsets: {
                popupLeft: 0,
                popupRight: 0
            }
        };
    },

    componentDidMount() {
        this.showPopup();
    },

    componentDidUpdate(prevProps, prevState) {
        // add or remove the event listeners
        (!this.state.isHidden) ? this.addListeners() : this.removeListeners();
    },

    addListeners() {
        window.addEventListener("click", this.handleClickAway, true);
        window.addEventListener("resize", this.handleClickAway, true);
    },

    removeListeners() {
        window.removeEventListener("click", this.handleClickAway, true);
        window.removeEventListener("resize", this.handleClickAway, true);
    },

    handleClickAway(e) {
        // if the user clicked outside of the popup, close it
        const inPopup = $(e.target).closest(".popup").length;
        if (!inPopup){ this.closePopup(); }
    },

    showPopup() {
        this.setState({
            isHidden: false
        });
    },

    closePopup() {
        this.setState({ isHidden: false });
    },

    render() {

        const { title, html, top, left } = this.props;

        const popupClasses = classNames("popup", "is-triangle-top", {
            "is-hidden": this.state.isHidden
        });


        const popupStyles = { top, left };


        return (
            <div className={popupClasses} style={popupStyles}>
                <div className="popup__title">{title}</div>
                <div className="popup__triangle"></div>
                <div className="popup__x-icon">
                    <svg className="svg-x"> <use xlinkHref="img/svg-sprite.svg#x"></use> </svg>
                </div>

                <div className="popup__content" dangerouslySetInnerHTML={{__html: html}}></div>
            </div>
        );
    }
});



export function createPopup({ title = "", top, left, offsetY, html }){

    const $mount = $("<div>").addClass("popup-mount");
    $("body").append($mount);

    const offsets = calculatePopupOffsets({
        popup: $mount,
        top, left, offsetY
    });

    ReactDOM.render(
        <Popup
            top={offsets.popupTop}
            left={offsets.popupLeft}
            offsetY={offsetY}
            html={html}
        />,
        $mount.get(0)
    )

}
*/
