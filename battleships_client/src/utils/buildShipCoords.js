
// builds an array of the ship coords given the three params
// point: [5,3], layout: 'vertical', length : 3
// returns [[5,3], [5,4], [5,5]]

export default function ({ point, layout, length }) {
    const tempArray = [point];
    for (let i = 1; i < length; i++) {
        if (layout === 'horizontal') {
            const nextCoord = [tempArray[i - 1][0] + 1, point[1]];
            tempArray.push(nextCoord);
        }
        if (layout === 'vertical') {
            const nextCoord = [point[0], tempArray[i - 1][1] + 1];
            tempArray.push(nextCoord);
        }
    }
    return tempArray;
}
