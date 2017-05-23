import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import classNames from "classnames";
import { scrollBodyTo } from "../page/initNav.js";

const CalloutBox = React.createClass({

    propTypes: {
        titleHtml: PropTypes.string,
        bodyHtml: PropTypes.string,
        labelHtml: PropTypes.string,
        expandable: PropTypes.bool,
        fade: PropTypes.bool,
        onAnimationFrame: PropTypes.func
    },

    getDefaultProps(){
        return {
            labelHtml: <h2>Expandable Box</h2>,
            titleHtml: "",
            bodyHtml: "",
            expandable: true,
            onAnimationFrame: () => {}
        };
    },

    getInitialState(){
        return {
            isOpen: false
        };
    },

    // on mount, hide/show the body immediately
    // (we can't do this in render because we need to animate it when the user
    // clicks the toggle button)
    componentDidMount() {
        const body = $(this.refs["body"]);
        $(body).css({ display: (this.state.isOpen || !this.props.expandable || this.props.fade) ? "block" : "none" });
        if(this.props.fade){
            $(body).css({ height: "100px"});
        }
        
    },

    componentDidUpdate(prevProps, prevState){
        // if the isOpen state changed
        if (prevState.isOpen !== this.state.isOpen){

            const $body = $(this.refs["body"]);

            // slide the body up or down
            if (!this.state.isOpen){
                $body.animate({height: this.props.fade ? "100px": "0px"}, { progress: this.props.onAnimationFrame });
            }
            else {
                $body.css("height", "auto").hide().slideDown({ progress: this.props.onAnimationFrame });
            }

            // scroll the body to the top of the box when it collapses
            scrollBodyTo($(this.refs["container"]).offset().top - 16, 400);
        }

        if (this.props.expandable === false){
            const $body = $(this.refs["body"]);
            $body.show();
        }
    },

    handleToggleClick(){
        this.setState({ isOpen: !this.state.isOpen });
    },

    render() {

        const { bodyHtml, titleHtml, labelHtml, expandable } = this.props;
        const { isOpen } = this.state;

        const calloutBoxClasses = classNames("callout-box", {
            "is-expanded" : isOpen
        });

        return (
            <div className={calloutBoxClasses} ref="container">

                <div className="callout-box__label-wrapper">
                    <div className="callout-box__label" dangerouslySetInnerHTML={{__html: labelHtml}} />
                </div>

                {(titleHtml) && (
                    <div className="callout-box__title" dangerouslySetInnerHTML={{__html: titleHtml}} />
                )}
                <div className="callout-box__body"  dangerouslySetInnerHTML={{__html: bodyHtml}} ref="body"/>

                { // expand collapse button
                (expandable) && (
                    <div className="callout-box__toggle" onClick={this.handleToggleClick}>
                        {isOpen ? "Close" : "Expand"}
                    </div>
                )}

            </div>
        );
    }
});

export default CalloutBox;


/**
 * grab the callout boxes in the dom and attach the react component
 * @param  {String} selector: jquery selector to find each element to attach to
 * @param  {Function} onAnimationFrame: function to be called on each tick while expanding/collapsing
 * @return {Nothing}
 *
 *  Example DOM structure
 *  <div class="js-expandable-box" [data-label="This is optional"]>
 *      <div class="js-title">Chicago’s South Side: Identifying Community Assets and Priorities to Study and Improve Urban Health</div>
 *      <div class="js-body">Suspendisse ex est, dapibus in commodo eget, <strong>pretium a enim.</strong> Nunc consequat nisl et sodales feugiat. Donec quis vulputate metus. Integer cursus lectus leo, in feugiat odio tincidunt et. Aliquam quam justo, efficitur id mi elementum, tempus fermentum ex. Sed vitae lacus aliquam, viverra velit vitae, egestas nulla. Morbi lobortis odio quis gravida hendrerit. Phasellus gravida, felis a posuere vestibulum, eros ipsum pellentesque velit, eu ornare eros tellus sed dolor. Nunc vitae bibendum nibh. Praesent lacinia augue ac lectus eleifend faucibus. Suspendisse ex est, dapibus in commodo eget, pretium a enim. Nunc consequat nisl et sodales feugiat. Donec quis vulputate metus. Integer cursus lectus leo, in feugiat odio tincidunt et. Aliquam quam justo, efficitur id mi elementum, tempus fermentum ex. Sed vitae lacus aliquam, viverra velit vitae, egestas nulla. Morbi lobortis odio quis gravida hendrerit. Phasellus gravida, felis a posuere vestibulum, eros ipsum pellentesque velit, eu ornare eros tellus sed dolor. Nunc vitae bibendum nibh. Praesent lacinia augue ac lectus eleifend faucibus. </div>
 *  </div>
 */
export function attachCalloutBoxToDom({ selector, expandable, onAnimationFrame }){

    $(selector).each(function(i, el){

        const labelHtml =  $(el).find(".js-label").html() || "";
        const bodyHtml = $(el).find(".js-body").html() || "";
        const titleHtml = $(el).find(".js-title").html() || "";
        const isFaded = $(el).hasClass("fade");

        ReactDOM.render(
            <CalloutBox
                titleHtml        = {titleHtml}
                bodyHtml         = {bodyHtml}
                labelHtml        = {labelHtml}
                expandable       = {expandable}
                fade             = {isFaded}
                onAnimationFrame = {onAnimationFrame}
            />,
            el
        );
    });
}
