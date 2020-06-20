export default function (point, arr) { // point: [x,y] , arr: [[x1,y1],[x2,y2],...]
    const [x, y] = point;

    const result = arr.some((coordinate) => {
        const [comparisonX, comparisonY] = coordinate;
        if (x === comparisonX && y === comparisonY) return true;
        return false;
    });

    return result;
}
