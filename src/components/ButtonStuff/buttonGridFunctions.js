import update from 'immutability-helper'
import './functionPrototypes.js'

export function dragHandler(
    e,
    direction,
    cellId,
    lastUpdateSteps,
    setUpdateStepsCallback,
    layout,
    clickLocation,
    zoom,
    width,
    rowHeight,
    cols,
    stateUpdateCallback
) {
    let newLayout = null,
        cellWidth = null
    e.persist()
    //the same function can do horizontal and vertical dragging, you just rotate the button, do the dragging, and then rotate back
    if (direction == 'horizontal') {
        newLayout = _.clone(layout)
        cellWidth = width / cols
    } else {
        newLayout = _.clone(layout)
        newLayout = newLayout.transposeLayout()
        cellWidth = rowHeight
    }
    let stepsDragged = checkWhereItsGoing(
        e,
        direction,
        clickLocation,
        zoom,
        cellWidth
    )
    if (stepsDragged == null || stepsDragged == lastUpdateSteps) return
    let draggedElements = [findInLayout(cellId, newLayout)]
    let neighbours = getNeighbours(draggedElements, 'left', newLayout)
    if (neighbours.length == 0) return
    while (!checkBorderMatch(draggedElements, neighbours)) {
        if (
            getClusterBounds(draggedElements).height >
            getClusterBounds(neighbours).height
        ) {
            neighbours = getNeighbours(draggedElements, 'left', newLayout)
        } else {
            draggedElements = getNeighbours(neighbours, 'right', newLayout)
        }
    }
    //keep withing allowed ranges
    var deltaSteps = stepsDragged - lastUpdateSteps
    for (let i = 0; i < draggedElements.length; i++) {
        let newItemWidth = draggedElements[i].w - deltaSteps
        if (
            newItemWidth < 1 ||
            (direction == 'horizontal' && newItemWidth > cols)
        )
            return
    }

    for (let i = 0; i < neighbours.length; i++) {
        let newItemWidth = neighbours[i].w + deltaSteps
        if (
            newItemWidth < 1 ||
            (direction == 'horizontal' && newItemWidth > cols)
        )
            return
    }
    //
    for (let i = 0; i < draggedElements.length; i++) {
        let elementPosition = whichInLayout(draggedElements[i].i, newLayout)
        newLayout = update(newLayout, {
            [elementPosition]: {
                x: { $set: draggedElements[i].x + deltaSteps },
                w: { $set: draggedElements[i].w - deltaSteps },
            },
        })
    }

    for (var i = 0; i < neighbours.length; i++) {
        let elementPosition = whichInLayout(neighbours[i].i, newLayout)
        newLayout = update(newLayout, {
            [elementPosition]: {
                x: { $set: newLayout[elementPosition].x },
                w: { $set: neighbours[i].w + deltaSteps },
            },
        })
    }

    if (direction == 'vertical') newLayout = newLayout.transposeLayout()
    stateUpdateCallback(newLayout)
    setUpdateStepsCallback(stepsDragged)
}

function checkWhereItsGoing(e, direction, clickLocation, zoom, cellWidth) {
    if (e.clientX == 0 || e.clientY == 0) return null
    var dl =
        direction == 'horizontal'
            ? e.clientX - clickLocation.x
            : e.clientY - clickLocation.y
    dl /= zoom
    var newW = Math.floor(Math.abs(dl) / cellWidth)
    newW = Math.sign(dl) * newW
    return newW
}

function checkBorderMatch(draggedElements, neighbours) {
    let boundsDragged = getClusterBounds(draggedElements)
    let boundsNeighbours = getClusterBounds(neighbours)
    if (
        boundsDragged.y != boundsNeighbours.y ||
        boundsDragged.maxY != boundsNeighbours.maxY
    )
        return false
    return true
}

function whichInLayout(itemID, layout) {
    for (let i = 0; i < layout.length; i++) {
        if (layout[i].i == itemID) return i
    }
    return null
}

function findInLayout(itemID, layout) {
    for (let i = 0; i < layout.length; i++) {
        if (layout[i].i == itemID) return layout[i]
    }
    return null
}

function getClusterBounds(cluster) {
    let result = {
        x: 99999,
        y: 99999,
        maxX: 0,
        maxY: 0,
        height: 0,
        width: 0,
    }
    for (let i = 0; i < cluster.length; i++) {
        let bounds = getCellBounds(cluster[i])
        result.x = Math.min(result.x, bounds.x)
        result.y = Math.min(result.y, bounds.y)
        result.maxX = Math.max(result.maxX, bounds.maxX)
        result.maxY = Math.max(result.maxY, bounds.maxY)
    }
    result.width = result.maxX - result.x
    result.height = result.maxY - result.y
    return result
}

function getCellBounds(layoutElement) {
    let result = new Object()
    result.x = layoutElement.x
    result.y = layoutElement.y
    result.maxX = layoutElement.x + layoutElement.w - 1
    result.maxY = layoutElement.y + layoutElement.h - 1
    result.width = result.maxX - result.x + 1
    result.height = result.maxY - result.y + 1
    return result
}

function getNeighbours(items, position, layout) {
    var itemBounds = getClusterBounds(items)
    var neighbours = []
    for (var i = 0; i < layout.length; i++) {
        var boundsX = getCellBounds(layout[i])
        switch (position) {
            case 'left':
                if (
                    boundsX.maxX + 1 == itemBounds.x &&
                    !(
                        boundsX.maxY < itemBounds.y ||
                        boundsX.y > itemBounds.maxY
                    )
                )
                    neighbours.push(layout[i])
                break
            case 'right':
                if (
                    boundsX.x - 1 == itemBounds.maxX &&
                    !(
                        boundsX.maxY < itemBounds.y ||
                        boundsX.y > itemBounds.maxY
                    )
                )
                    neighbours.push(layout[i])
                break
            case 'top':
                if (
                    boundsX.maxY + 1 == itemBounds.y &&
                    !(
                        boundsX.maxX < itemBounds.x ||
                        boundsX.x > itemBounds.maxX
                    )
                )
                    neighbours.push(layout[i])
                break
            case 'bottom':
                if (
                    boundsX.y - 1 == itemBounds.maxY &&
                    !(
                        boundsX.maxX < itemBounds.x ||
                        boundsX.x > itemBounds.maxX
                    )
                )
                    neighbours.push(layout[i])
                break
        }
    }
    return neighbours
}

function blocksFromItem(item) {
    var targetHeight = item.h
    var targetWidth = item.w
    var targetX = item.x
    var targetY = item.y
    var blocks = boundsToBlocks(targetX, targetY, targetWidth, targetHeight)
    return blocks
}

function boundsToBlocks(x, y, width, height) {
    var blocks = []
    for (var i = x; i < x + width; i++) {
        for (var j = y; j < y + height; j++) {
            var block = new Object()
            block.x = i
            block.y = j
            blocks.push(block)
        }
    }
    return blocks
}

function checkMissingBlocks(neighbour, missing, original) {
    var checkBlocks = []
    checkBlocks = checkBlocks.concat(neighbour)
    var bounds = missing.getBounds()
    var boundsLN = neighbour.getBounds()
    for (var i = bounds.minX; i <= bounds.maxX; i++) {
        for (var j = boundsLN.minY; j <= boundsLN.maxY; j++) {
            var obj = new Object()
            obj.x = i
            obj.y = j
            checkBlocks.push(obj)
        }
    }
    return checkIfOverlappingBlocks(original, checkBlocks)
}

function checkOverlappingAllowed(blocksAfterDragged, blocksI, orientation) {
    var overlapping = getOverlappingBlocks(blocksAfterDragged, blocksI)
    for (var i = 0; i < overlapping.length; i++) {
        for (var j = 0; j < blocksI.length; j++) {
            switch (orientation) {
                case 'horizontal':
                    if (blocksI[j].x == overlapping[i].x) {
                        if (!overlapping.hasBlock(blocksI[j])) return false
                    }
                    break
                case 'vertical':
                    if (blocksI[j].y == overlapping[i].y) {
                        if (!overlapping.hasBlock(blocksI[j])) return false
                    }
                    break
            }
        }
    }
    return true
}

function getOverlappingBlocks(blocks1, blocks2) {
    var overlapping = []
    for (var i = 0; i < blocks1.length; i++) {
        var block1 = blocks1[i]
        for (var j = 0; j < blocks2.length; j++) {
            var block2 = blocks2[j]
            if (block1.x == block2.x && block1.y == block2.y)
                overlapping.push(block1)
        }
    }
    return overlapping
}
