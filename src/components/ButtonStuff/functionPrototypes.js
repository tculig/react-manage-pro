import update from 'immutability-helper';

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };
  Number.prototype.between = function(min, max) {
    return this >= min && this <= max;
  };

Array.prototype.getBoundsArray = function() {
    let minX=100,minY=100,maxX=(-1),maxY=(-1);
    for(let i=0;i<this.length;i++){
        let element = this[i];
        for(let j=0;j<element.length;j++){
            let block = element[j];
            if(block.x<minX) minX = block.x;
            if(block.y<minY) minY = block.y;
            if(block.x>maxX) maxX = block.x;
            if(block.y>maxY) maxY = block.y;
        }
    }
    let result = new Object();
    result.minX = minX;
    result.minY = minY;
    result.maxX = maxX;
    result.maxY = maxY;
    result.width = maxX-minY+1;
    result.height = maxY-minY+1;
    return result;};

Array.prototype.getBounds = function() {
    let minX=100,minY=100,maxX=(-1),maxY=(-1);
        for(let j=0;j<this.length;j++){
            let block = this[j];
            if(block.x<minX) minX = block.x;
            if(block.y<minY) minY = block.y;
            if(block.x>maxX) maxX = block.x;
            if(block.y>maxY) maxY = block.y;
        }
        let result = new Object();
    result.minX = minX;
    result.minY = minY;
    result.maxX = maxX;
    result.maxY = maxY;
    result.x = minX;
    result.y = minY;
    result.width = maxX-minX+1;
    result.height = maxY-minY+1;
    return result;};
    
Array.prototype.hasBlock = function(block) {
        for(var i=0;i<this.length;i++){
           var element = this[i];
            if(block.x==null){
                if(block.y==element.y) return true;
            }else if(block.y==null){
                if(block.x==element.x) return true;
            }else
           if(block.x==element.x && block.y==element.y) return true;
       } return false;};
      
Array.prototype.transposeLayout = function() {
    for(var i=0;i<this.length;i++){
        this[i] = update(this[i],
            {x:{$set: this[i].y},
            w:{$set: this[i].h},
            y:{$set: this[i].x},
            h:{$set: this[i].w}
        }
            );
    }
    return this;
};