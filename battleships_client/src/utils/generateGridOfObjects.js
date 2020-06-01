
export default function (gridSize) {
    const xAxisArr = [];
    for (let y = 0; y < gridSize; y += 1) {
        const yAxisArr = [];
        for (let x = 0; x < gridSize; x += 1) {
            yAxisArr.push({ x, y });
        }
        xAxisArr.push(yAxisArr);
    }
    return xAxisArr;
}
