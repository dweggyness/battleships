
export default function (gridSize) {
    const xAxisArr = [];
    for (let y = 0; y < gridSize; y++) {
        const yAxisArr = [];
        for (let x = 0; x < gridSize; x++) {
            yAxisArr.push({ x, y });
        }
        xAxisArr.push(yAxisArr);
    }
    return xAxisArr;
}
