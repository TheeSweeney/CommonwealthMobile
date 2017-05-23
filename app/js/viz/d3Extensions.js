
export function moveToFront(selection){
  return selection.each(function() {
    this.parentNode.appendChild(this);
  });
}

export function moveToBack(selection) {
  return selection.each(function() {
    var firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
}