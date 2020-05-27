
export default function (width, height) {
    const yAxisArr = [];
    for (let y = 0; y < height; y += 1) {
        const xAxisArr = [];
        for (let x = 0; x < width; x += 1) {
            xAxisArr.push({});
        }
        yAxisArr.push(xAxisArr);
    }
    return yAxisArr;
}
