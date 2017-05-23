import $ from "jquery";
import createPopup from "./page/createPopup.js";


const html = $(`
    <div class="corncob__popup">
            <div class="kernel__quintile">
            <span class="swatch" style="background-color: #eff"></span>
            <span class="number">${"1"}<sup>${"st"}</sup></span> Quintile
        </div>
        <div class="kernel__rank">
            <span class="number"><sup>\#</sup>128</span>
            out of 366 in Mike's hospital
        </div>
    </div>`);


$(function(){

    // there's something funky with the page load and measuring elements.
    // in our app, all the popups will be user initiated, so this shouldn't be an issue...
    setTimeout(() => {
        testTop();
        testBottom();
        testRight();
        testLeft();
    }, 1000);


    const popup = createPopup({
        container: ".js-popup-canvas",
        offset: 0,
        triangle: "top",
        flipToContain: true,
        closeBtn: false,
        title: "Woo!",
        html: html.clone(),
        isHidden: true
    });

    $(".js-popup-canvas").on("mousemove", (e) => {
        popup.setState({
            top: e.offsetY,
            left: e.offsetX,
            isHidden: false
        });
    });

    $(".js-popup-canvas").on("mouseleave", (e) => {
        popup.hidePopup();
    });


    $("input:radio[name ='triangle']").on("change", () => {
        popup.setState({
            triangle: $("input:radio[name ='triangle']:checked").val()
        });
    });



})


function testLeft(){

    const dot1 = $("<div class='dot' style='top: 50px; left: 50px;' />");
    const dot2 = $(`<div class='dot' style='top: ${$(".left-test").height()/2}px; left: 50px;' />`);
    const dot3 = $(`<div class='dot' style='top: ${$(".left-test").height() - 50}px; left: 50px;' />`);

    $(".left-test").append(dot1);
    $(".left-test").append(dot2);
    $(".left-test").append(dot3);


    createPopup({
        container: ".left-test",
        offset: 0,
        top: parseInt(dot1.css("top")),
        left: parseInt(dot1.css("left")),
        triangle: "left",
        closeBtn: false,
        title: "Left triangle top edge",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".left-test",
        offset: 0,
        top: parseInt(dot2.css("top")),
        left: parseInt(dot2.css("left")),
        triangle: "left",
        closeBtn: false,
        title: "Left triangle  middle",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".left-test",
        offset: 0,
        top: parseInt(dot3.css("top")),
        left: parseInt(dot3.css("left")),
        triangle: "left",
        closeBtn: false,
        title: "Left triangle bottom edge",
        html: html.clone(),
        isHidden: false
    });
}

function testRight(){

    const dot1 = $(`<div class='dot' style='top: 50px; left: ${$(".right-test").width() - 50}px;' />`);
    const dot2 = $(`<div class='dot' style='top: ${$(".left-test").height()/2}px;  left: ${$(".right-test").width() - 50}px;' />`);
    const dot3 = $(`<div class='dot' style='top: ${$(".right-test").height() - 50}px; left: ${$(".right-test").width() - 50}px;' />`);

    $(".right-test").append(dot1);
    $(".right-test").append(dot2);
    $(".right-test").append(dot3);


    createPopup({
        container: ".right-test",
        offset: 0,
        top: parseInt(dot1.css("top")),
        left: parseInt(dot1.css("left")),
        triangle: "right",
        closeBtn: false,
        title: "Right triangle top edge",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".right-test",
        offset: 0,
        top: parseInt(dot2.css("top")),
        left: parseInt(dot2.css("left")),
        triangle: "right",
        closeBtn: false,
        title: "Right triangle middle",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".right-test",
        offset: 0,
        top: parseInt(dot3.css("top")),
        left: parseInt(dot3.css("left")),
        triangle: "right",
        closeBtn: false,
        title: "Right triangle bottom edge",
        html: html.clone(),
        isHidden: false
    });
}


function testBottom(){

    const dot1 = $("<div class='dot' style='top: 250px; left: 30px;' />");
    const dot2 = $(`<div class='dot' style='top: 250px; left: ${$(".bottom-test").width()/2}px;' />`);
    const dot3 = $(`<div class='dot' style='top: 250px; left: ${$(".bottom-test").width() - 50}px;' />`);

    $(".bottom-test").append(dot1);
    $(".bottom-test").append(dot2);
    $(".bottom-test").append(dot3);

    createPopup({
        container: ".bottom-test",
        offset: 0,
        top: parseInt(dot1.css("top")),
        left: parseInt(dot1.css("left")),
        triangle: "bottom",
        closeBtn: false,
        title: "Bottom triangle left edge",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".bottom-test",
        offset: 0,
        top: parseInt(dot2.css("top")),
        left: parseInt(dot2.css("left")),
        triangle: "bottom",
        closeBtn: false,
        title: "Bottom triangle middle",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".bottom-test",
        offset: 0,
        top: parseInt(dot3.css("top")),
        left: parseInt(dot3.css("left")),
        triangle: "bottom",
        closeBtn: false,
        title: "Bottom triangle right edge",
        html: html.clone(),
        isHidden: false
    });
}

function testTop() {


    const dot1 = $("<div class='dot' style='top: 100px; left: 30px;' />");
    const dot2 = $(`<div class='dot' style='top: 100px; left: ${$(".top-test").width()/2}px;' />`);
    const dot3 = $(`<div class='dot' style='top: 100px; left: ${$(".top-test").width() - 40}px;' />`);

    $(".top-test").append(dot1);
    $(".top-test").append(dot2);
    $(".top-test").append(dot3);


    createPopup({
        container: ".top-test",
        offset: 0,
        top: parseInt(dot1.css("top")),
        left: parseInt(dot1.css("left")),
        triangle: "top",
        closeBtn: false,
        title: "Top triangle left edge",
        html: html.clone(),
        isHidden: false
    });

    createPopup({
        container: ".top-test",
        offset: 0,
        top: parseInt(dot2.css("top")),
        left: parseInt(dot2.css("left")),
        triangle: "top",
        closeBtn: false,
        title: "Top triangle middle",
        html: html.clone(),
        isHidden: false
    });


    createPopup({
        container: ".top-test",
        offset: 0,
        top: parseInt(dot3.css("top")),
        left: parseInt(dot3.css("left")),
        triangle: "top",
        closeBtn: false,
        title: "Top triangle right edge",
        html: html.clone(),
        isHidden: false
    });
}
